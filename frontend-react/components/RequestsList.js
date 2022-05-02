import React from "react";
import { Button, Card } from "semantic-ui-react";
import Web3 from "web3";
import contractAPI from "../pages/api/contractApi";
import { ContractFactoryContext } from "../pages/_app";
// TODO: use context to grab the current user address

function RequestsList({
  campaignAddress,
  totalContributors,
  campaignManager,
  campaignBalance,
  rerenderParam,
}) {
  // grab the current user address. Not working, we are not using it
  const [ContractData] = React.useContext(ContractFactoryContext);

  const [rerender, setRerender] = React.useState(0);
  const [requests, setRequests] = React.useState([]);
  const [currentUserHasVotedRequests, setcurrentUserHasVotedRequests] =
    React.useState([]);
  const [currentUserAddress, setCurrentUserAddress] = React.useState(""); // TODELETE: using context for tir

  const contractAPIInstance = contractAPI();

  async function getAllRequests() {
    console.log("capturando requests");
    const requestsCount = await contractAPIInstance.getRequestsCount(
      campaignAddress
    );
    // We go one by one, asking the native method of the contract 'requests(i)'
    let requestsList = [];
    for (let i = 0; i < parseInt(requestsCount); i++) {
      const request = await contractAPIInstance.getRequestByIndex(
        campaignAddress,
        i
      );
      requestsList.push(request);
      console.log(request);
    }
    return requestsList;
  }

  async function getCurrentUserHasVotedRequests() {
    if (requests.length === 0) return;
    const currentUAddress = await contractAPIInstance.getCurrentUserAddress();
    setCurrentUserAddress(currentUAddress);
    const rrr = parseInt(Math.random() * 1000);
    //alert("TODELETE: entered for the first time " + rrr);
    let currentUserHasVotedRequestsTemp = [];

    requests.forEach(async (req, i) => {
      contractAPIInstance
        .hasAddressVoted(campaignAddress, currentUAddress, i)
        .then((hasVoted) => {
          currentUserHasVotedRequestsTemp[i] = hasVoted;
          // alert(
          //   `resulting ${rrr}: ${currentUAddress} at ${i}` +
          //     currentUserHasVotedRequestsTemp[i]
          // );
          if (i === requests.length - 1) {
            // alert(
            //   "lets save the result " +
            //     rrr +
            //     " >> " +
            //     currentUserHasVotedRequestsTemp.join(",")
            // );
            setcurrentUserHasVotedRequests(currentUserHasVotedRequestsTemp);
          }
        });
    });
  }

  React.useEffect(() => {
    getAllRequests().then((requestsList) => {
      setRequests(requestsList);
    });
  }, []);

  React.useEffect(() => {
    getCurrentUserHasVotedRequests();
  }, [requests]);

  // handlers
  function handleOnApproveRequest(e, index) {
    e.preventDefault();
    // call the api to approve the request with that index (.sol >> `function approveRequest(uint256 index) public`)
    contractAPI()
      .approveRequest(campaignAddress, index)
      .then(() => {
        // rerender the component
        setRerender(rerender + 1);
      });
  }

  function handleFinalizeRequest(e, index) {
    e.preventDefault();
    // call the api to finalize the request with that index (.sol >> `function finalizeRequest(uint256 index) public`)
    try {
      contractAPI()
        .finalizeRequest(campaignAddress, index)
        .then(() => {
          // rerender the component
          setRerender(rerender + 1);
        });
    } catch (error) {
      alert(error.message);
    } finally {
      // reload
    }
  }

  return (
    <div>
      <span style={{ display: "none" }}>
        {rerender} {rerenderParam} I dont think this works... I created to
        rerender the component after a contract change
      </span>
      <h1>RequestsList</h1>
      <div>
        current user address: {currentUserAddress}
        <br /> Repeat: {ContractData.currentUserAddress}
        <br />
        {currentUserHasVotedRequests}
      </div>
      <Card.Group>
        {requests.map((reqObject, i) => (
          <Card key={`req-${i}`} color={reqObject.complete ? "grey" : "orange"}>
            <Card.Content>
              <Card.Header>
                <h3>
                  Request {i + 1} / {requests.length}
                </h3>
                <h2>Voting: {currentUserHasVotedRequests[i] ? "YES" : "NO"}</h2>
                <p>{reqObject.description}</p>
              </Card.Header>
              <hr />
              <p>
                {reqObject.complete ? "" : "Asking for "}
                <b>{Web3.utils.fromWei(reqObject.value, "ether")} ETH</b>
              </p>
              <p style={{ overflow: "hidden" }}>To {reqObject.recipient}</p>
              <p>{reqObject.complete ? "Completed" : "Pending"}</p>
              <p>
                People who approved: {reqObject.approvalCount}
                {" / "}
                {totalContributors}
              </p>
              {!reqObject.complete && (
                <Card.Meta>
                  {!currentUserHasVotedRequests[i] ? (
                    <>
                      <Button
                        color={"olive"}
                        onClick={(e) => handleOnApproveRequest(e, i)}
                      >
                        Approve
                      </Button>
                      <Button>Reject</Button>
                    </>
                  ) : (
                    <p>You already voted</p>
                  )}

                  {/* Finalize request if manager of the campaign is the same as current user, and balance of campaign is bigger that requested money */}
                  {currentUserAddress === campaignManager &&
                    parseInt(campaignBalance) > reqObject.value && (
                      <div>
                        <Button
                          color="red"
                          onClick={(e) => handleFinalizeRequest(e, i)}
                        >
                          Finalize
                        </Button>
                      </div>
                    )}
                </Card.Meta>
              )}
            </Card.Content>
          </Card>
        ))}
      </Card.Group>
    </div>
  );
}

export default RequestsList;
