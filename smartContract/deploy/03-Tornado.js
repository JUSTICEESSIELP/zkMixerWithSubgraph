const verify = require("../helperFunction");

const { ethers } = require("hardhat");

const developmentChains = ["localhost", "hardhat"];
module.exports = async ({ getNamedAccounts, deployments, network }) => {
  const { deploy, log } = deployments;
  const { deployer } = await getNamedAccounts();
  const spongeContract = await ethers.getContract("Hasher", deployer);
  const verifierContract = await ethers.getContract(
    "Groth16Verifier",
    deployer
  );
  const tornado = await deploy("Tornado", {
    from: deployer,
    args: [spongeContract.address, verifierContract.address],
    log: true,
  });

  log("-------------------------------------------------------");
  log(` MIMC ADDRESS ${tornado.address}`);
  if (
    !developmentChains.includes(network.name) &&
    process.env.ETHERSCAN_API_KEY
  ) {
    await verify(hasherSponge.address, []);
  }
};
module.exports.tags = ["all", "Tornado"];

// const governor = await ethers.getContract("GovernorContract", deployer)
