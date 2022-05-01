// grab the .sol and, with web3 lib, compiles into abi and bytecode.
// the we esport those two to use them in deploy.js

const path = require("path");
const solc = require("solc");
const fs = require("fs-extra");

// retrieve '/build'
const buildPath = path.resolve(__dirname, "build");
// delete the folder, so we can create it clean again.
fs.removeSync(buildPath);
fs.mkdirSync(buildPath);

// compile the src code for CampaingFactory and Campaign. Note the difference in compiling the Campaign.
const campaignContractsPath = path.resolve(
  __dirname,
  "contracts",
  "Campaign.sol"
);
const source = fs.readFileSync(campaignContractsPath, "UTF-8"); // read the file

// >>>>>>> THE ACTION: COMPILE ALL CONTRACTS AND RETRIEVE THE JS OBJECT <<<<<<<<<<<<<<<
const { contracts } = solc.compile(source, 1);
// >>>>>>>>>>>>>>>>>>  we get ':Campaign' and ':CampaignFactory' objects, with the bytecode and abi.

// const compiledFactoryFilePath = path.resolve(buildPath, 'CampaignFactory.json');
// const compiledCampaignFilePath = path.resolve(buildPath, 'Campaign.json');
for (contract in contracts) {
  console.log("found contract: ", contract);
  const contractObject = contracts[contract];
  const outputFilePath = path.resolve(
    buildPath,
    contract.replace(":", "") + ".json"
  );
  fs.outputJSON(outputFilePath, contractObject, (err) => {
    if (err) return console.log(err);
    console.log("Object written to given JSON file");
  });
}
