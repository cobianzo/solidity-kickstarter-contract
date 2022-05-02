import React from "react";
import { Form, Input, Button, Message } from "semantic-ui-react";
import { useRouter } from "next/router";
import Web3 from "web3";
import contractAPI from "../pages/api/contractApi";

function FormNewRequest({ campaignAddress }) {
  const router = useRouter();

  const [amountETH, setAmountETH] = React.useState("0.00011");
  const [recipientAddress, setRecipientAddress] = React.useState(
    "0x4Ff7DC03748C670f3191E4b96a2bA05C7d167042" // account 2
  );
  const [description, setDescription] = React.useState(
    "Initial description to delete"
  );
  const [amountWeis, setAmountWeis] = React.useState("0");
  const [isLoadingMsg, setIsLoadingMsg] = React.useState(false);
  const [errorMsg, setErrorMsg] = React.useState("");

  function handleCreateRequestSubmit(e) {
    e.preventDefault();
    alert("call contract");
    setIsLoadingMsg("Creating request...");
    contractAPI()
      .createRequest(campaignAddress, recipientAddress, amountWeis, description)
      .then(() => {
        alert("request created!");
        // router.reload(window.location.pathname);
        router.push(window.location.pathname);
        // "/campaigns/" + campaignData.campaignAddress); // this works better than reload, i think.
      })
      .catch((error) => {
        setErrorMsg(error.message);
      })
      .finally(() => {
        setIsLoadingMsg(false);
      });
  }

  // Watch AmountETH to calculate weis
  React.useEffect(() => {
    const weis = Web3.utils.toWei(amountETH.toString(), "ether");
    setAmountWeis(weis);
  }, [amountETH]);

  return (
    <Form onSubmit={handleCreateRequestSubmit}>
      <Form.Field>
        <Input
          type="text"
          value={description}
          onChange={(e, { value }) => setDescription(value)}
          placeholder="Description"
        />
      </Form.Field>
      <Form.Field>
        <Input
          label={"ETH"}
          type="number"
          min={Web3.utils.fromWei("1000", "ether")}
          max="100"
          step="0.0000001"
          labelPosition="right"
          value={amountETH}
          onChange={(e, { value }) => setAmountETH(value)}
          placeholder="Amount in ETH"
        />
      </Form.Field>
      <Form.Field>
        <Input
          type="text"
          value={recipientAddress}
          onChange={(e, { value }) => setRecipientAddress(value)}
          placeholder="Recipient's address"
        />
      </Form.Field>

      <Button
        type="submit"
        disabled={isLoadingMsg ? true : false}
        loading={isLoadingMsg ? true : false}
      >
        {isLoadingMsg ? isLoadingMsg : "Submit"}
      </Button>

      {errorMsg ? (
        <Message negative>
          <Message.Header>Error</Message.Header>
          <p>{errorMsg}</p>
          <Button
            circular
            icon="close"
            onClick={(e) => {
              e.preventDefault();
              setErrorMsg(false);
            }}
          />
        </Message>
      ) : null}
    </Form>
  );
}

export default FormNewRequest;
