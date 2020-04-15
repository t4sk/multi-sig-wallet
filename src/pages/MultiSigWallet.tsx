import React, { useState } from "react";
import { useMultiSigWalletContext } from "../contexts/MultiSigWallet";
import { Button } from "semantic-ui-react";
import CreateTxModal from "./CreateTxModal";

function MultiSigWallet() {
  const { state } = useMultiSigWalletContext();
  const [open, openModal] = useState(false);

  return (
    <div>
      <div>Contract: {state.address}</div>
      <h3>Owners</h3>
      <ul>
        {state.owners.map((owner, i) => (
          <li key={i}>{owner}</li>
        ))}
      </ul>
      <div>Confirmations required: {state.numConfirmationsRequired}</div>
      <h3>Transactions ({state.transactionCount})</h3>
      <Button color="green" onClick={() => openModal(true)}>
        Create Transaction
      </Button>
      <CreateTxModal open={open} onClose={() => openModal(false)} />
    </div>
  );
}

export default MultiSigWallet;
