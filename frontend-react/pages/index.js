import Head from "next/head";
// import Image from 'next/image'
import CampaignsList from "../components/CampaignsList";
import Layout from "../components/Layout";
// import styles from '../styles/Home.module.css'

import { Grid } from "semantic-ui-react";
import { Button, Icon } from "semantic-ui-react";
import Link from "next/link";

import React from "react";
import { ContractFactoryContext } from "../pages/_app";

export default function Home(props) {
  const [ContractData, setContractData] = React.useContext(
    // context to access to the campagins.
    ContractFactoryContext
  );

  function handleCreateCampaign(e) {
    e.preventDefault();
    // get current contract and execute method create campaign
    alert("crea crea");
  }

  return (
    <>
      <Head>
        <title>Project funding</title>
        <meta
          name="description"
          content="fund your projects with this Ethereum app"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Layout>
        <Grid className="container">
          <Grid.Row>
            <Grid.Column width={12}>
              <main className="main">
                This is home {props.mmm} Factory deployed at
                <pre>{ContractData.campaignFactoryAddress}</pre>
                <CampaignsList />
              </main>
            </Grid.Column>
            <Grid.Column width={4}>
              <aside className="aside">
                <Link href="./campaigns/new">
                  <Button icon labelPosition="left">
                    <Icon name="play" />
                    Create campaign
                  </Button>
                </Link>
              </aside>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Layout>
    </>
  );
}

/* This works it was just a test - generated on the server and sent as HTML. Good for SEO.
export async function getStaticProps() {
  // Call an external API endpoint to get posts.
  // You can use any data fetching library
  const mmm = "THIS IS MY VAR";
  // By returning { props: { posts } }, the Blog component
  // will receive `posts` as a prop at build time
  return {
    props: {
      mmm,
      aaa : 'Y LO QIEQ UEREAS'
    },
  }
}
*/

// get initial props is suggested by the course. SSR, and sent as HTML
Home.getInitialProps = async (appContext) => {
  // const appProps = await App.getInitialProps(appContext);
  return {
    mmm: "ESTO ES INITIAL POROP, cargado desde el cliente a posteriori man",
  };
};
