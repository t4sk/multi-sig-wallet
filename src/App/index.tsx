import React from "react";
import { Button, Message } from "semantic-ui-react";
import { unlockAccount } from "../api/web3";
import "./index.css";
import useAsync from "../components/useAsync";
import { useWeb3Context } from "../contexts/Web3";
import MultiSigWallet from "./MultiSigWallet";
import Footer from "./Footer";
import Network from "./Network";

function App() {
  const {
    state: { account, netId },
    updateAccount,
  } = useWeb3Context();

  const { pending, error, call } = useAsync(unlockAccount);

  async function onClickConnect() {
    const { error, data } = await call(null);

    if (error) {
      console.error(error);
    }
    if (data) {
      updateAccount(data);
    }
  }

  return (
    <div className="App">
      <div className="App-main">
        <h1>Multi Sig Wallet</h1>
        {account ? (
          <>
            {netId !== 0 && <Network netId={netId} />}
            <div>Account: {account}</div>
            <MultiSigWallet />
          </>
        ) : (
          <>
            {error ? (
              <Message error>{error.message}</Message>
            ) : (
              <Message warning>Metamask is not connected</Message>
            )}
            <Button
              color="green"
              onClick={() => onClickConnect()}
              disabled={pending}
              loading={pending}
            >
              Connect to Metamask
            </Button>
          </>
        )}
      </div>
      <Footer />
    </div>
  );
}

export default App;
