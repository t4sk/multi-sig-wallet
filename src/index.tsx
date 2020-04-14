import React from "react";
import ReactDOM from "react-dom";
import "semantic-ui-css/semantic.min.css";
import "./index.css";
import App from "./pages/App";
import * as serviceWorker from "./serviceWorker";
import {
  Provider as Web3Provider,
  Updater as Web3Updater
} from "./contexts/Web3";
import {
  Provider as MultiSigWalletProvider,
  Updater as MultiSigWalletUpdater
} from "./contexts/MultiSigWallet";

const ContextProviders: React.FC<{}> = ({ children }) => (
  <Web3Provider>
    <MultiSigWalletProvider>{children}</MultiSigWalletProvider>
  </Web3Provider>
);

const Updaters: React.FC<{}> = () => (
  <>
    <Web3Updater />
    <MultiSigWalletUpdater />
  </>
);

ReactDOM.render(
  <React.StrictMode>
    <ContextProviders>
      <Updaters />
      <App />
    </ContextProviders>
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
