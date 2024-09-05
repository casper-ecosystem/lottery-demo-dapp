# Lottery Demo dApp Smart Contract

This smart contract allows users to participate in a demo lottery on the Casper blockchain. Users can purchase tickets to get a chance to win , which come from the prize pool accumulated from the ticket proceeds. Users can win either a jackpot (the whole prize pool) or a small consolation prize. When somebody wins the jackpot, a new lottery round starts, making the game indefinite.

This contract is written using the [Odra](https://odra.dev/docs) smart contract framework for the [Casper Network](https://casper.network). Odra is Rust-based and encourages rapid development and clean, pragmatic design.

## Entry Points (Contract Functions)

### `configure`

Configures the essential lottery game settings. This entry point can only be called by the contract owner (designated during deployment).

| Arguments                       | Description                               |
|---------------------------------|-------------------------------------------|
| `ticket_price`                  | Ticket price in CSPR                      |
| `lottery_fee`                   | Lottery fee in percents                   |
| `jackpot_probability`           | Jackpot probability in percents           |
| `max_consolation_prize`         | Max consolation prize amount in CSPR      |
| `consolation_prize_probability` | Consolation prize probability in percents |

### `top_up_prize_pool`

Adds funds to the prize pool. This entry point can only be called by the contract owner (designated during deployment).

| Arguments                 | Description                                     |
|---------------------------|-------------------------------------------------|
| `amount`                  | Amount in motes (1 CSPR is 1,000,000,000 motes) |

### `transfer_fees_to_account`

Transfers the requested amount from the fee purse to receiver`s account. Reverts if the requested amount bigger than collected fees. This entry point can only be called by the contract owner (designated during deployment).

| Arguments               | Description                                     |
|-------------------------|-------------------------------------------------|
| `amount`                | Amount in motes (1 CSPR is 1,000,000,000 motes) |
| `receiver`              | Receiver account hash                           |

### `play_lottery`

Participates in the current lottery round by purchasing a ticket. This is a [`Payable`](https://odra.dev/docs/tutorials/odra-solidity#payable) entry point that needs to be called using [`proxy_caller`](https://odra.dev/docs/tutorials/using-proxy-caller)

| Arguments             | Description                                           |
|-----------------------|-------------------------------------------------------|
| `amount`              | Ticket price in motes (1 CSPR is 1,000,000,000 motes) |


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

### Deploy to Casper Testnet

Copy and adjust `.env` file

```shell
cp .env.sample .env
```

Run the deploy command that uses Odra's [Livenet backend](https://odra.dev/docs/backends/livenet)

```shell
cargo run --bin livenet --features=livenet
```
