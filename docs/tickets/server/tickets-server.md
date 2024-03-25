
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
### As Example dApp, I should be bootstrapped

The client application should be bootstrapped from the [CSPR.click template](https://www.npmjs.com/package/@make-software/cra-template-csprclick-react):

```bash
npx create-react-app lottery-app/client --template @make-software/csprclick-react
```

The design was created considering the template styling to reuse as much of the existing components as possible and to fit into the template stylistically.

