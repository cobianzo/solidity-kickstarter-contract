import Web3 from "web3";

// We assume Metamask is active.
const web3 = new Web3(window.web3.currentProvider);

export default web3;