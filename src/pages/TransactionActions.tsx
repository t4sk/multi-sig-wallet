import React from "react";
import BN from "bn.js";
import { useAsync } from "react-async";
import { Button } from "semantic-ui-react";
import { useWeb3Context } from "../contexts/Web3";
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
  tx
}) => {
  const {
    state: { web3, account }
  } = useWeb3Context();

  const { txIndex } = tx;

  const confirmTx = useAsync({
    deferFn: async _args => {
      if (!web3) {
        throw new Error("No web3");
      }

      await multiSig.confirmTx(web3, account, { txIndex });
    }
  });

  const revokeConfirmation = useAsync({
    deferFn: async _args => {
      if (!web3) {
        throw new Error("No web3");
      }

      await multiSig.revokeConfirmation(web3, account, { txIndex });
    }
  });

  const executeTx = useAsync({
    deferFn: async _args => {
      if (!web3) {
        throw new Error("No web3");
      }

      await multiSig.executeTx(web3, account, { txIndex });
    }
  });

  if (tx.executed) {
    return null;
  }
  return (
    <>
      {tx.isConfirmedByCurrentAccount ? (
        <Button
          onClick={_e => revokeConfirmation.run()}
          disabled={revokeConfirmation.isPending}
          loading={revokeConfirmation.isPending}
        >
          Revoke Confirmation
        </Button>
      ) : (
        <Button
          onClick={_e => confirmTx.run()}
          disabled={confirmTx.isPending}
          loading={confirmTx.isPending}
        >
          Confirm
        </Button>
      )}
      {tx.numConfirmations >= numConfirmationsRequired && (
        <Button
          onClick={_e => executeTx.run()}
          disabled={executeTx.isPending}
          loading={executeTx.isPending}
        >
          Execute
        </Button>
      )}
    </>
  );
};

export default TransactionActions;
