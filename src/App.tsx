import React from "react";
import "./App.css";
import { useWeb3Context } from "./contexts/Web3";

function App() {
  const web3 = useWeb3Context();

  return (
    <div className="App">
      <div>Account: {web3.state.account}</div>
    </div>
  );
}

export default App;
