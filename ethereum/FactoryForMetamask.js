import web3 from "./web3"; // the web3 with metamask provided. Connected to Rinkeby testnet.
import campaignFactory from './build/CampaignFactory.json';

export default instanceC = new web3.eth.Contract( 
    JSON.parse(campaignFactory.interface), 
    "0xBBF051fbd1B7B91a7D75c363e59d20Cb049B62b0" // CONTRACT_FACTORY_DEPLOY_ADDRESS   // We created this address with deploy.js by hand, and the console.log told us the address in the result var. 
    // 0xBBF051fbd1B7B91a7D75c363e59d20Cb049B62b0
);