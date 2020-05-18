import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useReducer,
} from "react";
import Web3 from "web3";
import { subscribeToAccount, subscribeToNetId } from "../api/web3";

interface State {
  account: string;
  web3: Web3 | null;
  netId: number;
}

const INITIAL_STATE: State = {
  account: "",
  web3: null,
  netId: 0,
};

const UPDATE_ACCOUNT = "UPDATE_ACCOUNT";
const UPDATE_NET_ID = "UPDATE_NET_ID";

interface UpdateAccount {
  type: "UPDATE_ACCOUNT";
  account: string;
  web3?: Web3;
}

interface UpdateNetId {
  type: "UPDATE_NET_ID";
  netId: number;
}

type Action = UpdateAccount | UpdateNetId;

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
    case UPDATE_NET_ID: {
      const { netId } = action;

      return {
        ...state,
        netId,
      };
    }
    default:
      return state;
  }
}

const Web3Context = createContext({
  state: INITIAL_STATE,
  updateAccount: (_data: { account: string; web3?: Web3 }) => {},
  updateNetId: (_data: { netId: number }) => {},
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

  function updateNetId(data: { netId: number }) {
    dispatch({
      type: UPDATE_NET_ID,
      ...data,
    });
  }

  return (
    <Web3Context.Provider
      value={useMemo(
        () => ({
          state,
          updateAccount,
          updateNetId,
        }),
        [state]
      )}
    >
      {children}
    </Web3Context.Provider>
  );
};

export function Updater() {
  const { state, updateNetId } = useWeb3Context();

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

  useEffect(() => {
    if (state.web3) {
      const unsubscribe = subscribeToNetId(state.web3, (error, netId) => {
        if (error) {
          console.error(error);
        }
        if (netId) {
          if (state.netId === 0) {
            updateNetId({ netId });
          } else if (netId !== state.netId) {
            window.location.reload();
          }
        }
      });

      return unsubscribe;
    }
  }, [state.web3, state.netId, updateNetId]);

  return null;
}
