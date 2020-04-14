import Web3 from "web3";
import TruffleContract from "@truffle/contract";
import multiSigWalletTruffle from "../build/contracts/MultiSigWallet.json";

// TODO fix ts error
// @ts-ignore
const MultiSigWallet = TruffleContract(multiSigWalletTruffle);

interface GetResponse {
  address: string;
  owners: string[];
  numConfirmationsRequired: number;
  transactionCount: number;
}

export async function get(web3: Web3): Promise<GetResponse> {
  MultiSigWallet.setProvider(web3.currentProvider);

  const multiSig = await MultiSigWallet.deployed();
  const owners = await multiSig.getOwners();
  const numConfirmationsRequired = await multiSig.numConfirmationsRequired();
  const transactionCount = await multiSig.getTransactionCount();

  // get 10 most recent tx
  // TODO fix ts type
  // @ts-ignore
  // const transactions = [];

  return {
    address: multiSig.address,
    owners,
    numConfirmationsRequired: numConfirmationsRequired.toNumber(),
    transactionCount: transactionCount.toNumber()
    // transactions
  };
}
