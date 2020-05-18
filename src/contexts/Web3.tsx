import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useReducer,
} from "react";
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

const UPDATE_ACCOUNT = "UPDATE_ACCOUNT";

interface UpdateAccount {
  type: "UPDATE_ACCOUNT";
  account: string;
  web3?: Web3;
}

type Action = UpdateAccount;

function reducer(state: State = INITIAL_STATE, action: Action) {
  switch (action.type) {
    case UPDATE_ACCOUNT: {
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
  updateAccount: (_data: { account: string; web3?: Web3 }) => {},
});

export function useWeb3Context() {
  return useContext(Web3Context);
}

interface ProviderProps {}

export const Provider: React.FC<ProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, INITIAL_STATE);

  function updateAccount(data: { account: string; web3?: Web3 }) {
    dispatch({
      type: UPDATE_ACCOUNT,
      ...data,
    });
  }

  return (
    <Web3Context.Provider
      value={useMemo(
        () => ({
          state,
          updateAccount,
        }),
        [state]
      )}
    >
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
