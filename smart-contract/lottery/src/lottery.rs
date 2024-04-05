use core::cmp::min;
use odra::casper_types::URef;
use odra::casper_types::U256;
use odra::casper_types::U512;
#[cfg(target_arch = "wasm32")]
use odra::odra_casper_wasm_env::casper_contract::contract_api::storage;
use odra::prelude::*;
use odra::Address;
use odra::Mapping;
use odra::SubModule;
use odra::Var;
use odra_cep47;
use odra_cep47::cep47::Meta;
use odra_cep47::cep47::TokenId;
use odra_modules::access::Ownable;

/// Unique identifier for a lottery round
pub type RoundId = u32;

/// Struct representing a lottery round
#[odra::odra_type]
pub struct Round {
    starts_at: u64,
    ends_at: u64,
}

/// Custom error type for the lottery contract
#[odra::odra_error]
pub enum Error {
    LotteryIsNotActive = 1,
    WrongPayment = 2,
    LotteryInProgress = 3,
    RoundNotFound = 4,
    ContractPaused = 5,
    InvalidProbabiliy = 6,
}

/// Event emitted when a user enters the lottery
#[odra::event]
pub struct Play {
    /// ID of the round the user entered
    pub round_id: RoundId,
    /// Address of the player
    pub player: Address,
    /// Unique identifier for the player's entry
    pub play_id: U256,
    /// Timestamp of the entry
    pub timestamp: u64,
    /// Prize won by the player (if any)
    pub prize: U512,
    /// Flag indicating if the entry won the jackpot
    pub is_jackpot: bool,
}

/// Possible outcomes of a lottery play
enum Outcome {
    Jackpot,
    ConsolationPrize(U512),
    NoWin,
}

/// Main lottery contract struct
#[odra::module(events = [Play])]
pub struct Lottery {
    /// Ownable sub-module for managing contract ownership
    ownable: SubModule<Ownable>,
    /// CEP-47 token sub-module for managing the lottery NFT
    cep47: SubModule<odra_cep47::cep47::Cep47>,
    /// Mapping to store rounds data
    rounds: Mapping<RoundId, Round>,
    /// Variable to store the ID of the next round
    next_round: Var<u32>,
    /// Variable to store the ID for the next play
    next_play_id: Var<U256>,
    /// Flag indicating if the contract is paused
    is_paused: Var<bool>,
    /// Variable to store collected fees
    collected_fees: Var<U512>,
    /// Variable to store the current prize pool
    prize_pool: Var<U512>,
    /// Variable to store the maximum consolation prize
    max_consolation_prize: Var<U512>,
    /// Variable to store the lottery fee
    lottery_fee: Var<U512>,
    /// Variable to store the jackpot winning probability
    jackpot_probability: Var<u8>,
    /// Variable to store the consolation prize winning probability
    consolation_prize_probability: Var<u8>,
    /// Variable to store the ID of the active round (if any)
    active_round: Var<u32>,
    /// Variable to store the ticket price
    ticket_price: Var<U512>,
    /// Variable to store the token metadata
    token_meta: Var<Meta>,
}

#[odra::module]
impl Lottery {
    /// Initializes the lottery contract with configuration parameters
    pub fn init(
        &mut self,
        lottery_fee: U512,
        ticket_price: U512,
        max_consolation_prize: U512,
        jackpot_probability: u8,
        consolation_prize_probability: u8,
        name: String,
        symbol: String,
        meta: Meta,
        token_meta: Meta,
    ) {
        self.ownable.init();
        self.cep47.init(name, symbol, meta);
        self.next_round.set(1);
        self.collected_fees.set(U512::zero());
        self.prize_pool.set(U512::zero());
        self.lottery_fee.set(lottery_fee);
        self.ticket_price.set(ticket_price);
        self.max_consolation_prize.set(max_consolation_prize);
        self.assert_probability(jackpot_probability);
        self.jackpot_probability.set(jackpot_probability);
        self.assert_probability(consolation_prize_probability);
        self.consolation_prize_probability
            .set(consolation_prize_probability);
        self.next_play_id.set(U256::one());
        self.token_meta.set(token_meta);
    }

    /// Functions from the submodules that are public in our smart contract
    delegate! {
        to self.cep47 {
            fn name(&self) -> String;
            fn symbol(&self) -> String;
            fn meta(&self) -> BTreeMap<String, String>;
            fn total_supply(&self) -> U256;
            fn balance_of(&self, owner: Address)-> U256;
            fn owner_of(&self, token_id: TokenId) -> Option<Address>;
            fn token_meta(&self, token_id: TokenId) -> Option<Meta>;
            fn get_token_by_index(&self, owner: Address, index: U256) -> Option<TokenId>;
        }

        to self.ownable {
            fn get_owner(&self) -> Address;
            fn transfer_ownership(&mut self, new_owner: &Address);
        }
    }

