use odra::casper_types::bytesrepr::Bytes;
use odra::casper_types::U256;
use odra::casper_types::U512;
use odra::prelude::*;
use odra::Address;
use odra::Mapping;
use odra::OdraError;
use odra::OdraType;
use odra::SubModule;
use odra::Var;
use odra_modules::access::Ownable;
use odra_modules::erc721::erc721_base::Erc721Base;
use odra_modules::erc721::Erc721;

pub type RoundId = u32;

#[derive(OdraType, PartialEq, Debug)]
pub struct Round {
    starts_at: u64,
    ends_at: u64,
    ticket_price: U512,
    balance: U512,
    winner: Option<Address>,
    next_index: U256,
}

#[derive(OdraType, PartialEq, Debug)]
pub struct RoundView {
    starts_at: u64,
    ends_at: u64,
    ticket_price: U512,
    prize_pool: U512,
    winner: Option<Address>,
    num_of_participants: U256,
}

#[derive(OdraError)]
pub enum Error {
    LotteryIsNotActive = 1,
    WrongPayment = 2,
    LotteryInProgress = 3,
    RoundNotFound = 4,
    ContractPaused = 5,
}

#[odra::module]
pub struct Lottery {
    ownable: SubModule<Ownable>,
    erc721: SubModule<Erc721Base>,
    rounds: Mapping<RoundId, Round>,
    next_round: Var<u32>,
    is_paused: Var<bool>,
}

#[odra::module]
impl Lottery {
    pub fn init(&mut self) {
        self.ownable.init();
        self.next_round.set(1);
    }

    delegate! {
        to self.erc721 {
            fn balance_of(&self, owner: &Address) -> U256;
            fn owner_of(&self, token_id: &U256) -> Address;
            fn safe_transfer_from(&mut self, from: &Address, to: &Address, token_id: &U256);
            fn safe_transfer_from_with_data(
                &mut self,
                from: &Address,
                to: &Address,
                token_id: &U256,
                data: &Bytes
            );
            fn transfer_from(&mut self, from: &Address, to: &Address, token_id: &U256);
            fn approve(&mut self, approved: &Option<Address>, token_id: &U256);
            fn set_approval_for_all(&mut self, operator: &Address, approved: bool);
            fn get_approved(&self, token_id: &U256) -> Option<Address>;
            fn is_approved_for_all(&self, owner: &Address, operator: &Address) -> bool;
        }

        to self.ownable {
            fn get_owner(&self) -> Address;
            fn transfer_ownership(&mut self, new_owner: &Address);
        }
    }

    // Admnin
    pub fn pause(&mut self) {
        self.ownable.assert_owner(&self.env().caller());
        self.is_paused.set(true);
    }

    pub fn unpause(&mut self) {
        self.ownable.assert_owner(&self.env().caller());
        self.is_paused.set(false);
    }

    pub fn create_round(&mut self, starts_at: u64, ends_at: u64, ticket_price: U512) -> RoundId {
        self.assert_not_paused();
        self.ownable.assert_owner(&self.env().caller());
        let current_round = self.next_round.get_or_default();
        self.rounds.set(
            &current_round,
            Round {
                starts_at,
                ends_at,
                ticket_price,
                balance: U512::zero(),
                winner: None,
                next_index: U256::zero(),
            },
        );
        self.next_round.add(1);
        current_round
    }
    #[odra(payable)]
    pub fn top_up_prize_pool(&mut self, round_id: RoundId) {
        self.ownable.assert_owner(&self.env().caller());
        match self.rounds.get(&round_id) {
            Some(mut r) => {
                r.balance += self.env().attached_value();
                self.rounds.set(&round_id, r);
            }
            None => self.env().revert(Error::RoundNotFound),
        }
    }

    pub fn resolve_lottery(&mut self, round_id: RoundId, seed: [u8; 32]) {
        self.ownable.assert_owner(&self.env().caller());
        let winner_index = self.get_random_number(seed, round_id);
        let winner_addr = self.owner_of(&U256::from(winner_index));
        self.env()
            .transfer_tokens(&winner_addr, &self.env().self_balance());
        match self.rounds.get(&round_id) {
            Some(mut r) => {
                r.winner = Some(winner_addr);
                self.rounds.set(&round_id, r);
            }
            None => self.env().revert(Error::RoundNotFound),
        }
    }

    // Transactions
    #[odra(payable)]
    pub fn play_lottery(&mut self, round_id: RoundId) {
        self.assert_not_paused();
        self.assert_active(round_id);
        self.assert_deposit(round_id);
        let caller = self.env().caller();
        self.erc721.balances.add(&caller, U256::one());
        match self.rounds.get(&round_id) {
            Some(mut r) => {
                let round_id_shifted = (round_id as u64) << 16;
                self.erc721.owners.set(
                    &U256::from(round_id_shifted | r.next_index.as_u64()),
                    Some(caller),
                );
                r.next_index += U256::one();
                self.rounds.set(&round_id, r);
            }
            None => self.env().revert(Error::RoundNotFound),
        };
    }

    // Queries
    pub fn starts_at(&self, round_id: RoundId) -> Option<u64> {
        match self.rounds.get(&round_id) {
            Some(r) => Some(r.starts_at),
            None => None,
        }
    }

