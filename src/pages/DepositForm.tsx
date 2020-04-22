import React, { useState } from "react";
import Web3 from "web3";
import BN from "bn.js";
import { Button, Form } from "semantic-ui-react";
import { useWeb3Context } from "../contexts/Web3";
import useAsync from "../components/useAsync";
import { deposit } from "../api/multi-sig-wallet";

interface Props {}

interface DepositParams {
  web3: Web3;
  account: string;
  value: BN;
}

const DepositForm: React.FC<Props> = () => {
  const {
    state: { web3, account },
  } = useWeb3Context();

  const [input, setInput] = useState("");
  const { pending, call } = useAsync<DepositParams, void>(
    ({ web3, account, value }) => deposit(web3, account, { value })
  );

  function onChange(e: React.ChangeEvent<HTMLInputElement>) {
    setInput(e.target.value);
  }

  async function onSubmit(_e: React.FormEvent<HTMLFormElement>) {
    if (pending) {
      return;
    }

    if (!web3) {
      alert("No web3");
      return;
    }

    const value = Web3.utils.toBN(input);
    const zero = Web3.utils.toBN(0);

    if (value.gt(zero)) {
      const { error } = await call({
        web3,
        account,
        value,
      });

      if (error) {
        alert(`Error: ${error.message}`);
      } else {
        setInput("");
      }
    }
  }

  return (
    <Form onSubmit={onSubmit}>
      <Form.Field>
        <Form.Input
          placeholder="Amount to deposit wei"
          type="number"
          min={0}
          value={input}
          onChange={onChange}
        />
      </Form.Field>
      <Button color="green" disabled={pending} loading={pending}>
        Deposit
      </Button>
    </Form>
  );
};

export default DepositForm;