    /*
    Admin
    */

    /// Pauses the lottery contract. Only the owner can call this.
    pub fn pause(&mut self) {
        self.ownable.assert_owner(&self.env().caller());
        self.is_paused.set(true);
    }

    /// Unpauses the lottery contract. Only the owner can call this.
    pub fn unpause(&mut self) {
        self.ownable.assert_owner(&self.env().caller());
        self.is_paused.set(false);
    }

    /// Creates a new round for the lottery.
    /// This function requires ownership and ensures the lottery is not paused.
    pub fn create_round(&mut self, starts_at: u64, ends_at: u64) -> RoundId {
        self.assert_not_paused();
        self.ownable.assert_owner(&self.env().caller());
        let current_round = self.next_round.get_or_default();
        self.rounds
            .set(&current_round, Round { starts_at, ends_at });
        self.next_round.add(1);
        self.active_round.set(current_round);
        current_round
    }

    /// Configures various settings for the lottery contract.
    /// This function requires ownership and ensures the lottery is not active.
    pub fn configure(
        &mut self,
        max_consolation_prize: Option<U512>,
        lottery_fee: Option<U512>,
        jackpot_probability: Option<u8>,
        consolation_prize_probability: Option<u8>,
        ticket_price: Option<U512>,
    ) {
        self.ownable.assert_owner(&self.env().caller());
        self.assert_not_active();

        if let Some(prize) = max_consolation_prize {
            self.max_consolation_prize.set(prize);
        }

        if let Some(fee) = lottery_fee {
            self.lottery_fee.set(fee);
        }

        if let Some(probability) = jackpot_probability {
            self.assert_probability(probability);
            self.jackpot_probability.set(probability);
        }

        if let Some(probability) = consolation_prize_probability {
            self.assert_probability(probability);
            self.consolation_prize_probability.set(probability);
        }

        if let Some(price) = ticket_price {
            self.ticket_price.set(price);
        }
    }

    /// Sets the token metadata
    /// This function requires ownership.
    pub fn set_token_meta(&mut self, meta: Meta) {
        self.ownable.assert_owner(&self.env().caller());
        self.token_meta.set(meta);
    }

    /// Withdraws the collected fees
    /// This function requires ownership.
    pub fn transfer_fees_to_account(&mut self, amount: U512, reciver: Address) {
        self.ownable.assert_owner(&self.env().caller());
        self.collected_fees.subtract(amount);
        self.env().transfer_tokens(&reciver, &amount);
    }

    /// Adds the attached value to the prize pool.
    /// This function requires ownership.
    #[odra(payable)]
    pub fn top_up_prize_pool(&mut self) {
        self.ownable.assert_owner(&self.env().caller());
        self.prize_pool.add(self.env().attached_value());
    }

    /*
    Transactions
    */

    /// Allows a user to participate in the current lottery round.
    ///
    /// This function requires the lottery to be not paused, active, and a deposit
    /// to be attached to the message.
    ///
    /// It performs the following actions:
    ///  - Adds the attached value to the prize pool, deducting the lottery fee.
    ///  - Mints a new token representing the user's participation.
    ///  - Determines the outcome (jackpot, consolation prize, or no win).
    ///  - Distributes prizes and emits an event based on the outcome.
    #[odra(payable)]
    pub fn play_lottery(&mut self) {
        self.assert_not_paused();
        self.assert_active();
        self.assert_deposit();
        let round_id = self.active_round.get_or_default();
        let play_id = self.next_play_id.get_or_default();
        let caller = self.env().caller();
        self.collected_fees.add(self.lottery_fee.get_or_default());
        self.prize_pool
            .add(self.env().attached_value() - self.lottery_fee.get_or_default());
        let meta = self.token_meta.get_or_default();
        match self.cep47.mint(caller, vec![play_id], vec![meta]) {
            Ok(_) => (),
            Err(err) => self.env().revert(err),
        }
        self.next_play_id.add(U256::one());
        match self.determine_outcome() {
            Outcome::Jackpot => {
                let prize = self.prize_pool.get_or_default();
                self.env().transfer_tokens(&caller, &prize);
                self.prize_pool.set(U512::zero());
                self.env().emit_event(Play {
                    round_id,
                    player: caller,
                    play_id,
                    timestamp: self.env().get_block_time(),
                    is_jackpot: true,
                    prize,
                })
            }
            Outcome::ConsolationPrize(prize) => {
                self.env().transfer_tokens(&caller, &prize);
                self.prize_pool.subtract(prize);
                self.env().emit_event(Play {
                    round_id,
                    player: caller,
                    play_id,
                    timestamp: self.env().get_block_time(),
                    is_jackpot: false,
                    prize,
                })
            }
            Outcome::NoWin => self.env().emit_event(Play {
                round_id,
                player: caller,
                play_id,
                timestamp: self.env().get_block_time(),
                is_jackpot: false,
                prize: U512::zero(),
            }),
        }
    }

