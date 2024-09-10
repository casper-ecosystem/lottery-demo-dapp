# Lottery Demo dApp Server

## Local setup

1) Run infrastructure
```bash
make run-local-infra
```

2) Use required node version

```bash
nvm use
```

3) Setup local deps
```bash
make setup-local
```

3) Run database migration

```bash
make sync-db
```

4) Run API
```bash
npm run api:dev
```

5) Run Event Handler
```bash
npm run event-handler:dev
```
