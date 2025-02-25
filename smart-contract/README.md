# Lottery Demo dApp Smart Contract

This smart contract allows users to participate in a demo lottery on the Casper blockchain. Users can purchase tickets to get a chance to win , which come from the prize pool accumulated from the ticket proceeds. Users can win either a jackpot (the whole prize pool) or a small consolation prize. When somebody wins the jackpot, a new lottery round starts, making the game indefinite.

This contract is written using the [Odra](https://odra.dev/docs) smart contract framework for the [Casper Network](https://casper.network). Odra is Rust-based and encourages rapid development and clean, pragmatic design.

## Entry Points (Contract Functions)

### `configure`

Configures the essential lottery game settings. This entry point can only be called by the contract owner (designated during deployment).

| Arguments                       | Description                               |
| ------------------------------- | ----------------------------------------- |
| `ticket_price`                  | Ticket price in CSPR                      |
| `lottery_fee`                   | Lottery fee in percents                   |
| `jackpot_probability`           | Jackpot probability in percents           |
| `max_consolation_prize`         | Max consolation prize amount in CSPR      |
| `consolation_prize_probability` | Consolation prize probability in percents |

### `top_up_prize_pool`

Adds funds to the prize pool. This entry point can only be called by the contract owner (designated during deployment).

| Arguments | Description                                     |
| --------- | ----------------------------------------------- |
| `amount`  | Amount in motes (`1` CSPR is `1,000,000,000` motes) |

### `transfer_fees_to_account`

Transfers the requested amount from the fee purse to receiver`s account. Reverts if the requested amount bigger than collected fees. This entry point can only be called by the contract owner (designated during deployment).

| Arguments  | Description                                     |
| ---------- | ----------------------------------------------- |
| `amount`   | Amount in motes (`1` CSPR is `1,000,000,000` motes) |
| `receiver` | Receiver account hash                           |

### `play_lottery`

Participates in the current lottery round by purchasing a ticket. This is a [`Payable`](https://odra.dev/docs/tutorials/odra-solidity#payable) entry point that needs to be called using [`proxy_caller`](https://odra.dev/docs/tutorials/using-proxy-caller)

| Arguments | Description                                           |
| --------- | ----------------------------------------------------- |
| `amount`  | Ticket price in motes (`1` CSPR is `1,000,000,000` motes) |


## Events

### `Play`

The [`play_lottery`](#playlottery) entry point emits the following `Play` event, which is used to notify the [Event Listener](../server) about new lottery plays:

| Property          | Description                                                                         |
|-------------------|-------------------------------------------------------------------------------------|
| `play_id`         | Unique play ID that can be used to index plays                                      |
| `round_id`        | Current lottery round ID                                                            |
| `player`          | Player account hash                                                                 |
| `timestamp`       | Timestamp of the play                                                               |
| `prize_amount`    | Prize amount won by the player in motes (`1` CSPR is `1,000,000,000` motes)             |
| `is_jackpot`      | Flag that indicates whether the player won the jackpot                              |
| `jackpot_amount`  | The remaining prize pool balance after the play (`0` if the player won the jackpot) |

## Usage

It's recommended to install `cargo-odra` first. You can find it [here](https://github.com/odradev/odra).

### Build

```
make build
```

### Test

To run tests on your local machine, you can simply execute the following command:

```
make test
```

To test actual WASM files against a backend

```
make test-wasm
```

### Run locally

The most convenient way to run your smart contract locally would be by using [NCTL in Docker](https://hub.docker.com/r/makesoftware/casper-nctl):

```bash
docker run --rm -it --name casper-nctl -d \
    -p 11101:11101 \
    -p 14101:14101 \
    -p 18101:18101 \
    -v ${PWD}/wasm:/home/casper/contract \
    makesoftware/casper-nctl
```

Open the NCTL container terminal:
```bash
docker exec -it casper-nctl /bin/bash
```

Deploy the contract to the local NCTL:
```bash
casper-client put-deploy \
    --node-address http://127.0.0.1:11101 \
    --chain-name casper-net-1 \
    --payment-amount 200000000000 \
    --secret-key "/home/casper/casper-node/utils/nctl/assets/net-1/users/user-1/secret_key.pem" \
    --session-path /home/casper/contract/Lottery.wasm
```

### Deploy to Casper Testnet

Copy and adjust `.env` file

```shell
cp .env.sample .env
```

Run the deploy command that uses Odra's [Livenet backend](https://odra.dev/docs/backends/livenet):

```shell
cargo run --bin livenet --features=livenet
```
