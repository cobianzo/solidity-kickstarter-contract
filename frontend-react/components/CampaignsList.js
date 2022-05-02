import React from "react";

import styles from "../styles/CampaignsList.module.css";
import contractAPI from "../pages/api/contractApi";
import { ContractFactoryContext } from "../pages/_app";
import { Button, Card } from "semantic-ui-react";
import Link from "next/link";

function CampaignsList({}) {
  const [ContractData, setContractData] = React.useContext(
    // context to access to the campagins.
    ContractFactoryContext
  );
  const [itemCards, setItemCards] = React.useState([]);
  const [campaignBalances, setCampaignBalances] = React.useState([]);

  React.useEffect(() => {
    let items; // to render the balances

    // I think this is not working now
    contractAPI()
      .connectToEthereum()
      .then((web3) => {
        // calculate balance in every campaign
        Promise.all([
          ContractData.campaigns.forEach((cc, i) => {
            web3.eth.getBalance(cc, function (err, result) {
              if (err) {
                console.log(err);
              } else {
                const eths = web3.utils.fromWei(result, "ether");
                const cb = [...campaignBalances];
                cb[i] = eths;
                setCampaignBalances(cb);
              }
            });
          }),
        ]).then(() => {
          // SET THE CARDS with the items!
          const newItems = items.map((it, i) =>
            campaignBalances[i] !== false
              ? Object.assign(
                  { ...it },
                  {
                    meta: (
                      <>
                        {" "}
                        <Link href={`./campaigns/${ContractData.campaigns[i]}`}>
                          View campaign
                        </Link>{" "}
                        balance...
                        {campaignBalances[i]}
                      </>
                    ),
                  }
                )
              : it
          );
          setItemCards(newItems);
        });
      });

    console.log(ContractData);
    // const newSD = { ...ContractData, campaigns: [] };
    // setContractData(newSD);
    items = ContractData.campaigns.map((cc, i) => {
      // get more info about the contract instance. Balance, for example
      // console.log(Web3.address(cc))
      return {
        header: "Campaign #" + i,
        description: cc.substring(0, 10) + "...",
        meta: <a href="#">View campaign</a>,
      };
    });
    setItemCards(items);
  }, [ContractData.campaigns]);

  /** ------------ J S X ------------------------------------------------------------ */
  return (
    <>
      <h1>Campaigns</h1>
      {itemCards.length > 0 ? (
        <Card.Group items={itemCards} className={styles.card_group} />
      ) : (
        <Card.Group>
          <Card>
            <Card.Content textAlign="center">
              <h3>There are no campaigns yet</h3>
              <Link href="./campaigns/new">
                <Button>Create the first campaign</Button>
              </Link>
            </Card.Content>
          </Card>
        </Card.Group>
      )}
    </>
  );
}

export default CampaignsList;