    pub fn ends_at(&self, round_id: RoundId) -> Option<u64> {
        match self.rounds.get(&round_id) {
            Some(r) => Some(r.ends_at),
            None => None,
        }
    }

    pub fn ticket_price(&self, round_id: RoundId) -> Option<U512> {
        match self.rounds.get(&round_id) {
            Some(r) => Some(r.ticket_price),
            None => None,
        }
    }

    pub fn winner(&self, round_id: RoundId) -> Option<Address> {
        match self.rounds.get(&round_id) {
            Some(r) => r.winner,
            None => None,
        }
    }

    pub fn round_view(&self, round_id: RoundId) -> Option<RoundView> {
        match self.rounds.get(&round_id) {
            Some(r) => Some(RoundView {
                starts_at: r.starts_at,
                ends_at: r.ends_at,
                ticket_price: r.ticket_price,
                winner: r.winner,
                prize_pool: r.balance,
                num_of_participants: r.next_index,
            }),
            None => None,
        }
    }

    // Internal
    fn get_random_number(&self, seed: [u8; 32], round_id: RoundId) -> u64 {
        let timestamp = self.env().get_block_time();
        let max = match self.rounds.get(&round_id) {
            Some(r) => r.next_index.as_u64(),
            None => self.env().revert(Error::RoundNotFound),
        };
        let mut salted_seed = [0u8; 80];

        salted_seed[..32].copy_from_slice(&seed);

        salted_seed[32..40].copy_from_slice(&timestamp.to_be_bytes());

        let hashed_data = self.env().hash(&salted_seed);

        let random_number = u64::from_be_bytes(hashed_data[..8].try_into().unwrap()) % max;

        // Combine the round_id (converted to u64) and the random number into a single u64 value
        // We use bit shifting to achieve the desired placement

        // Shift the round_id 16 bits to the left to make space for the random number at the ones place
        let round_id_shifted = (round_id as u64) << 16;

        // Combine the shifted round_id and the random number using bitwise OR
        round_id_shifted | random_number
    }

    fn assert_active(&self, round_id: RoundId) {
        let current_timestamp = self.env().get_block_time();
        match self.rounds.get(&round_id) {
            Some(r) => {
                if r.starts_at > current_timestamp || r.ends_at < current_timestamp {
                    self.env().revert(Error::LotteryIsNotActive);
                }
            }
            None => self.env().revert(Error::RoundNotFound),
        }
    }

    fn assert_not_paused(&self) {
        if self.is_paused.get_or_default() {
            self.env().revert(Error::ContractPaused)
        }
    }

    fn assert_deposit(&self, round_id: RoundId) {
        match self.rounds.get(&round_id) {
            Some(r) => {
                if self.env().attached_value() != r.ticket_price {
                    self.env().revert(Error::WrongPayment);
                }
            }
            None => self.env().revert(Error::RoundNotFound),
        }
    }
}

#[cfg(test)]
mod tests {
    use crate::lottery::{Error, LotteryHostRef, LotteryInitArgs};
    use odra::{
        casper_types::{U256, U512},
        host::{Deployer, HostRef},
    };

    const ONE_HOUR_IN_MILISECONDS: u64 = 3_600_000;
    const SEED: [u8; 32] = [
        1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25,
        26, 27, 28, 29, 30, 31, 32,
    ];

    #[test]
    fn buy_ticket() {
        let env = odra_test::env();
        let admin = env.get_account(0);
        let alice = env.get_account(1);
        let bob = env.get_account(2);
        let charlie = env.get_account(3);

        env.set_caller(admin);
        let mut contract = LotteryHostRef::deploy(
            &env,
            LotteryInitArgs {
                ticket_price: U512::from(5),
                starts_at: ONE_HOUR_IN_MILISECONDS,
                ends_at: 3 * ONE_HOUR_IN_MILISECONDS,
            },
        );
        assert_eq!(contract.ticket_price(), U512::from(5));
        assert_eq!(contract.starts_at(), ONE_HOUR_IN_MILISECONDS);

        env.set_caller(alice);
        assert_eq!(
            contract.with_tokens(U512::from(5)).try_buy_ticket(),
            Err(Error::LotteryIsNotActive.into())
        );

        env.advance_block_time(ONE_HOUR_IN_MILISECONDS);

        assert_eq!(
            contract.with_tokens(U512::from(1)).try_buy_ticket(),
            Err(Error::WrongPayment.into())
        );

        contract.with_tokens(U512::from(5)).buy_ticket();

        assert_eq!(contract.balance_of(&alice), U256::one());
        assert_eq!(contract.owner_of(&U256::zero()), alice);

        env.set_caller(bob);
        contract.with_tokens(U512::from(5)).buy_ticket();

        assert_eq!(contract.balance_of(&bob), U256::one());
        assert_eq!(contract.owner_of(&U256::one()), bob);

        env.set_caller(charlie);
        contract.with_tokens(U512::from(5)).buy_ticket();

        assert_eq!(contract.balance_of(&charlie), U256::one());
        assert_eq!(contract.owner_of(&U256::from(2)), charlie);

        let bob_inital_balance = env.balance_of(&bob);
        env.set_caller(admin);
        contract.resolve_lottery(SEED);
        assert_eq!(contract.winner(), bob);
        assert_eq!(bob_inital_balance + 15, env.balance_of(&bob))
    }
}
