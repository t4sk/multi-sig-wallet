import Web3 from "web3";
import BN from "bn.js";
import React, { useReducer, useEffect, createContext, useContext } from "react";
import { useWeb3Context } from "./Web3";
import { get as getMultiSigWallet, subscribe } from "../api/multi-sig-wallet";

interface State {
  // TODO contract balance
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
const ADD_TX = "ADD_TX";
// const UPDATE_TX = "UPDATE_TX";

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

interface AddTxAction {
  type: "ADD_TX";
  data: {
    txIndex: string;
    to: string;
    value: string;
    data: string;
  };
}

type Action = SetAction | AddTxAction;

function reducer(state: State = INITIAL_STATE, action: Action) {
  switch (action.type) {
    case SET: {
      return {
        ...state,
        ...action.data
      };
    }
    case ADD_TX: {
      const {
        data: { txIndex, to, value, data }
      } = action;

      const transactions = [
        {
          txIndex: parseInt(txIndex),
          to,
          value: Web3.utils.toBN(value),
          data,
          executed: false,
          numConfirmations: 0,
          isConfirmedByCurrentAccount: false
        },
        ...state.transactions
      ];

      return {
        ...state,
        transactionCount: state.transactionCount + 1,
        transactions
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

interface AddTxInputs {
  txIndex: string;
  to: string;
  value: string;
  data: string;
}

const MultiSigWalletContext = createContext({
  state: INITIAL_STATE,
  set: (_data: SetInputs) => {},
  addTx: (_data: AddTxInputs) => {}
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

  function addTx(data: AddTxInputs) {
    dispatch({
      type: ADD_TX,
      data
    });
  }

  return (
    <MultiSigWalletContext.Provider value={{ state, set, addTx }}>
      {children}
    </MultiSigWalletContext.Provider>
  );
};

export function Updater() {
  const {
    state: { web3, account }
  } = useWeb3Context();
  const { state, set, addTx } = useMultiSigWalletContext();

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
  }, [web3, account]);

  useEffect(() => {
    if (web3 && state.address) {
      return subscribe(web3, state.address, (error, log) => {
        if (error) {
          console.error(error);
        } else if (log) {
          switch (log.event) {
            case "SubmitTransaction":
              addTx(log.returnValues);
              break;
          }
        }
      });
    }
  }, [web3, state.address]);

  return null;
}
