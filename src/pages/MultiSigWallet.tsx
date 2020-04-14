import React from "react";
import { useMultiSigWalletContext } from "../contexts/MultiSigWallet";
import { Button } from "semantic-ui-react";
import CreateTxModal from "./CreateTxModal";

function MultiSigWallet() {
  const { state } = useMultiSigWalletContext();

  function onClickCreateTx() {}

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
      <Button color="green" onClick={onClickCreateTx}>
        Create Transaction
      </Button>
      <CreateTxModal />
    </div>
  );
}

export default MultiSigWallet;
