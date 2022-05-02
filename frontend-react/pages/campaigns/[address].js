import React from "react";

import { useRouter } from "next/router";
import Web3 from "web3";

import Layout from "../../components/Layout";
import {
  Card,
  Form,
  Grid,
  Input,
  Button,
  Message,
  Segment,
} from "semantic-ui-react";
import contractAPI from "../api/contractApi";
import FormNewRequest from "../../components/FormNewRequest";
import RequestsList from "../../components/RequestsList";

function CampaignDetailsPage({ campaignData }) {
  const router = useRouter();

  const [amountETH, setAmountETH] = React.useState("0.011");
  const [amountWeis, setAmountWeis] = React.useState("0");

  const [isLoadingMsg, setIsLoadingMsg] = React.useState(false);
  const [errorMsg, setErrorMsg] = React.useState("");

  const minContribution = campaignData.minimumContribution; // in weis

  function handleOnSubmitContribution(e) {
    e.preventDefault();
    alert("call contract");
    setIsLoadingMsg("Creating contribution...");
    contractAPI()
      .contributeToCampaign(campaignData.campaignAddress, amountWeis)
      .then(() => {
        alert("contributed! We need to refresh the page to see the changes");
        // router.reload(window.location.pathname);
        router.push("/campaigns/" + campaignData.campaignAddress); // this works better than reload, i think.
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
    <Layout>
      <Grid>
        <Grid.Row>
          <Grid.Column textAlign="center">
            ID campaign <pre>{campaignData.campaignAddress}</pre>
            <small>owner: {campaignData.manager}</small>
          </Grid.Column>
        </Grid.Row>
        <Grid.Column width={10}>
          <Card.Group itemsPerRow={3}>
            <Card>
              <Card.Content textAlign="center">
                <h2>Balance</h2>
                <h3>
                  {Web3.utils.fromWei(campaignData.balance, "ether")}{" "}
                  <small>ETH</small>
                </h3>
              </Card.Content>
            </Card>
            <Card>
              <Card.Content textAlign="center">
                <h2>Minimum contribution</h2>
                {Web3.utils.fromWei(minContribution, "ether")} ETH
              </Card.Content>
            </Card>
            <Card>
              <Card.Content textAlign="center">
                <h2>Contributors</h2>
                <h3>{campaignData.approversCount}</h3>
              </Card.Content>
            </Card>
          </Card.Group>
          <Card.Group itemsPerRow={1}>
            <Card>
              <Card.Content textAlign="center">
                <h2>Request for expenses </h2>({campaignData.requestsCount})
                <RequestsList
                  campaignAddress={campaignData.campaignAddress}
                  totalContributors={campaignData.approversCount}
                  campaignManager={campaignData.manager}
                  campaignBalance={campaignData.balance}
                  rerenderParam={isLoadingMsg}
                />
              </Card.Content>
            </Card>
          </Card.Group>
        </Grid.Column>
        <Grid.Column width={6} textAlign="center">
          <Segment>
            <h2>Contribute to this campaign</h2>
            <small>
              minimum {Web3.utils.fromWei(minContribution, "ether")} ETH
            </small>
            <Form onSubmit={handleOnSubmitContribution}>
              <Form.Field>
                <Input
                  style={{ maxWidth: "100px" }}
                  label={"ETH"}
                  type="number"
                  min={Web3.utils.fromWei(minContribution, "ether")}
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
            </Form>
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
          </Segment>

          <Segment>
            <h2>Create new expense request</h2>

            <FormNewRequest campaignAddress={campaignData.campaignAddress} />
          </Segment>
          <Segment>
            <Button
              onClick={(e) => contractAPI().test(campaignData.campaignAddress)}
            >
              Test
            </Button>
          </Segment>
        </Grid.Column>
      </Grid>
    </Layout>
  );
}

/** -------------------------------------------------------------------------------------------
 * SERVER SIDE - preparing and sending html to CLIENT.
 * @param {*} ctx : ctx.query gives the url query string we need to fetch from the blockchain.
 * @returns { props.campaignData } :  The info of the campaign in an object
 */
CampaignDetailsPage.getInitialProps = async (ctx) => {
  const campaignAddress = ctx.query.address;
  const campaignData = await contractAPI().getCampaignDetails(campaignAddress);
  campaignData.campaignAddress = campaignAddress;
  console.log(">>>> TODELETE ", campaignData);
  // nmow get the info from the contract.
  return { mmm: "lo que quieras", campaignData };
};
export default CampaignDetailsPage;
