### memo

### Getting started

```shell
create-react-app multi-sig-wallet --typescript

npm i semantic-ui-css semantic-ui-react
npm i web3 @truffle/contract

npm start
```

### Setup Truffle for local dev

Inside solidity-multi-sig-wallet

```shell
truffle develop
migrate

# open new terminal
truffle develop --log

```

Copy the `build` folder into `multi-sig-wallet/src`
NOTE: need to do this everytime

### Connect Metamask to Truffle

```
click network > Custom RPC
```

### Import accounts from Truffle

### React app environmental variable setup

Create a file `.env.sample`

Open `.env.sample` and add

```
REACT_APP_WEB3_WS_PROVIDER=ws://localhost:9545
```

Copy `.env.sample` to `.env.development.local`

```shell
cp .env.sample .env.development
```

# install npm packages

# setup semantic ui

# mock ui connect to metamask

# web3 api, context

# use async, connect to metamask ui

# multi sig wallet api, context, ui

# deposit form, api, useAsync,

# create tx (api, modal, form, react-async)

# list transactions

# tx actions

# subscriptions (event types, reducer, deposit, create, update tx)

TODO

- fix warnings
- fix TODOs

# Misc

### Accounts

```
0xf36467c4e023c355026066b8dc51456e7b791d99
0x6b1a5bb56b9956e2db2b5584846c5641331134d0
0x6dd58e6bccc8ba9269783d470e3dda3a6e8d8c7f
```

### Private Keys

```
03f7c8a78d147592992a7b835d3e0cc29e992e6924af7a1fcced5b0d25317c86
4902221c58878e6e8bccf35d68371b28f06d1fc7bb4e49baf919bf696460f92d
af7592d51c7cde468ec5d45ec3ccda0401d150131876c8db3ca36324c009d837
```
