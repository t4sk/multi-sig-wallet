import Web3 from "web3";
import BN from "bn.js";
import TruffleContract from "@truffle/contract";
import multiSigWalletTruffle from "../build/contracts/MultiSigWallet.json";

// TODO funding

// TODO show contract balance

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
  owners: string[];
  numConfirmationsRequired: number;
  transactionCount: number;
  transactions: Transaction[];
}

export async function get(web3: Web3, account: string): Promise<GetResponse> {
  MultiSigWallet.setProvider(web3.currentProvider);

  const multiSig = await MultiSigWallet.deployed();
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
      isConfirmedByCurrentAccount: isConfirmed
    });
  }

  return {
    address: multiSig.address,
    owners,
    numConfirmationsRequired: numConfirmationsRequired.toNumber(),
    transactionCount: count,
    transactions
  };
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
    value: number;
    data: string;
  }
) {
  const { to, value, data } = params;

  MultiSigWallet.setProvider(web3.currentProvider);

  const multiSig = await MultiSigWallet.deployed();

  await multiSig.submitTransaction(to, value, data, {
    from: account
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
    from: account
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
    from: account
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
    from: account
  });
}

export function subscribe(web3: Web3, address: string) {
  // TODO metamask
  // const web3 = new Web3();
  // web3.setProvider(new Web3.providers.WebsocketProvider("ws://localhost:9545"));

  const multiSig = new web3.eth.Contract(MultiSigWallet.abi, address);

  const res = multiSig.events.allEvents((error: any, log: any) => {
    console.log(error, log);
  });

  return () => res.unsubscribe();
}

/*
    {logIndex: 0, transactionIndex: 0, transactionHash: "0x7ad28f9f02570c06eeb507e62709289da3894031fea0bbf9f1df22ff83fc5e8c", blockHash: "0x6774eff5054e045c34f2fe31c1313bb1568eb5411261a80d50d8756b68df8073", blockNumber: 5, …}
    logIndex: 0
    transactionIndex: 0
    transactionHash: "0x7ad28f9f02570c06eeb507e62709289da3894031fea0bbf9f1df22ff83fc5e8c"
    blockHash: "0x6774eff5054e045c34f2fe31c1313bb1568eb5411261a80d50d8756b68df8073"
    blockNumber: 5
    address: "0x0C8f89E9A5157f616eEce836EC8CaCBF650bcD22"
    type: "mined"
    id: "log_8ff67b64"
    returnValues: Result {0: "0xF36467c4e023C355026066B8dC51456E7b791d99", 1: "0", 2: "0xF36467c4e023C355026066B8dC51456E7b791d99", 3: "0", 4: "0x00", owner: "0xF36467c4e023C355026066B8dC51456E7b791d99", txIndex: "0", to: "0xF36467c4e023C355026066B8dC51456E7b791d99", value: "0", data: "0x00"}
    event: "SubmitTransaction"
    signature: "0xd5a05bf70715ad82a09a756320284a1b54c9ff74cd0f8cce6219e79b563fe59d"
  }
  */
