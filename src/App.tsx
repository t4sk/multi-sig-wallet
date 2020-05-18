import React from "react";
import { Button, Message } from "semantic-ui-react";
import "./App.css";
import Footer from "./Footer";

function App() {
  const account = "0x123456";

  return (
    <div className="App">
      <div className="App-main">
        <h1>Multi Sig Wallet</h1>
        <div>Account: {account}</div>
        <Message warning>Metamask is not connected</Message>
        <Button color="green">Connect to Metamask</Button>
      </div>
      <Footer />
    </div>
  );
}

export default App;
