import Web3 from "web3";
import CampaignFactoryCompiled from "../../../ethereum/build/CampaignFactory.json";
import CampaignCompiled from "../../../ethereum/build/Campaign.json";

/** just a set of functions  */
export default function contractAPI() {
  const API = {};

  // Returns web3 library connected to the Rinkeby testnet.
  API.connectToEthereum = async () => {
    let web3;
    if (
      typeof window !== "undefined" &&
      typeof window.ethereum !== "undefined"
    ) {
      // if it has been created already. Use it.
      if (typeof window.web3Alvaro !== "undefined") {
        web3 = window.web3Alvaro;
      } else {
        // We are in the browser and metamask is running. // this needs to be run in the client. If in the server (SSR) it will not have access to the window, obviously!
        console.log(
          ">> We are in CLIENT: Initializing provider from Metamask. "
        );
        window.ethereum.request({ method: "eth_requestAccounts" });
        web3 = new Web3(window.ethereum); // window.ethereum is equivalent to window.web3.currentProvider
        window.web3Alvaro = web3; // save it in the window.
      }
    } else {
      // We are on the server *OR* the user is not running metamask
      console.log(">> We are in SERVER: Initializing provider from Infura. ");
      const provider = new Web3.providers.HttpProvider(
        process.env.INFURA_ENDPOINT_WITH_CONTRACT_ATTACHED
      );
      web3 = new Web3(provider);
    }

    return web3; // web3 with provider attached.
  };

  // To get the campaignFactory contract instance in a certain address
  API.getContract = async (address = null, factoryOrCampaing = "factory") => {
    const web3 = await API.connectToEthereum();
    // if (typeof window !== "undefined")
    //   alert(process.env.CONTRACT_FACTORY_DEPLOY_ADDRESS);

    const interfaceABI =
      factoryOrCampaing === "factory"
        ? CampaignFactoryCompiled.interface
        : CampaignCompiled.interface;
    const contractAddress =
      address || process.env.CONTRACT_FACTORY_DEPLOY_ADDRESS; // We created this address with deploy.js by hand, and the console.log told us the address in the result var.

    // Let's load the contract to access to tit smethods and variables!
    const instanceC = await new web3.eth.Contract(
      JSON.parse(interfaceABI),
      contractAddress
    );

    // console.log("AQUITOTELEDLE ", instanceC.methods);
    return instanceC;
  };

  // intanceC is the contract CampaignsFactory instance.
  API.getAllCampaigns = async (instanceC) => {
    const campaigns = await instanceC.methods.getDeployedCampaigns().call();
    return campaigns;
  };

  // TODO function
  API.getCampaignDetails = async (address) => {
    // todo
  };

  // List of addressess ¿inside the network?
  API.getAccounts = async () => {
    const web3 = await API.connectToEthereum();
    const accounts = await web3.eth.getAccounts();
    return accounts;
  };

  // intanceC is the contract CampaignsFactory instance.
  API.createCampaign = async (minimumContribution) => {
    const accounts = await API.getAccounts();
    const contract = await API.getContract();

    if (!accounts.length) {
      alert("Could not find any account in the network");
      return;
    }
    if (!contract.methods) {
      alert("Error connecting to the contract factory.");
      return;
    }

    // Do the job! TODO: catch error?
    await contract.methods.createCampaign(minimumContribution.toString()).send({
      from: accounts[0],
      gas: "1000000",
    });
  };

  /**
   * Connects with Web3 to the contract campaign and returns info about it.
   * WHERE: campaigns/[address] -> single campaign page
   * @param {address} campaignAddress : the address of the contract Campaign that we want info from.
   * @returns { Object } : the info of the campaign, separated by keys.
   */
  API.getCampaignDetails = async (campaignAddress) => {
    // try catch and throw error.
    const campaignContract = await API.getContract(campaignAddress, "campaign");
    const campaignData = await campaignContract.methods
      .getCampaignDetails()
      .call();
    return {
      minimumContribution: campaignData[0],
      balance: campaignData[1],
      requestsCount: campaignData[2],
      approversCount: campaignData[3],
      manager: campaignData[4],
    };
  };

  // --------------------------------------------------
  API.contributeToCampaign = async (campaignAddress, amountinWeis) => {
    const accounts = await API.getAccounts();
    const campaignContract = await API.getContract(campaignAddress, "campaign");
    console.log(":::: TODELEEE", campaignContract, amountinWeis);
    // return "";
    try {
      await campaignContract.methods.contribute().send({
        from: accounts[0],
        value: amountinWeis,
        // no need to specify the gas, it's automatically calculated.
      });
      return true;
    } catch (error) {
      alert("error");
      console.log(error);
      throw error;
    }
  };

  // --------------------------------------------------
  API.createRequest = async (
    campaignAddress,
    recipentAddress,
    amountinWeis,
    description
  ) => {
    const accounts = await API.getAccounts();
    const campaignContract = await API.getContract(campaignAddress, "campaign");
    console.log(":::: TODELEEE", campaignContract, amountinWeis);
    // return "";
    try {
      await campaignContract.methods
        .createRequest(description, amountinWeis, recipentAddress)
        .send({
          from: accounts[0],
        });
      return true;
    } catch (error) {
      alert("error");
      console.log(error);
      throw error;
    }
  };
  // --------------------------------------------------
  /**
   * Returns the number of requests. Useful to iterate it.
   */
  API.getRequestsCount = async (campaignAddress) => {
    const campaignContract = await API.getContract(campaignAddress, "campaign");
    if (campaignContract.methods) {
      return campaignContract.methods.getRequestsCount().call();
    } else {
      // throw error
    }
  };
  // --------------------------------------------------
  API.getRequestByIndex = async (campaignAddress, index) => {
    const campaignContract = await API.getContract(campaignAddress, "campaign");
    if (campaignContract.methods) {
      return campaignContract.methods.requests(index).call();
    } else {
      // throw error
    }
  };
  // --------------------------------------------------
  API.approveRequest = async (campaignAddress, requestIndex) => {
    const accounts = await API.getAccounts();
    const campaignContract = await API.getContract(campaignAddress, "campaign");
    if (campaignContract.methods) {
      return campaignContract.methods
        .approveRequest(requestIndex)
        .send({ from: accounts[0] });
    } else {
      // throw error
    }
  };
  // --------------------------------------------------
  // I dont know how to get the current address of the user.
  API.getCurrentUserAddress = async () => {
    const accounts = await API.getAccounts();
    return accounts[0];
    // const w3 = await API.connectToEthereum();
    // console.log("3FDAFDS", w3);
    // return w3.currentProvider.selectedAddress;
  };
  // --------------------------------------------------
  API.hasAddressVoted = async (campaignAddress, addressUser, requestIndex) => {
    const campaignContract = await API.getContract(campaignAddress, "campaign");

    if (campaignContract.methods) {
      return campaignContract.methods
        .hasAddressVoted(addressUser, requestIndex)
        .call();
    } else {
      // throw error
    }
  };

  API.finalizeRequest = async (campaignAddress, requestIndex) => {
    const accounts = await API.getAccounts();
    const campaignContract = await API.getContract(campaignAddress, "campaign");
    const theMethod = campaignContract.methods.finalizeRequest;
    if (typeof theMethod !== "function") {
      throw new Error(
        "instace of the contract fif not work well. The method is not allowd"
      );
    }
    return theMethod(requestIndex).send({
      from: accounts[0], // current user
    });
  };

  API.test = async (campaignAddress) => {
    // const campaignContract = await API.getContract(campaignAddress, "campaign");
    // const methodExists = campaignContract.methods.hasAddressVoted;
    // alert("meethod : " + typeof methodExists);
    // methodExists("0xcC79F1986BA57c3697E370e9f3bFB045628eAF56", 0)
    //   .call()
    //   .then((result) => alert("request 0 for this user" + result));
    API.hasAddressVoted(
      campaignAddress,
      "0xcC79F1986BA57c3697E370e9f3bFB045628eAF56",
      0
    ).then((result) => alert("request 0 for this user" + result));
  };
  // --------------------------------------------------
  // --------------------------------------------------
  // --------------------------------------------------
  // --------------------------------------------------
  return API;
}
