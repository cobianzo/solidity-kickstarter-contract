const HDWalletProvider = require('@truffle/hdwallet-provider');
const Web3 = require('web3');
// const Web3EthContract = require('web3-eth-contract');
const compiledFactory = require('./build/CampaignFactory.json');

// edit .env file.
require('dotenv').config();
const provider = new HDWalletProvider(
  process.env.METAMASK_MNEMONIC,
  process.env.INFURA_ENDPOINT,
);
// Web3EthContract.setProvider(provider);
const web3 = new Web3(provider);

const deploy = async () => {
    const accounts = await web3.eth.getAccounts();

    console.log('Attempting to deploy from account', accounts[0]);

    const contract = new web3.eth.Contract(JSON.parse(compiledFactory.interface), null, {
        data: compiledFactory.bytecode,
        from: accounts[0],
        gas: '1000000', 
    });

//    var contract = new web3.eth.Contract( JSON.parse(compiledFactory.interface) );
    console.log('contract: ', contract);
    const contractReady = await contract.deploy({
                        data: compiledFactory.bytecode
                    });
    const estimatedGas = await contractReady.estimateGas();

    const result = await contractReady.send({
        from: accounts[0],
        gas: estimatedGas
    });

    console.log('Contract deployed to', result.options.address);
    provider.engine.stop();
}
deploy();
