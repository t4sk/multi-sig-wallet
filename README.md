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
