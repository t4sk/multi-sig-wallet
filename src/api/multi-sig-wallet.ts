import Web3 from "web3";
import BN from "bn.js";
import TruffleContract from "@truffle/contract";
import multiSigWalletTruffle from "../build/contracts/MultiSigWallet.json";

// TODO funding

// TODO fix ts error
// @ts-ignore
const MultiSigWallet = TruffleContract(multiSigWalletTruffle);

interface Transaction {
  txIndex: number;
  to: string;
  value: BN;
  data: string;
  executed: boolean;
  numConfirmations: number;
  isConfirmedByCurrentAccount: boolean;
}

interface GetResponse {
  address: string;
  balance: string;
  owners: string[];
  numConfirmationsRequired: number;
  transactionCount: number;
  transactions: Transaction[];
}

export async function get(web3: Web3, account: string): Promise<GetResponse> {
  MultiSigWallet.setProvider(web3.currentProvider);

  const multiSig = await MultiSigWallet.deployed();

  const balance = web3.utils.fromWei(
    await web3.eth.getBalance(multiSig.address),
    "ether"
  );
  const owners = await multiSig.getOwners();
  const numConfirmationsRequired = await multiSig.numConfirmationsRequired();
  const transactionCount = await multiSig.getTransactionCount();

  // get 10 most recent tx
  const count = transactionCount.toNumber();
  const transactions: Transaction[] = [];
  for (let i = 0; i < 10; i++) {
    const txIndex = count - 1 - i;
    if (txIndex < 0) {
      break;
    }

    const tx = await multiSig.getTransaction(txIndex);
    const isConfirmed = await multiSig.isConfirmed(txIndex, account);

    transactions.push({
      txIndex,
      to: tx.to,
      value: tx.value,
      data: tx.data,
      executed: tx.executed,
      numConfirmations: tx.numConfirmations.toNumber(),
      isConfirmedByCurrentAccount: isConfirmed,
    });
  }

  return {
    address: multiSig.address,
    balance,
    owners,
    numConfirmationsRequired: numConfirmationsRequired.toNumber(),
    transactionCount: count,
    transactions,
  };
}

export async function deposit(
  web3: Web3,
  account: string,
  params: {
    value: BN;
  }
) {
  MultiSigWallet.setProvider(web3.currentProvider);
  const multiSig = await MultiSigWallet.deployed();

  await multiSig.sendTransaction({ from: account, value: params.value });
}

// TODO FIX
/*
Error: [ethjs-rpc] rpc error with payload {"id":4197981957911,"jsonrpc":"2.0","params":["0xf9010b088477359400830182b4940c8f89e9a5157f616eece836ec8cacbf650bcd2280b8a4c6427474000000000000000000000000f36467c4e023c355026066b8dc51456e7b791d990000000000000000000000000
NOTE: fix by resetting account nonce?
*/
export async function submitTx(
  web3: Web3,
  account: string,
  params: {
    to: string;
    // TODO BN
    value: number;
    data: string;
  }
) {
  const { to, value, data } = params;

  MultiSigWallet.setProvider(web3.currentProvider);
  const multiSig = await MultiSigWallet.deployed();

  await multiSig.submitTransaction(to, value, data, {
    from: account,
  });
}

export async function confirmTx(
  web3: Web3,
  account: string,
  params: {
    txIndex: number;
  }
) {
  const { txIndex } = params;

  MultiSigWallet.setProvider(web3.currentProvider);
  const multiSig = await MultiSigWallet.deployed();

  await multiSig.confirmTransaction(txIndex, {
    from: account,
  });
}

export async function revokeConfirmation(
  web3: Web3,
  account: string,
  params: {
    txIndex: number;
  }
) {
  const { txIndex } = params;

  MultiSigWallet.setProvider(web3.currentProvider);
  const multiSig = await MultiSigWallet.deployed();

  await multiSig.revokeConfirmation(txIndex, {
    from: account,
  });
}

export async function executeTx(
  web3: Web3,
  account: string,
  params: {
    txIndex: number;
  }
) {
  const { txIndex } = params;

  MultiSigWallet.setProvider(web3.currentProvider);
  const multiSig = await MultiSigWallet.deployed();

  await multiSig.executeTransaction(txIndex, {
    from: account,
  });
}

export function subscribe(
  web3: Web3,
  address: string,
  callback: (error: Error | null, log: Log | null) => void
) {
  // TODO metamask
  // const web3 = new Web3();
  // web3.setProvider(new Web3.providers.WebsocketProvider("ws://localhost:9545"));

  const multiSig = new web3.eth.Contract(MultiSigWallet.abi, address);

  const res = multiSig.events.allEvents((error: Error, log: Log) => {
    if (error) {
      callback(error, null);
    } else if (log) {
      callback(null, log);
    }
  });

  return () => res.unsubscribe();
}

interface Deposit {
  event: "Deposit";
  returnValues: {
    sender: string;
    amount: string;
    balance: string;
  };
}

interface SubmitTransaction {
  event: "SubmitTransaction";
  returnValues: {
    owner: string;
    txIndex: string;
    to: string;
    value: string;
    data: string;
  };
}

interface ConfirmTransaction {
  event: "ConfirmTransaction";
  returnValues: {
    owner: string;
    txIndex: string;
  };
}

interface RevokeConfirmation {
  event: "RevokeConfirmation";
  returnValues: {
    owner: string;
    txIndex: string;
  };
}

interface ExecuteTransaction {
  event: "ExecuteTransaction";
  returnValues: {
    owner: string;
    txIndex: string;
  };
}

type Log =
  | Deposit
  | SubmitTransaction
  | ConfirmTransaction
  | RevokeConfirmation
  | ExecuteTransaction;
