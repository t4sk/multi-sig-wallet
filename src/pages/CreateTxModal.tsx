import React, { useState } from "react";
import { Button, Modal, Form } from "semantic-ui-react";
import { useAsync } from "react-async";
import { useWeb3Context } from "../contexts/Web3";
import { submitTx } from "../api/multi-sig-wallet";

interface Props {
  open: boolean;
  onClose: (event?: any) => void;
}

const CreateTxModal: React.FC<Props> = ({ open, onClose }) => {
  const {
    state: { web3, account }
  } = useWeb3Context();

  const { run, data, error, isPending } = useAsync({
    deferFn: async args => {
      if (!web3) {
        throw new Error("No web3");
      }

      await submitTx(web3, account, args[0]);

      onClose();
    }
  });

  const [inputs, setInputs] = useState({
    to: "",
    value: 0,
    data: ""
  });

  function onChange(name: string, e: React.ChangeEvent<HTMLInputElement>) {
    setInputs({
      ...inputs,
      [name]: e.target.value
    });
  }

  async function onSubmit() {
    if (isPending) {
      return;
    }

    run(inputs);
  }

  return (
    <Modal open={open} onClose={onClose}>
      <Modal.Header>Create Transaction</Modal.Header>
      <Modal.Content>
        {error && <div style={{ color: "red" }}>{error.message}</div>}
        <Form onSubmit={onSubmit}>
          <Form.Field>
            <label>To</label>
            <Form.Input
              type="text"
              value={inputs.to}
              onChange={e => onChange("to", e)}
            />
          </Form.Field>
          <Form.Field>
            <label>Value</label>
            <Form.Input
              type="number"
              min={0}
              value={inputs.value}
              onChange={e => onChange("value", e)}
            />
          </Form.Field>
          <Form.Field>
            <label>Data</label>
            <Form.Input
              value={inputs.data}
              onChange={e => onChange("data", e)}
            />
          </Form.Field>
        </Form>
      </Modal.Content>
      <Modal.Actions>
        <Button onClick={onClose}>Cancel</Button>
        <Button color="green" onClick={onSubmit}>
          Create
        </Button>
      </Modal.Actions>
    </Modal>
  );
};

export default CreateTxModal;
