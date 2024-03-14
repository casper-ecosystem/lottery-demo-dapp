use odra::casper_types::U512;
use odra::prelude::*;
use odra::Address;
use odra::Mapping;
use odra::OdraError;
use odra::Var;

#[derive(OdraError)]
/// Errors that may occur during the contract execution.
pub enum Error {
    /// Insufficient balance for the requested transfer
    InsufficientBalance = 1,
    /// Caller is not the admin
    NotAdmin = 2,
    /// User already claimed their tokens
    AlreadyDistibuted = 3,
    /// Contract is paused
    ContractPaused = 4,
}

/// A module definition. Each module struct consists Vars and Mappings
/// or/and another modules.
#[odra::module]
pub struct Faucet {
    /// The module itself does not store the value,
    /// it's a proxy that writes/reads value to/from the host.
    admin: Var<Address>,
    paused: Var<bool>,
    distribution_amount: Var<U512>,
    distributed_to_addr: Mapping<Address, bool>,
    distributed_to_acc: Mapping<String, bool>,
}

/// Module implementation.
///
/// To generate entrypoints,
/// an implementation block must be marked as #[odra::module].
#[odra::module]
impl Faucet {
    /// Initializes the contract.
    pub fn init(&mut self, admin: Address, distribute_amount: U512) {
        self.admin.set(admin);
        self.paused.set(false);
        self.distribution_amount.set(distribute_amount);
    }

    /**********
     * TRANSACTIONS
     **********/

    #[odra(payable)]
    pub fn deposit(&self) {}

    pub fn distribute(&mut self, user_addr: Address, github_acc: String) {
        self.assert_not_paused();
        //TODO: assert the relayer contract is the caller
        if self.distributed_to_addr.get(&user_addr).is_some()
            || self.distributed_to_acc.get(&github_acc).is_some()
        {
            self.env().revert(Error::AlreadyDistibuted)
        }
        self.distributed_to_addr.set(&user_addr, true);
        self.distributed_to_acc.set(&github_acc, true);

        let amount = self.distribution_amount.get_or_default();

        if self.distribution_amount.get().unwrap() > self.balance() {
            self.env().revert(Error::InsufficientBalance)
        }
        self.env().transfer_tokens(&user_addr, &amount);
    }

    /**********
     * QUERIES
     **********/

    /// Returns the current contract balance (including potentially direct CSPR deposits).
    pub fn balance(&self) -> U512 {
        self.env().self_balance()
    }

    /**********
     * ADMIN
     **********/

    /// Pauses the contract. Panics if the caller is not the admin.
    pub fn admin_pause(&mut self) {
        self.assert_admin();
        self.paused.set(true);
    }

    /// Unpauses the contract. Panics if the caller is not the admin.
    pub fn admin_unpause(&mut self) {
        self.assert_admin();
        self.paused.set(false);
    }

    /**********
     * INTERNAL
     **********/

    /// Ensures the caller of the function is the admin.
    /// Reverts with `NotAdmin`` error if the caller is not the admin.
    fn assert_admin(&self) {
        if self.env().caller() != self.admin.get().unwrap() {
            self.env().revert(Error::NotAdmin)
        }
    }

    fn assert_not_paused(&self) {
        if self.paused.get_or_default() {
            self.env().revert(Error::ContractPaused);
        }
    }
}

#[cfg(test)]
mod tests {
    use super::{Error, FaucetHostRef, FaucetInitArgs};
    use odra::{
        casper_types::U512,
        host::{Deployer, HostRef},
    };

    #[test]
    fn distribute_flow() {
        let env = odra_test::env();
        let admin = env.get_account(0);
        let alice = env.get_account(1);
        let bob = env.get_account(2);

        let mut contract = FaucetHostRef::deploy(
            &env,
            FaucetInitArgs {
                admin: admin,
                distribute_amount: U512::one(),
            },
        );
        // fund the contract
        contract.with_tokens(U512::from(100)).deposit();
        assert_eq!(contract.balance(), U512::from(100));

        let alice_inital_balance = env.balance_of(&alice);
        contract.distribute(alice, "alice".to_string());
        assert_eq!(alice_inital_balance + U512::one(), env.balance_of(&alice));
        assert_eq!(contract.balance(), U512::from(99));

        //try to withdraw as bob with the same github account
        assert_eq!(
            contract.try_distribute(bob, "alice".to_string()),
            Err(Error::AlreadyDistibuted.into())
        );

        let bob_inital_balance = env.balance_of(&bob);
        contract.distribute(bob, "bob".to_string());
        assert_eq!(bob_inital_balance + U512::one(), env.balance_of(&bob));
        assert_eq!(contract.balance(), U512::from(98));
    }
}