    /*
    Queries
    */

    /// Returns the start time of a lottery round.
    /// It takes an optional `round_id` and retrieves the start time of the specified round if it exists. Otherwise reurns `None`.
    pub fn starts_at(&self, round_id: Option<RoundId>) -> Option<u64> {
        let round_id = round_id.unwrap_or(self.active_round.get_or_default());
        match self.rounds.get(&round_id) {
            Some(r) => Some(r.starts_at),
            None => None,
        }
    }

    /// Returns the end time of a lottery round.
    /// It takes an optional `round_id` and retrieves the end time of the specified round if it exists. Otherwise reurns `None`.
    pub fn ends_at(&self, round_id: Option<RoundId>) -> Option<u64> {
        let round_id = round_id.unwrap_or(self.active_round.get_or_default());
        match self.rounds.get(&round_id) {
            Some(r) => Some(r.ends_at),
            None => None,
        }
    }

    /// Retunrs the current prize pool of the lottery.
    pub fn prize_pool(&self) -> U512 {
        self.prize_pool.get_or_default()
    }

    /// Returns the ticket price for the lottery.
    pub fn ticket_price(&self) -> Option<U512> {
        self.ticket_price.get()
    }

    /*
    Internal
    */

    /// Determines lottery outcome based on random number and probabilities.
    /// Uses secure random number for WASM32 target.
    fn determine_outcome(&self) -> Outcome {
        let random_number = 4; // Used fair dice, so it is random
        #[cfg(target_arch = "wasm32")]
        let random_number = self.get_random_number(); // if in wasm, get "real", "random" number
        let total_probability = self.jackpot_probability.get_or_default()
            + self.consolation_prize_probability.get_or_default();

        if random_number <= self.jackpot_probability.get_or_default().into() {
            return Outcome::Jackpot;
        } else if random_number <= total_probability.into() {
            let max_consolation_prize = min(
                self.max_consolation_prize.get_or_default(),
                self.prize_pool.get_or_default(),
            )
            .as_u128();
            let scaling_factor = max_consolation_prize / 100;
            let consolation_prize =
                U512::from((scaling_factor * random_number as u128) % max_consolation_prize);
            return Outcome::ConsolationPrize(consolation_prize);
        } else {
            return Outcome::NoWin;
        }
    }

    /// Generates cryptographically secure random number (WASM32 only).
    #[cfg(target_arch = "wasm32")]
    fn get_random_number(&self) -> u64 {
        let timestamp = self.env().get_block_time();
        let mut salted_seed = [0u8; 80];

        //TODO: replace with `random_bytes` function once its available
        let uref: URef = storage::new_uref(1u8);
        salted_seed[..32].copy_from_slice(&uref.addr());

        salted_seed[32..40].copy_from_slice(&timestamp.to_be_bytes());

        let hashed_data = self.env().hash(&salted_seed);

        u64::from_be_bytes(hashed_data[..8].try_into().unwrap()) % 100
    }

    /// Ensures lottery is currently active. Reverts if not.
    fn assert_active(&self) {
        let current_timestamp = self.env().get_block_time();
        match self.rounds.get(&self.active_round.get_or_default()) {
            Some(r) => {
                if r.starts_at > current_timestamp || r.ends_at < current_timestamp {
                    self.env().revert(Error::LotteryIsNotActive);
                }
            }
            None => self.env().revert(Error::RoundNotFound),
        }
    }

    /// Ensures lottery is not currently active. Reverts if active.
    fn assert_not_active(&self) {
        let current_timestamp = self.env().get_block_time();
        match self.rounds.get(&self.active_round.get_or_default()) {
            Some(r) => {
                if r.starts_at < current_timestamp || r.ends_at > current_timestamp {
                    self.env().revert(Error::LotteryInProgress);
                }
            }
            None => (),
        }
    }

    /// Ensures contract is not paused. Reverts if paused.
    fn assert_not_paused(&self) {
        if self.is_paused.get_or_default() {
            self.env().revert(Error::ContractPaused)
        }
    }

    /// Ensures attached value matches ticket price. Reverts if wrong.
    fn assert_deposit(&self) {
        if self.env().attached_value() != self.ticket_price.get_or_default() {
            self.env().revert(Error::WrongPayment);
        }
    }

