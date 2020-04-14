import React from "react";
import { useMultiSigWalletContext } from "./contexts/MultiSigWallet";

function MultiSigWallet() {
  const { state } = useMultiSigWalletContext();

  return (
    <div>
      <div>address: {state.address}</div>
      <h3>Owners</h3>
      <ul>
        {state.owners.map((owner, i) => (
          <li key={i}>{owner}</li>
        ))}
      </ul>
      <div>Confirmations required: {state.numConfirmationsRequired}</div>
      <h3>Transactions ({state.transactionCount})</h3>
    </div>
  );
}

export default MultiSigWallet;
