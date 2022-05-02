import React, { useEffect } from "react";
import Head from "next/head";
import Layout from "../components/Layout";
import { Form, Input, Button, Message } from "semantic-ui-react";

import Web3 from "web3";

import contractAPI from "../pages/api/contractApi";
import { ContractFactoryContext } from "../pages/_app";
import { useRouter } from "next/router";

function newcampaign() {
  const [amountETH, setAmountETH] = React.useState("0.011");
  const [amountWeis, setAmountWeis] = React.useState("0");

  const [isLoadingMsg, setIsLoadingMsg] = React.useState(false);
  const [errorMsg, setErrorMsg] = React.useState("");
  const [ContractData, setContractData] = React.useContext(
    ContractFactoryContext
  );

  const router = useRouter();

  function handleCreateCampaignSubmit(e) {
    e.preventDefault();
    // contractAPI().getAccounts().then(console.log); // works!
    setIsLoadingMsg("Creating campaign...");
    setErrorMsg("");

    const contractAPIInstance = contractAPI();

    contractAPIInstance
      .createCampaign(amountWeis)
      .then((r) => {
        // ALL OK!!!!
        alert("Campaign created for " + amountWeis + " weis");
        console.log("result", r);
        setIsLoadingMsg(false);

        // Update the campaigns list
        contractAPIInstance
          .getContract()
          .then((ic) => {
            contractAPIInstance.getAllCampaigns(ic).then((campaigns) => {
              // Now our context capaigns is updated
              setContractData({ ...ContractData, campaigns: campaigns });
              alert("updated campaigns list. Redirecting");
              router.push("/"); // @TODO: use a routes.js file
            });
          })
          .catch((e) => {
            setErrorMsg(e.message);
          })
          .finally(() => {});
      })
      .catch(function (e) {
        alert("error!");
        console.log(";error fue:", e); // "oh, no!"
        setErrorMsg(e.message);
      })
      .finally(() => {
        setIsLoadingMsg(false);
      });
  }

  useEffect(() => {
    const weis = Web3.utils.toWei(amountETH.toString(), "ether");
    setAmountWeis(weis);
  }, [amountETH]);

  return (
    <>
      <Head>
        <title>Create a new campaign</title>
        <meta
          name="description"
          content="Request fundings for your campaign and make it true"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Layout>
        <main className="container">
          <Form
            style={{ maxWidth: "400px", margin: "auto" }}
            onSubmit={handleCreateCampaignSubmit}
          >
            <Form.Field>
              <h2>Minimum contribution in ETH</h2>
              <Input
                label={"ETH"}
                type="number"
                min="0"
                max="100"
                step="0.001"
                labelPosition="right"
                value={amountETH}
                onChange={(e, { value }) => setAmountETH(value)}
                placeholder="Amount in ETH"
              />
            </Form.Field>
            <Button
              type="submit"
              disabled={isLoadingMsg ? true : false}
              loading={isLoadingMsg ? true : false}
            >
              {isLoadingMsg ? isLoadingMsg : "Submit"}
            </Button>
            {isLoadingMsg ? (
              <p style={{ display: "block" }}>{isLoadingMsg}</p>
            ) : null}
            <b>{amountETH} ETH</b>{" "}
            <small style={{ marginLeft: "20px" }}>
              {amountWeis.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")} weis
            </small>
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
        </main>
      </Layout>
    </>
  );
}

export default newcampaign;
