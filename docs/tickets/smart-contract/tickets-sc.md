

### As Smart Contract, I should an accompanying WASM proxy to collect user payments

Since purchasing a ticket requires transferring CSPR from the account main purse to the contract, we would need to use a WASM-proxy implementing the [reusable purse approach](https://docs.casper.network/resources/tutorials/advanced/transfer-token-to-contract/#scenario2).

```bash
#[no_mangle]
pub extern "C" fn call() {
    let amount: U512 = runtime::get_named_arg(ARG_AMOUNT);
    let lottery_contract_hash: ContractHash =
        runtime::get_named_arg(ARG_LOTTERY_CONTRACT_HASH);
    let lottery_contract_entry_point: String =
        runtime::get_named_arg(ARG_LOTTERY_CONTRACT_HASH);

    let contract_treasure_purse: URef = runtime::call_contract(
        lottery_contract_hash,
        LOTTERY_CONTRACT_GET_TREASURY_PURSE_ENTRY_POINT_NAME,
        runtime_args! {},
    );

    system::transfer_from_purse_to_purse(
        account::get_main_purse(),
        contract_treasure_purse,
        amount,
        None,
    )
    .unwrap_or_revert();

    runtime::call_contract(
        lottery_contract_hash,
        lottery_contract_entry_point,
        runtime_args! {}
    )
}
```

For this implementation, the contract has to implement the `get_treasure_purse` entry point that returns the purse with the `ADD` access only:

```bash
treasury_purse.into_add()
```

### As Smart Contract, I should provide the possibility to configure the application

The smart contract should provide the `configure` entry point available only for the contract owner. The `configure` entry point should accept values for all the configurable contract state variables, which it should validate and set for the contract. The primary goal for this entry point to provide possibility for tuning the contract after it’s already deployed.

### As Smart Contract, I should provide the possibility to top up the prize pool

To make the app look nice from the launch we want to have a possibility to top up the prize pool. The smart contract should provide the `top_up_prize_pool` entry point, that:

1. Accepts the `amount` argument
2. Transfers the corresponding amount of CSPR from the caller to the `treasury_purse`
3. Increases the `treasure_purse_balance` state variable
4. Increases the `prize_pool` state variable

This entry point should be called with a help of the WASM proxy.

### As Smart Contract, I should provide the possibility to transfer collected fees

The smart contract should provide the `transfer_fees_to_account` entry point available only for the contract owner. The entry point should:

1. Accept the `amount` argument
2. Accept the `account_hash` argument
3. Transfer the corresponding amount of CSPR to from the `treasury_purse` to the account’s main purse
4. Decrease the `collected_fees` state variable by the `amount`

### As Smart Contract, I should have tests

The title is self-explanatory.

### As Smart Contract, I should have Makefile

The Makefile should contain all the basic commands needed to test or build the smart contract


### As Event Handler, I should have instructions

A README file should be provided explaining the smart contract API and providing test and build instructions

### As Event Handler, I should track the plays

The event handler is a part of the server application, which we want to be developed in NodeJS. The event handler should be a process that subscribes to the `play` Lottery contract event via [CSPR.cloud Streaming API](https://docs.cspr.cloud/streaming-api/contract-level-events). The CSPR.cloud keys should be passed to the process via an env variable, and the actual value should not be present in the repository. The lottery contract package hash should be provided via the env variable as well.

Here’s an example of WebSocket subscription to CSPR.cloud [https://github.com/mssteuer/rekt-server/blob/master/rekt-server.js#L25](https://github.com/mssteuer/rekt-server/blob/master/rekt-server.js#L25). Note, that the WebSocket connection should automatically reconnect when closed.

The `play` event should be stored as a `Play` entity, with extra fields:

- `deploy_hash` (hash of the deploy)
- `round_id`
- `play_id`
- `player_account_hash`
- `prize_amount`
- `is_jackpot`
- `timestamp` (deploy timestamp)

The event handler should MySQL or PostreSQL as the data storage and interact with it using the [https://sequelize.org/](https://sequelize.org/) library.

Taking into account that we want developers to be able to use this example on hackathons we should start with the directory structure that allows expansion. It could be something like that:

```bash
entity/
    play.ts
repository/
    play.ts
    round.ts
docker/
    event-handler.dockerfile
    api.dockerfile
migrations/
    20240319_initial.sql
.env.example
event-handler.ts
api.ts
package.json
package-lock.json
Makefile
README.md
```

### As Event Handler, I should be containerized

A Dockerfile should be provided for the event handler application

### As Event Handler, I should have run instructions

A README file should be provided explaining the event handler application and providing the build instructions. It’s expected that the setup and run commands will be provided in the `Makefile`






