HOW THIS WAS BUILT
===
- We use `node compile.js`to create FILES with the JSON strings for every contract, containing the interface (ABI) and bytcode (assembler).
- That is what we need to deploy the CampaignFactory contract!
- When we started to build our frontend app in Next JS, we created `web3.js`, and there we grab the provider of Google Chrome, which is the one connected to Metamask (we need to have the extension, and having it active).
- We assign that provided to our Web3 library. (we don't use the web3 library of the browser because it is an old version, so we do this hijack)