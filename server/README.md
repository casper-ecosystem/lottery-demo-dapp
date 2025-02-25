# Lottery Demo dApp Server

The server side consists of two applications:
- Event listener that listens to the [smart contract events](../smart-contract/README.md#events) and indexes them in a MySQL database
- REST API that provides access to the data stored in the database, and also acts as a proxy to the CSPR.cloud APIs to make it possible for the [Web Client](../client) to access CSPR.cloud without exposing the access key

## Setup

Before building and running the server application, please update the configuration. Start with copying the config template:

```bash
cp .env.example .env
```

Next, update the following configuration values:
1. Change `LOTTERY_CONTRACT_PACKAGE_HASH` if you deployed your own contract. If you want to use the [demo application](https://lottery-demo.casper.network) contract, keep the default value.
2. Change `CSPR_CLOUD_ACCESS_KEY` to your CSPR.cloud access key from [CSPR.build Console](https://console.cspr.build)

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

To run and set up the database, execute:

```bash
docker compose -f ../infra/local/docker-compose.yaml --project-name lottery up -d mysql
npm run typeorm migration:run
```

To run the Event Listener, use:
```bash
npm run event-handler:dev
```

To run the API, use:
```bash
npm run api:dev
```

