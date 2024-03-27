use core::cmp::min;

use odra::casper_types::bytesrepr::Bytes;
use odra::casper_types::U256;
use odra::casper_types::U512;
use odra::prelude::*;
use odra::Address;
use odra::Event;
use odra::Mapping;
use odra::OdraError;
use odra::OdraType;
use odra::SubModule;
use odra::Var;
use odra_modules::access::Ownable;
use odra_modules::erc721::erc721_base::Erc721Base;
use odra_modules::erc721::Erc721;

pub type RoundId = u32;
const ONE_CSPR: u64 = 1_000_000_000;
const SEED: [u8; 32] = [
    1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26,
    27, 28, 29, 30, 31, 32,
];

#[derive(OdraType, PartialEq, Debug)]
pub struct Round {
    starts_at: u64,
    ends_at: u64,
}

#[derive(OdraError)]
pub enum Error {
    LotteryIsNotActive = 1,
    WrongPayment = 2,
    LotteryInProgress = 3,
    RoundNotFound = 4,
    ContractPaused = 5,
    InvalidProbabiliy = 6,
}

#[derive(Event, PartialEq, Eq, Debug)]
pub struct Play {
    pub round_id: RoundId,
    pub player: Address,
    pub play_id: U256,
    pub timestamp: u64,
    pub prize: U512,
    pub is_jackpot: bool,
}
enum Outcome {
    Jackpot,
    ConsolationPrize(U512),
    NoWin,
}

#[odra::module(events = [Play])]
pub struct Lottery {
    ownable: SubModule<Ownable>,
    erc721: SubModule<Erc721Base>,
    rounds: Mapping<RoundId, Round>,
    next_round: Var<u32>,
    next_play_id: Var<U256>,
    is_paused: Var<bool>,
    collected_fees: Var<U512>,
    prize_pool: Var<U512>,
    max_consolation_prize: Var<U512>,
    lottery_fee: Var<U512>,
    jackpot_probability: Var<u8>,
    consolation_prize_probability: Var<u8>,
    active_round: Var<u32>,
    ticket_price: Var<U512>,
}

#[odra::module]
impl Lottery {
    pub fn init(&mut self, jackpot_probability: u8, consolation_prize_probability: u8) {
        self.ownable.init();
        self.next_round.set(1);
        self.collected_fees.set(U512::zero());
        self.prize_pool.set(U512::zero());
        self.lottery_fee.set(U512::from(ONE_CSPR));
        self.ticket_price.set(U512::from(50 * ONE_CSPR));
        self.max_consolation_prize.set(U512::from(50 * ONE_CSPR));
        self.assert_probability(jackpot_probability);
        self.jackpot_probability.set(jackpot_probability);
        self.assert_probability(consolation_prize_probability);
        self.consolation_prize_probability
            .set(consolation_prize_probability);
        self.next_play_id.set(U256::one());
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

    // Admin
    pub fn pause(&mut self) {
        self.ownable.assert_owner(&self.env().caller());
        self.is_paused.set(true);
    }

    pub fn unpause(&mut self) {
        self.ownable.assert_owner(&self.env().caller());
        self.is_paused.set(false);
    }

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

    #[odra(payable)]
    pub fn top_up_prize_pool(&mut self) {
        self.ownable.assert_owner(&self.env().caller());
        self.prize_pool.add(self.env().attached_value());
    }

    // Transactions
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
        self.erc721.balances.add(&caller, U256::one());
        self.erc721.owners.set(&play_id, Some(caller));
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

    // Queries
    pub fn starts_at(&self, round_id: Option<RoundId>) -> Option<u64> {
        let round_id = round_id.unwrap_or(self.active_round.get_or_default());
        match self.rounds.get(&round_id) {
            Some(r) => Some(r.starts_at),
            None => None,
        }
    }

    pub fn ends_at(&self, round_id: Option<RoundId>) -> Option<u64> {
        let round_id = round_id.unwrap_or(self.active_round.get_or_default());
        match self.rounds.get(&round_id) {
            Some(r) => Some(r.ends_at),
            None => None,
        }
    }

    pub fn ticket_price(&self) -> Option<U512> {
        self.ticket_price.get()
    }

    // Internal
    fn determine_outcome(&self) -> Outcome {
        let random_number = self.get_random_number();
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

    fn get_random_number(&self) -> u64 {
        let timestamp = self.env().get_block_time();
        let mut salted_seed = [0u8; 80];

        //TODO: replace with `random_bytes` function once its available
        salted_seed[..32].copy_from_slice(&SEED);

        salted_seed[32..40].copy_from_slice(&timestamp.to_be_bytes());

        let hashed_data = self.env().hash(&salted_seed);

        u64::from_be_bytes(hashed_data[..8].try_into().unwrap()) % 100
    }

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

    fn assert_not_paused(&self) {
        if self.is_paused.get_or_default() {
            self.env().revert(Error::ContractPaused)
        }
    }

    fn assert_deposit(&self) {
        if self.env().attached_value() != self.ticket_price.get_or_default() {
            self.env().revert(Error::WrongPayment);
        }
    }

    fn assert_probability(&self, value: u8) {
        if value > 100 {
            self.env().revert(Error::InvalidProbabiliy)
        }
    }
}

#[cfg(test)]
mod tests {
    use crate::lottery::{Error, LotteryHostRef, LotteryInitArgs, Play, ONE_CSPR};
    use odra::{
        casper_types::{U256, U512},
        host::{Deployer, HostRef},
    };

    const ONE_HOUR_IN_MILISECONDS: u64 = 3_600_000;

    #[test]
    fn flow1() {
        let env = odra_test::env();
        let admin = env.get_account(0);
        let alice = env.get_account(1);
        let bob = env.get_account(2);
        let charlie = env.get_account(3);

        env.set_caller(admin);
        let mut contract = LotteryHostRef::deploy(
            &env,
            LotteryInitArgs {
                jackpot_probability: 30,
                consolation_prize_probability: 50,
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
                prize: U512::from(15190000000 as u128),
                is_jackpot: false,
                timestamp: ONE_HOUR_IN_MILISECONDS,
            },
        ));
        assert_eq!(env.events_count(contract.address()), 2);
        assert_eq!(contract.balance_of(&alice), U256::one());
        assert_eq!(contract.owner_of(&U256::from(1)), alice);

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
                prize: U512::from(15500000000 as u128),
                is_jackpot: false,
                timestamp: ONE_HOUR_IN_MILISECONDS,
            },
        ));
        assert_eq!(env.events_count(contract.address()), 3);
        assert_eq!(contract.balance_of(&bob), U256::one());
        assert_eq!(contract.owner_of(&U256::from(2)), bob);

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
                prize: U512::from(15500000000 as u128),
                is_jackpot: false,
                timestamp: ONE_HOUR_IN_MILISECONDS,
            },
        ));
        assert_eq!(env.events_count(contract.address()), 4);
        assert_eq!(contract.balance_of(&charlie), U256::one());
        assert_eq!(contract.owner_of(&U256::from(3)), charlie);
        assert_eq!(
            inital_balance - U512::from(50 * ONE_CSPR) + U512::from(15500000000 as u128),
            env.balance_of(&charlie)
        )
    }
}
