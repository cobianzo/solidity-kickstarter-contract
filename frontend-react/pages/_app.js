import "../styles/globals.css";
import "semantic-ui-css/semantic.min.css";

//import FactoryForMetamask from '../../ethereum/FactoryForMetamask' // this is an instance of campaignsFactory contract.
import React from "react";
import App from "next/app";
import contractApi from "./api/contractApi";
// Context vars access
export const ContractFactoryContext = React.createContext({
  campaigns: [],
  setCampaigns: () => {},
  campaignFactoryAddress: null,
  currentUserAddress: null,
});

/**    REACT FUNCTIONAL COMPONENT START    */
function MyApp({
  Component,
  pageProps,
  iniPropCampaigns,
  iniPropContractAddress,
  iniPropCurrentUserAddress, // TODO: this doesnt work, its value is not initialized
}) {
  // this is loaded initially in the Server. then on every refresh it is loaded in the client.
  const [val, setVal] = React.useState({
    campaigns: iniPropCampaigns,
    campaignFactoryAddress: iniPropContractAddress,
    currentUserAddress: iniPropCurrentUserAddress,
  });

  /** Component calls Page.js which is the one defined by the url */
  return (
    <ContractFactoryContext.Provider value={[val, setVal]}>
      <Component {...pageProps} />
    </ContractFactoryContext.Provider>
  );
}

/** I had loaded it initially in useEffect, and worked also ok */
/** In that case the app loads initially and after the page is loaded it look up the campaigs */
MyApp.getInitialProps = async (appContext) => {
  const appProps = await App.getInitialProps(appContext);

  const contractApiInstance = contractApi();
  const ic = await contractApiInstance.getContract(); // instance of the contract.
  const iniPropCampaigns = await contractApiInstance.getAllCampaigns(ic);
  const iniPropCurrentUserAddress =
    await contractApiInstance.getCurrentUserAddress();

  return {
    ...appProps,
    myAppmmm: "Will this work for the initla MyAPP???",
    iniPropCampaigns,
    iniPropContractAddress: ic._address,
    iniPropCurrentUserAddress,
  };
};

export default MyApp;
