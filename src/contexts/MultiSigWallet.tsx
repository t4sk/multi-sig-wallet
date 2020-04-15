import Web3 from "web3";
import BN from "bn.js";
import React, { useReducer, useEffect, createContext, useContext } from "react";
import { useWeb3Context } from "./Web3";
import { get as getMultiSigWallet } from "../api/multi-sig-wallet";

interface State {
  address: string;
  owners: string[];
  numConfirmationsRequired: number;
  transactionCount: number;
  transactions: Transaction[];
}

interface Transaction {
  txIndex: number;
  to: string;
  value: BN;
  data: string;
  executed: boolean;
  numConfirmations: number;
  isConfirmedByCurrentAccount: boolean;
}

const INITIAL_STATE: State = {
  address: "",
  owners: [],
  numConfirmationsRequired: 0,
  transactionCount: 0,
  transactions: []
};

const SET = "SET";

interface SetAction {
  type: "SET";
  data: {
    address: string;
    owners: string[];
    numConfirmationsRequired: number;
    transactionCount: number;
    transactions: Transaction[];
  };
}

type Action = SetAction;

function reducer(state: State = INITIAL_STATE, action: Action) {
  switch (action.type) {
    case SET: {
      return {
        ...state,
        ...action.data
      };
    }
    default:
      return state;
  }
}

interface SetInputs {
  address: string;
  owners: string[];
  numConfirmationsRequired: number;
  transactionCount: number;
  transactions: Transaction[];
}

const MultiSigWalletContext = createContext({
  state: INITIAL_STATE,
  set: (_data: SetInputs) => {}
});

export function useMultiSigWalletContext() {
  return useContext(MultiSigWalletContext);
}

interface ProviderProps {}

export const Provider: React.FC<ProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, INITIAL_STATE);

  function set(data: SetInputs) {
    dispatch({
      type: SET,
      data
    });
  }

  return (
    <MultiSigWalletContext.Provider value={{ state, set }}>
      {children}
    </MultiSigWalletContext.Provider>
  );
};

export function Updater() {
  const {
    state: { web3, account }
  } = useWeb3Context();
  const { state, set } = useMultiSigWalletContext();

  async function get(web3: Web3, account: string) {
    try {
      const data = await getMultiSigWallet(web3, account);
      set(data);
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    if (web3) {
      get(web3, account);
    }
  }, [web3]);

  return null;
}
