import React from "react";
import "./App.css";
import { useWeb3Context } from "../contexts/Web3";
import MultiSigWallet from "./MultiSigWallet";

function App() {
  const web3 = useWeb3Context();

  return (
    <div className="App">
      <div className="App-main">
        <h1>Multi Sig Wallet</h1>
        <div>Account: {web3.state.account}</div>
        <MultiSigWallet />
      </div>
    </div>
  );
}

export default App;
