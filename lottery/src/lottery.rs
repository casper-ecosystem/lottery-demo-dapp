use odra::casper_types::bytesrepr::Bytes;
use odra::casper_types::U256;
use odra::casper_types::U512;
use odra::prelude::*;
use odra::Address;
use odra::OdraError;
use odra::SubModule;
use odra::Var;
use odra_modules::access::Ownable;
use odra_modules::erc721::erc721_base::Erc721Base;
use odra_modules::erc721::Erc721;

#[derive(OdraError)]
pub enum Error {
    LotteryIsNotActive = 1,
    WrongPayment = 2,
    LotteryInProgress = 3,
}

#[odra::module]
pub struct Lottery {
    ownable: SubModule<Ownable>,
    erc721: SubModule<Erc721Base>,
    ticket_price: Var<U512>,
    starts_at: Var<u64>,
    ends_at: Var<u64>,
    next_index: Var<U256>,
    winner: Var<Address>,
}

#[odra::module]
impl Lottery {
    pub fn init(&mut self, ticket_price: U512, starts_at: u64, ends_at: u64) {
        self.ownable.init();
        self.ticket_price.set(ticket_price);
        self.starts_at.set(starts_at);
        self.ends_at.set(ends_at);
        self.next_index.set(U256::zero());
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

    pub fn ticket_price(&self) -> U512 {
        self.ticket_price.get_or_default()
    }

    #[odra(payable)]
    pub fn buy_ticket(&mut self) {
        self.assert_active();
        self.assert_deposit();
        let caller = self.env().caller();
        self.erc721.balances.add(&caller, U256::one());
        self.erc721
            .owners
            .set(&self.next_index.get_or_default(), Some(caller));
        self.next_index.add(U256::one());
    }

    pub fn starts_at(&self) -> u64 {
        self.starts_at.get_or_default()
    }

    pub fn winner(&self) -> Address {
        match self.winner.get() {
            None => self.env().revert(Error::LotteryInProgress),
            Some(addr) => return addr,
        }
    }

    pub fn resolve_lottery(&mut self, seed: [u8; 32]) {
        self.ownable.assert_owner(&self.env().caller());
        let winner_index = self.get_random_number(seed);
        let winner_addr = self.owner_of(&U256::from(winner_index));
        self.env()
            .transfer_tokens(&winner_addr, &self.env().self_balance());
        self.winner.set(winner_addr);
    }

    pub fn get_random_number(&self, seed: [u8; 32]) -> u64 {
        let timestamp = self.env().get_block_time();
        let max: u64 = self.next_index.get_or_default().as_u64();

        let mut salted_seed = [0u8; 80];

        salted_seed[..32].copy_from_slice(&seed);

        salted_seed[32..40].copy_from_slice(&timestamp.to_be_bytes());

        let hashed_data = self.env().hash(&salted_seed);

        u64::from_be_bytes(hashed_data[..8].try_into().unwrap()) % max
    }

    fn assert_active(&self) {
        let current_timestamp = self.env().get_block_time();
        if self.starts_at.get_or_default() > current_timestamp
            || self.ends_at.get_or_default() < current_timestamp
        {
            self.env().revert(Error::LotteryIsNotActive);
        }
    }

    fn assert_deposit(&self) {
        if self.env().attached_value() != self.ticket_price.get_or_default() {
            self.env().revert(Error::WrongPayment);
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
