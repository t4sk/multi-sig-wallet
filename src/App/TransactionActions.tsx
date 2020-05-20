import React from "react";
import { Button } from "semantic-ui-react";
import { useWeb3Context } from "../contexts/Web3";
import useAsync from "../components/useAsync";
import * as multiSig from "../api/multi-sig-wallet";

interface Props {
  numConfirmationsRequired: number;
  tx: {
    txIndex: number;
    executed: boolean;
    numConfirmations: number;
    isConfirmedByCurrentAccount: boolean;
  };
}

const TransactionActions: React.FC<Props> = ({
  numConfirmationsRequired,
  tx,
}) => {
  const {
    state: { web3, account },
  } = useWeb3Context();

  const { txIndex } = tx;

  const confirmTx = useAsync(async () => {
    if (!web3) {
      throw new Error("No web3");
    }

    await multiSig.confirmTx(web3, account, { txIndex });
  });

  const revokeConfirmation = useAsync(async () => {
    if (!web3) {
      throw new Error("No web3");
    }

    await multiSig.revokeConfirmation(web3, account, { txIndex });
  });

  const executeTx = useAsync(async () => {
    if (!web3) {
      throw new Error("No web3");
    }

    await multiSig.executeTx(web3, account, { txIndex });
  });

  if (tx.executed) {
    return null;
  }
  return (
    <>
      {tx.isConfirmedByCurrentAccount ? (
        <Button
          onClick={(_e) => revokeConfirmation.call(null)}
          disabled={revokeConfirmation.pending}
          loading={revokeConfirmation.pending}
        >
          Revoke Confirmation
        </Button>
      ) : (
        <Button
          onClick={(_e) => confirmTx.call(null)}
          disabled={confirmTx.pending}
          loading={confirmTx.pending}
        >
          Confirm
        </Button>
      )}
      {tx.numConfirmations >= numConfirmationsRequired && (
        <Button
          onClick={(_e) => executeTx.call(null)}
          disabled={executeTx.pending}
          loading={executeTx.pending}
        >
          Execute
        </Button>
      )}
    </>
  );
};

export default TransactionActions;
