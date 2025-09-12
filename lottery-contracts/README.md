# Lottery Demo dApp Smart Contract

This smart contract allows users to participate in a demo lottery on the Casper blockchain. Users can
purchase tickets to get a chance to win prizes, which come from the prize pool accumulated from the
ticket proceeds. Users can win either a jackpot (the whole prize pool) or a small consolation prize.
When somebody wins the jackpot, a new lottery round starts, making the game indefinite.

This contract is written using the [Odra](https://odra.dev/docs) smart contract framework for the
[Casper Network](https://casper.network). Odra is Rust-based and encourages rapid development and
clean, pragmatic design.

## Entry Points (Contract Functions)

### `configure`

Configures the essential lottery game settings. This entry point can only be called by the contract owner
(designated during deployment).

| Arguments                       | Description                                               |
|---------------------------------|-----------------------------------------------------------|
| `ticket_price`                  | Ticket price in motes (`1` CSPR is `1,000,000,000` motes) |
| `lottery_fee`                   | Lottery fee in percents                                   |
| `jackpot_probability`           | Jackpot probability in percents                           |
| `max_consolation_prize`         | Max consolation prize amount in motes                     |
| `consolation_prize_probability` | Consolation prize probability in percents                 |

### `top_up_prize_pool`

Adds funds to the prize pool. This entry point can only be called by the contract owner (designated
during deployment).

| Arguments | Description     |
|-----------|-----------------|
| `amount`  | Amount in motes |

### `transfer_fees_to_account`

Transfers the requested amount from the fee purse to receiver's account. Reverts if the requested amount
is bigger than collected fees. This entry point can only be called by the contract owner (designated
during deployment).

| Arguments  | Description                                         |
|------------|-----------------------------------------------------|
| `amount`   | Amount in motes (`1` CSPR is `1,000,000,000` motes) |
| `receiver` | Receiver account hash                               |

### `play_lottery`

Participates in the current lottery round by purchasing a ticket. This is a
[`Payable`](https://odra.dev/docs/tutorials/odra-solidity#payable) entry point that needs to be called
using [`proxy_caller`](https://odra.dev/docs/tutorials/using-proxy-caller). The amount sent must match
the configured ticket price.

| Arguments | Description                                                    |
|-----------|----------------------------------------------------------------|
| `amount`  | Ticket price in motes (must match the configured ticket price) |

## Events

### `Play`

The [`play_lottery`](#play_lottery) entry point emits the following `Play` event, which is used to notify
the [Event Listener](../server) about new lottery plays:

| Property         | Description                                                                         |
|------------------|-------------------------------------------------------------------------------------|
| `play_id`        | Unique play ID that can be used to index plays                                      |
| `round_id`       | Current lottery round ID                                                            |
| `player`         | Player account hash                                                                 |
| `timestamp`      | Timestamp of the play                                                               |
| `prize_amount`   | Prize amount won by the player in motes                                             |
| `is_jackpot`     | Flag that indicates whether the player won the jackpot                              |
| `jackpot_amount` | The remaining prize pool balance after the play (`0` if the player won the jackpot) |

## Prerequisites

Before using this smart contract, ensure you have the following installed:

1. **Rust**: Install from [rustup.rs](https://rustup.rs/)
2. **cargo-odra**: Install from [here](https://github.com/odradev/odra)
3. **just**: A command runner tool. Install with `cargo install just`

## Usage

### Build

```
just build-contracts
```

### Test

To run tests on your local machine, you can simply execute the following command:

```
just test
```

### Run locally

The most convenient way to run your smart contract locally would be by
using [NCTL in Docker](https://hub.docker.com/r/makesoftware/casper-nctl):

```bash
docker run --rm -it --name casper-nctl -d \
    -p 11101:11101 \
    -p 14101:14101 \
    -p 18101:18101 \
    makesoftware/casper-nctl
```

Copy user keys from the container:

```
docker cp casper-nctl:/home/casper/casper-nctl/assets/net-1/users/user-1 ./user-keys
```

Copy and adjust `.env` file. It's sketched for local NCTL with Docker.

```shell
cp .env.sample .env
```

Deploy the contract to the local NCTL:

```bash
just cli deploy
```

Send a play transaction and display the events:

```bash
just cli contract Lottery play_lottery \
  --attached_value 50000000000 \
  --gas 10000000000 \
  --print-events
```

Try other entry points in the contract. Use `--help` to find the available commands. For example:

```bash
just cli contract Lottery --help
```

and

```bash
just cli contract Lottery configure --help
```

### Deploy to Casper Testnet

To deploy the contract to Casper Testnet, you need to have a funded account. Copy and adjust `.env` file
with your credentials, an RPC endpoint and chain name. Then, use the same `just` commands as for local
NCTL.
