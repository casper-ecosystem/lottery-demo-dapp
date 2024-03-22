## Tickets


### As Example dApp, I should have DESIGN for the “Footer” section

TODO / Let’s discuss

### As Example dApp, I should have DESIGN for the “Home” page

The “Home” page will be divided into two sections:

1. Play section
Will be managing the users’ play experience
2. Plays section
Will be displaying the plays in the current jackpot round

**Play section**

The “Play” section should have a background image that fits the [CSPR.click](http://CSPR.click) bar and should contain:

1. A message saying “Play the lottery to win from the pool of 20,000 CSPR”
2. Depending on the state, one of the following:
    1. Onboarding state:
        1. A message saying “Please connect your Casper account to play!”
        2. A button saying “Connect”
    2. Play state:
        1. A message saying “Buy a ticket for 5 CSPR to get a chance to win the jackpot!”
        2. A button saying “Play”
    3. Waiting state should be a popup with:
        1. A message saying: “Waiting for the results of your play…”
    4. Result state should be a popup with:
        1. If won, a message saying “Congratulations, you have won 1,000 CSPR!”
        2. If won the jackpot, a message saying “Congratulations, you have won the jackpot of 20,000 CSPR!!!”
        3. If lost, a message saying “You did not win this time. Try again!”
        4. A button saying “Ok”

The play section should handle a couple of negative scenarios with a popup:

1. Not enough CSPR to buy a ticket should trigger a popup with:
    1. A message saying: “You don’t have enough CSPR to buy a ticket. Top up your account!”
    2. A button saying: “Request tokens”
2. The waiting state connection drop should trigger a popup with:
    1. A message saying: “Something went wrong. Please refresh the page.”
    2. A button saying: “Refresh”

**Plays section**

The “Plays” section should display the plays in the current jackpot round as table with the following columns:

1. Player: Account public key with an emoticon that links to the “Account” page on CSPR.live
2. Prize: Prize amount in CSPR with two decimals after the comma. The jackpot prize should have an icon indicating it’s the jackpot.
3. Time: Time in the 2024-03-18 12:59:59 format that links to the “Deploy” page on CSPR.live

The designs should be provided for the desktop and mobile layouts.

### As Example dApp, I should have DESIGN for the “Jackpots” page

The “Jackpot” page should have a title saying “Jackpots”

Below the title, the page should display past finished jackpots as a table with the following columns:

1. Round: A string saying “Round X”, where X is a number indicating the jackpot round starting 1
2. Winner: Account public key with an emoticon that links to the “Account” page on CSPR.live
3. Prize: Jackpot amount in CSPR
4. Ended: Time in the 2024-03-18 12:59:59

The table should be sorted by the “Round” column and should have pagination.

The designs should be provided for the desktop and mobile layouts.

### As Example dApp, I should have DESIGN for the “Jackpot plays” page

The “Plays” page should have a title saying “Jackpot #X plays”:

Below the title, the page should display plays as a table with the following columns:

1. Player: Account public key with an emoticon that links to the “Account” page on CSPR.live
2. Prize: Prize amount in CSPR with two decimals after the comma. The jackpot prize should have an icon indicating it’s the jackpot.
3. Time: Time in the 2024-03-18 12:59:59 format that links to the “Deploy” page on CSPR.live

The table should be sorted by the “Time” column and should have pagination.

The designs should be provided for the desktop and mobile layouts.

### As Example dApp, I should have DESIGN for the “My plays” page

The “Plays” page should have a title saying “My plays”:

Below the title, the plays as a table with the following columns:

1. Round: A string saying “Round X”, where X is a number indicating the jackpot round starting 1
2. Prize: Prize amount in CSPR with two decimals after the comma. The jackpot prize should have an icon indicating it’s the jackpot.
3. Time: Time in the 2024-03-18 12:59:59 format that links to the “Deploy” page on CSPR.live

The table should be sorted by the “Time” column and should have pagination.

The designs should be provided for the desktop and mobile layouts.

### As Example dApp, I should have DESIGN for the “About” page

The “About” page should have a title saying “About”

Below the title, the page should display the following text:

This is an example decentralized application, or dApp, built on the Casper Network, which is a layer 1 proof-of-stake (PoS) blockchain that prioritizes security and decentralization. Casper was built with developer needs in mind and supports features such as upgradable smart contracts or multi-signature transactions on the protocol level. Casper smart contracts are run in a WASM virtual machine creating a possibility to use a wider variety of languages for smart contract development.

This application was created to onboard software engineers to the Casper blockchain and the Web3 architecture in general. Unlike traditional Web2 applications, in Web3, users may interact with blockchain directly. It changes the traditional paradigm of how information flows between users and the application and forces the application to observe the network activity and react correspondingly. 

To ease the integration, this example was developed with the help of higher-level abstractions that address those specific challenges of Web3 development and elevate the developer experience.

![Screenshot 2024-03-15 at 13.58.30.png](PWB%20Example%20dApp%2045f75ec514824451bec862c4b7a9a587/Screenshot_2024-03-15_at_13.58.30.png)

[CSPR.click](http://CSPR.click) is a Web3 authentication layer that covers the end-user interaction with the blockchain. It provides integration with all the wallets in the Casper Ecosystem and greets users with a well-known Single-Sign-On like experience.

Odra is a smart contract framework written in Rust that abstracts the chain-specific details behind a familiar OOP interface. Odra encourages rapid development and clean, pragmatic design.

[CSPR.cloud](http://CSPR.cloud) is an enterprise-grade middleware layer for the Casper Network. It observes and indexes the network activity and provides access to it via a scalable REST API and real-time WebSocket subscriptions. For lower-level interactions, CSPR.cloud gives access to the native Casper Node RPC API.

Learn more about CSPR.click, CSPR.cloud, Odra, and the Casper Network by checking out the links below:

- [https://docs.cspr.click](https://docs.cspr.click/)
- [https://docs.cspr.cloud](https://docs.cspr.cloud/)
- [https://github.com/odradev/odra](https://github.com/odradev/odra)
- [https://casper.network](https://casper.network/)


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

### As API, I provide the possibility to fetch the jackpot rounds data

The API should be a simple [https://expressjs.com/](https://expressjs.com/) application. For this task, the following endpoint should be added:

```bash
GET /rounds
```

That returns a paginated list of `Round` entities with the following properties:

- `round_id`
- `plays_num`
- `jackpot_amount`
- `winner_account_hash`
- `winner_public_key`
- `ended_at`

The jackpot data should be calculated over the `plays` table using a query like the following one which should be provided as `getRounds(offset, limit)` function in the `Round` repository:

```bash
select 
    p.round_id, 
    w.plays_num, 
    p.prize_amount as jackpot_amount, 
    p.player_account_hash as winner_account_hash, 
    p.timestamp as ended_at 
from plays p
join (
    select max(play_id) as play_id, count(*) as plays_num
    from plays 
    group by round_id
) w on w.play_id = p.play_id
order by p.round_id desc;
```

The `winner_public_key` should be deanonimized from the `winner_account_hash` in the API handler using [CSPR.cloud Account API](https://docs.cspr.cloud/rest-api/account/get-accounts). Let’s implement it as a utility `addPublicKeys(data, accountHashProperty, publicKeyProperty)` because we’ll reuse it for three endpoints.

### As API, I provide the possibility to fetch the jackpot round ata

The following endpoint should be added:

```bash
GET /rounds/:round_id
```

That returns the `Round` entity with the following properties:

- `round_id`
- `plays_num`
- `jackpot_amount`
- `winner_account_hash`
- `winner_public_key`
- `ended_at`

The jackpot data should be calculated over the `plays` table using a query like the following one which should be provided as `getRound(id)` function in the `Round` repository:

```bash
select 
    p.round_id, 
    w.plays_num, 
    p.prize_amount as jackpot_amount, 
    p.player_account_hash as winner_account_hash, 
    p.timestamp as ended_at 
from plays p
join (
    select max(play_id) as play_id, count(*) as plays_num
    from plays 
    where round_id = :round_id
    group by round_id
) w on w.play_id = p.play_id
order by p.round_id desc;
```

The `winner_public_key` should be deanonimized from the `winner_account_hash` in the API handler using [CSPR.cloud Account API](https://docs.cspr.cloud/rest-api/account/get-accounts)

### As API, I provide the possibility to fetch the plays data

The following endpoint should be added:

```bash
GET /plays
```

The endpoint should accept the following filters:

- `player_account_hash`
- `round_id`

E.g.

```bash
GET /plays?player_account_hash=dead...beef
```

Which implies those properties should be indexed in the `plays` table.

The endpoint should return a paginated list of `Play` entities with the following properties:

- `deploy_hash`
- `round_id`
- `play_id`
- `player_account_hash`
- `player_public_key`
- `prize_amount`
- `is_jackpot`
- `timestamp`

The jackpot data should be calculated over the `plays` table using a query like the following one which should be provided as `findPlays(filters, offset, limit)` function in the `Play` repository.

The `player_public_key` should be deanonimized from the `player_account_hash` in the API handler using [CSPR.cloud Account API](https://docs.cspr.cloud/rest-api/account/get-accounts)

### As API, I provide the possibility to fetch the account balance

The following endpoint should be added:

```bash
GET /accounts/:account_hash
```

The endpoint should proxy to [CSPR.cloud Account API](https://docs.cspr.cloud/rest-api/account/get-account)

### As API, I provide the possibility to subscribe to the plays channel

The following WebSocket connection should be added:

```bash
WS /plays?deploy_hash=dead...beef
```

which should proxy to the [CSPR.cloud Streaming API](https://docs.cspr.cloud/streaming-api/contract-level-events). 

Since [CSPR.cloud](http://CSPR.cloud) Streaming API doesn’t allow filtering contract-level events by the deploy hash, it should be done in the Lottery API. 

The purpose of the endpoint is to provide a real-time experience when playing the game.

### As API, I should be containerized

A Dockerfile should be provided for the API application

### As API, I have run instructions

A README file should be updated with the API application instructions. It’s expected that the setup and run commands will be provided in the `Makefile`

### As Example dApp, I should be bootstrapped

The client application should be bootstrapped from the [CSPR.click template](https://www.npmjs.com/package/@make-software/cra-template-csprclick-react):

```bash
npx create-react-app lottery-app/client --template @make-software/csprclick-react
```

The design was created considering the template styling to reuse as much of the existing components as possible and to fit into the template stylistically.

### As Example dApp, I should have the “Header” section

The header section should be the standard [CSPR.click](http://CSPR.click) bar without the currency, language, and network selectors, but with the following custom links:

- Home (leads to `/`)
- About (leads to `/about`)
- Jackpots (leads to `/jackpots`)

The [CSPR.click](http://CSPR.click) Account menu should be expanded with the following link:

- My plays (leads to `/my-plays`)

### As Example dApp, I should have the “Footer” section

TODO / Let’s discuss

### As Example dApp, I should have the “Play” section on “Home” page

The “Play” section section should be implemented according to the design provided in Figma. For this task the client application would need to fetch the last jackpot round data to read the correct jackpot pool amount:

```bash
GET /rounds?limit=1
```

The current round should be in the page state, because it will be used in the “Plays” section as well.

The ticket cost should be provided via the configuration. Note, that since it’s a front-end application the configuration should come from the templatized config file, which will be generated during the deployment process.

### As Example dApp, I should provide the possibility to play

The play logic starts by clicking the “Play” button, which opens the “Play” popup. Depending on the state, it can be in one of the following forms:

1. Onboarding state (user is not connected)
    1. A message saying “Please connect your Casper account to play!”
    2. A button saying “Connect” that triggers the [CSPR.click](http://CSPR.click) connection popup
2. Play state:
    1. A message saying “Buy a ticket for 50 CSPR to get a chance to win the jackpot!”
        1. The ticket price should come from the configuration
    2. A button saying “Play” that creates a deploy that calls the `play` entry point through the WASM proxy.
3. Waiting state should be a popup with:
    1. A message saying: “Waiting for the results of your play…”
4. Winning state:
    1. A message saying “Congratulations, you have won 1,000 CSPR!”
    2. A button saying “Play more” that creates a deploy that calls the `play` entry point through the WASM proxy
5. Jackpot winning state:
    1. A message saying “Congratulations, you have won the jackpot of 20,000 CSPR!!!”
    2. A button saying “Play more” that creates a deploy that calls the `play` entry point through the WASM proxy
6. Losing state
    1. A message saying “You did not win this time. Try again!”
    2. A button saying “Try again” that creates a deploy that calls the `play` entry point through the WASM proxy

Note, that you may see a bit different messaging in the design. Please use what you think is appropriate.

### As Example dApp, I should have the “Plays” section on “Home” page

The “Plays” section should be implemented according to the design and display a table with the last 10 plays in the current jackpot round with a possibility to load more:

1. Player: Account public key with an emoticon that links to the “Account” page on CSPR.live
2. Prize: Prize amount in CSPR with two decimals after the comma. The jackpot prize should have an icon indicating it’s the jackpot.
3. Time: Time in the 2024-03-18 12:59:59 format that links to the “Deploy” page on CSPR.live

The data should be sorted by the “Time” column

### As Example dApp, I should have the “Jackpots” page

The “Jackpots” page should be accessible from the top-navigation menu under `/jackpots` . The page should be implemented according to the design and display a table with the last 10 finished jackpots (excluding the current jackpot round) with a possibility to load more:

1. Round: A string saying “Round X”, where X is a number indicating the jackpot round starting 1
2. Winner: Account public key with an emoticon that links to the “Account” page on CSPR.live
3. Prize: Jackpot amount in CSPR
4. Ended: Time in the 2024-03-18 12:59:59

The table should be sorted by the “Round” column

### As Example dApp, I should have the “Jackpot plays” page

The “Jackpot plays” page should be accessible from the “Jackpots” apge table under `/jackpots/:round_id/plays` . The page should be implemented according to the design and display a table with the last 10 plays for the given jackpot with a possibility to load more:

1. Player: Account public key with an emoticon that links to the “Account” page on CSPR.live
2. Prize: Prize amount in CSPR with two decimals after the comma. The jackpot prize should have an icon indicating it’s the jackpot.
3. Time: Time in the 2024-03-18 12:59:59 format that links to the “Deploy” page on CSPR.live

The data should be sorted by the “Time” column

### As Example dApp, I should have the “My plays” page

The “My plays” page should be accessible from the “Account” submenu under `/my-plays` . The page should be implemented according to the design and display a table with the last 10 plays for the currently connected account with a possibility to load more:

1. Player: Account public key with an emoticon that links to the “Account” page on CSPR.live
2. Prize: Prize amount in CSPR with two decimals after the comma. The jackpot prize should have an icon indicating it’s the jackpot.
3. Time: Time in the 2024-03-18 12:59:59 format that links to the “Deploy” page on CSPR.live

The data should be sorted by the “Time” column

### As Example dApp, I should have  the “About” page

The “About” page should be implemented according to the design, and have the following content:

This is an example decentralized application, or dApp, built on the Casper Network, which is a layer 1 proof-of-stake (PoS) blockchain that prioritizes security and decentralization. Casper was built with developer needs in mind and supports features such as upgradable smart contracts or multi-signature transactions on the protocol level. Casper smart contracts are run in a WASM virtual machine creating a possibility to use a wider variety of languages for smart contract development.

This application was created to onboard software engineers to the Casper blockchain and the Web3 architecture in general. Unlike traditional Web2 applications, in Web3, users may interact with blockchain directly. It changes the traditional paradigm of how information flows between users and the application and forces the application to observe the network activity and react correspondingly. 

To ease the integration, this example was developed with the help of higher-level abstractions that address those specific challenges of Web3 development and elevate the developer experience.

![Screenshot 2024-03-15 at 13.58.30.png](PWB%20Example%20dApp%2045f75ec514824451bec862c4b7a9a587/Screenshot_2024-03-15_at_13.58.30.png)

[CSPR.click](http://CSPR.click) is a Web3 authentication layer that covers the end-user interaction with the blockchain. It provides integration with all the wallets in the Casper Ecosystem and greets users with a well-known Single-Sign-On like experience.

Odra is a smart contract framework written in Rust that abstracts the chain-specific details behind a familiar OOP interface. Odra encourages rapid development and clean, pragmatic design.

[CSPR.cloud](http://CSPR.cloud) is an enterprise-grade middleware layer for the Casper Network. It observes and indexes the network activity and provides access to it via a scalable REST API and real-time WebSocket subscriptions. For lower-level interactions, CSPR.cloud gives access to the native Casper Node RPC API.

Learn more about CSPR.click, CSPR.cloud, Odra, and the Casper Network by checking out the links below:

- [https://docs.cspr.click](https://docs.cspr.click/)
- [https://docs.cspr.cloud](https://docs.cspr.cloud/)
- [https://github.com/odradev/odra](https://github.com/odradev/odra)
- [https://casper.network](https://casper.network/)

### As Example dApp, I should be containerized

A Dockerfile should be provided for the application. Let’s reuse a standard Nginx image with a custom script that initalizes the config file with the env variables (ask MAKE guys for explanations if needed).

### As Example dApp, I have run instructions

A README file should be updated with the application instructions. It’s expected that the setup and run commands will be provided in the `Makefile`

### As Example dApp, I should have a docker-compose

A docker-compose file should be provided that runs event handler, API, and the client applications.

### As Repository, I should have  the “COPYRIGHT” page

TODO / Let’s discuss

### As Repository, I should have  the “README” page

The README me file should provide explanations on the application structure and provide instructions needed to run the application locally.

## Optional tickets

### As Event Handler, I should have the dev environment

### As API, I should have the dev environment

### As Example dApp, I should have the dev environment

### As Event Handler, I should have the production environment

### As API, I should have the production environment

### As Example dApp, I should have the production environment