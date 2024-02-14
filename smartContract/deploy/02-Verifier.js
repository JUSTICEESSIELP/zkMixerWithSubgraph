const verify = require("../helperFunction");

const developmentChains = ["localhost", "hardhat"];
module.exports = async ({ getNamedAccounts, deployments, network }) => {
  const { deploy, log } = deployments;
  const { deployer } = await getNamedAccounts();
  const hasherSponge = await deploy("Groth16Verifier", {
    from: deployer,
    args: [],
    log: true,
  });

  if (
    !developmentChains.includes(network.name) &&
    process.env.ETHERSCAN_API_KEY
  ) {
    await verify(hasherSponge.address, []);
  }
};
module.exports.tags = ["all", "Groth16Verifier"];
