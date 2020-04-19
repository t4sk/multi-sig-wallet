import React, { useReducer, createContext, useContext, useEffect } from "react";
import Web3 from "web3";
import { subscribeToAccount } from "../api/web3";

interface State {
  account: string;
  web3: Web3 | null;
}

const INITIAL_STATE: State = {
  account: "",
  web3: null,
};

const UPDATE = "UPDATE";

interface Update {
  type: "UPDATE";
  account: string;
  web3?: Web3;
}

type Action = Update;

function reducer(state: State = INITIAL_STATE, action: Action) {
  switch (action.type) {
    case UPDATE: {
      const web3 = action.web3 || state.web3;
      const { account } = action;

      return {
        ...state,
        web3,
        account,
      };
    }
    default:
      return state;
  }
}

const Web3Context = createContext({
  state: INITIAL_STATE,
  update: (_data: { account: string; web3?: Web3 }) => {},
});

export function useWeb3Context() {
  return useContext(Web3Context);
}

interface ProviderProps {}

export const Provider: React.FC<ProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, INITIAL_STATE);

  function update(data: { account: string; web3?: Web3 }) {
    dispatch({
      type: UPDATE,
      ...data,
    });
  }

  return (
    <Web3Context.Provider value={{ state, update }}>
      {children}
    </Web3Context.Provider>
  );
};

export function Updater() {
  const { state } = useWeb3Context();

  useEffect(() => {
    if (state.web3) {
      const unsubscribe = subscribeToAccount(state.web3, (error, account) => {
        if (error) {
          console.error(error);
        }
        if (account !== undefined && account !== state.account) {
          window.location.reload();
        }
      });

      return unsubscribe;
    }
  }, [state.web3, state.account]);

  return null;
}