    /// Ensures probability value is within valid range (0-100). Reverts if invalid.
    fn assert_probability(&self, value: u8) {
        if value > 100 {
            self.env().revert(Error::InvalidProbabiliy)
        }
    }
}

#[cfg(test)]
mod tests {
    use crate::lottery::{Error, LotteryHostRef, LotteryInitArgs, Play};
    use odra::{
        casper_types::{U256, U512},
        host::{Deployer, HostRef},
    };
    use odra_cep47::cep47::Meta;

    /// Constant represenint one hour in miliseconds
    const ONE_HOUR_IN_MILISECONDS: u64 = 3_600_000;
    /// Constant representing 1 Casper
    const ONE_CSPR: u64 = 1_000_000_000;

    #[test]
    fn basic_flow() {
        let consolation = (ONE_CSPR * 49 / 100 * 4) % (ONE_CSPR * 49);
        print!("consolation: {:?}", consolation);
        let env = odra_test::env();
        let admin = env.get_account(0);
        let alice = env.get_account(1);
        let bob = env.get_account(2);
        let charlie = env.get_account(3);

        env.set_caller(admin);
        let mut contract = LotteryHostRef::deploy(
            &env,
            LotteryInitArgs {
                lottery_fee: U512::from(1 * ONE_CSPR),
                ticket_price: U512::from(50 * ONE_CSPR),
                max_consolation_prize: U512::from(50 * ONE_CSPR),
                jackpot_probability: 100,
                consolation_prize_probability: 40,
                name: String::from("lottery_demo"),
                symbol: String::from("LOT_DEMO"),
                meta: Meta::new(),
                token_meta: Meta::new(),
            },
        );
        let round_id = contract.create_round(ONE_HOUR_IN_MILISECONDS, 3 * ONE_HOUR_IN_MILISECONDS);
        assert_eq!(round_id, 1);
        assert_eq!(contract.ticket_price(), Some(U512::from(50 * ONE_CSPR)));
        assert_eq!(contract.starts_at(None), Some(ONE_HOUR_IN_MILISECONDS));

        env.set_caller(alice);
        assert_eq!(
            contract
                .with_tokens(U512::from(50 * ONE_CSPR))
                .try_play_lottery(),
            Err(Error::LotteryIsNotActive.into())
        );

        env.advance_block_time(ONE_HOUR_IN_MILISECONDS);

        assert_eq!(
            contract
                .with_tokens(U512::from(1 * ONE_CSPR))
                .try_play_lottery(),
            Err(Error::WrongPayment.into())
        );

        contract
            .with_tokens(U512::from(50 * ONE_CSPR))
            .play_lottery();

        assert!(env.emitted_event(
            contract.address(),
            &Play {
                round_id: 1,
                player: alice,
                play_id: U256::from(1),
                prize: U512::from(49 * ONE_CSPR),
                is_jackpot: true,
                timestamp: ONE_HOUR_IN_MILISECONDS,
            },
        ));
        assert_eq!(env.events_count(contract.address()), 2);
        assert_eq!(contract.balance_of(alice), U256::one());
        assert_eq!(contract.owner_of(U256::from(1)), Some(alice));

        env.set_caller(bob);
        contract
            .with_tokens(U512::from(50 * ONE_CSPR))
            .play_lottery();

        assert!(env.emitted_event(
            contract.address(),
            &Play {
                round_id: 1,
                player: bob,
                play_id: U256::from(2),
                prize: U512::from(49 * ONE_CSPR),
                is_jackpot: true,
                timestamp: ONE_HOUR_IN_MILISECONDS,
            },
        ));
        assert_eq!(env.events_count(contract.address()), 3);
        assert_eq!(contract.balance_of(bob), U256::one());
        assert_eq!(contract.owner_of(U256::from(2)), Some(bob));

        let inital_balance = env.balance_of(&charlie);
        env.set_caller(charlie);
        contract
            .with_tokens(U512::from(50 * ONE_CSPR))
            .play_lottery();

        assert!(env.emitted_event(
            contract.address(),
            &Play {
                round_id: 1,
                player: charlie,
                play_id: U256::from(3),
                prize: U512::from(49 * ONE_CSPR),
                is_jackpot: true,
                timestamp: ONE_HOUR_IN_MILISECONDS,
            },
        ));
        assert_eq!(env.events_count(contract.address()), 4);
        assert_eq!(contract.balance_of(charlie), U256::one());
        assert_eq!(contract.owner_of(U256::from(3)), Some(charlie));
        assert_eq!(
            inital_balance - U512::from(1 * ONE_CSPR),
            env.balance_of(&charlie)
        )
    }
}
