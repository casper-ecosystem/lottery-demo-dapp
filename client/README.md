# Lottery Demo dApp Client

Casper Lottery Client is a Web application that allows users to play the lottery and see past plays. It is a React application bootstrapped from [CSPR.click React template](https://www.npmjs.com/package/@make-software/cra-template-csprclick-react). To read more about CSPR.click, please check [the documentation](https://docs.cspr.click).

## Setup

Before building and running the Web Client, please update the configuration. Start with copying the config template:

```bash
cp public/config.js.local public/config.js
```

Next, update the following configuration values:

1. Change `lottery_app_contract_package_hash` if you deployed your own contract. If you want to use the [demo application](https://lottery-demo.casper.network) contract, keep the default value.
2. Change `cspr_click_app_id` to your CSPR.click App ID from [CSPR.build Console](https://console.cspr.build)

The rest of the values should remain the same for the local development, unless you made corresponding changes in other places.

To install the dependencies, run:

```bash
npm install
```

## Build

To build the project for production, run:

```bash
npm run build
```

This command will create a build folder with optimized production-ready files.

## Run

To run the application, execute:

```bash
npm start
```
