
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



