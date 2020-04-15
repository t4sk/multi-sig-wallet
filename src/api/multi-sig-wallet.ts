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

// TODO exercise subscribe network id

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

  const res = await multiSig.submitTransaction(to, value, data, {
    from: account
  });

  console.log(res);
}
