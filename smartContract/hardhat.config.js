require("@nomicfoundation/hardhat-toolbox");
require("hardhat-deploy");

require("@nomiclabs/hardhat-etherscan");

require("dotenv").config();

require("hardhat-contract-sizer");

require("@nomicfoundation/hardhat-network-helpers");

const providerApiKey =
  process.env.ALCHEMY_API_KEY || "oKxs-03sij-U_N0iOlrSsZFr29-IqbuF";
const MAINNET_RPC_URL =
  process.env.MAINNET_RPC_URL ||
  process.env.ALCHEMY_MAINNET_RPC_URL ||
  "https://eth-mainnet.alchemyapi.io/v2/oKxs-03sij-U_N0iOlrSsZFr29-IqbuF";
const SEPOLIA_RPC_URL =
  process.env.SEPOLIA_RPC_URL ||
  "https://eth-sepolia.g.alchemy.com/v2/YOUR-API-KEY";
const POLYGON_MAINNET_RPC_URL =
  process.env.POLYGON_MAINNET_RPC_URL ||
  "https://polygon-mainnet.alchemyapi.io/v2/your-api-key";
const PRIVATE_KEY = process.env.WALLET_PRIVATE_KEY;

const etherscanApiKey = "DNXJA8RX2Q3VZ4URQIWP7Z68CJXQZSC6AW";

const MNEMONIC = process.env.MNEMONIC || "your mnemonic";

const ETHERSCAN_API_KEY =
  process.env.ETHERSCAN_API_KEY || "Your etherscan API key";
const POLYGONSCAN_API_KEY =
  process.env.POLYGONSCAN_API_KEY || "Your polygonscan API key";
const REPORT_GAS = process.env.REPORT_GAS || false;

module.exports = {
  solidity: {
    compilers: [
      {
        version: "0.8.17",
      },
      {
        version: "0.8.0",
      },
      {
        version: "0.7.0",
      },
    ],

    settings: {
      optimizer: {
        enabled: true,
        // https://docs.soliditylang.org/en/latest/using-the-compiler.html#optimizer-options
        runs: 200,
      },
    },
  },
  circom: {
    // (optional) Base path for input files, defaults to `./circuits/`
    inputBasePath: "./circuits",
    // (required) The final ptau file, relative to inputBasePath, from a Phase 1 ceremony
    ptau: "pot14_0002.ptau",
    // (required) Each object in this array refers to a separate circuit
    circuits: [{ name: "ageLimit" }],
  },
  defaultNetwork: "hardhat",
  namedAccounts: {
    deployer: {
      default: 0, // here this will by default take the first account as deployer
      1: 0, // similarly on mainnet it will take the first account as deployer. Note though that depending on how hardhat network are configured, the account 0 on one network can be different than on another
    },
    player: {
      default: 1,
    },
  },
  verify: {
    etherscan: {
      apiKey: {
        goerli: "y",
      },
    },
  },
  networks: {
    hardhat: {
      chainId: 31337,
    },
    // localhost: {
    //   chainId: 31337,
    // },

    goerli: {
      url: `https://eth-goerli.alchemyapi.io/v2/${providerApiKey}`,
      accounts: PRIVATE_KEY !== undefined ? [PRIVATE_KEY] : [],
      saveDeployments: true,
    },
    sepolia: {
      url: `https://eth-sepolia.g.alchemy.com/v2/${providerApiKey}`,
      accounts: PRIVATE_KEY !== undefined ? [PRIVATE_KEY] : [],
      saveDeployments: true,
      chainId: 11155111,
    },
    mainnet: {
      url: MAINNET_RPC_URL,
      accounts: PRIVATE_KEY !== undefined ? [PRIVATE_KEY] : [],
      saveDeployments: true,
      chainId: 1,
    },
    polygon: {
      url: POLYGON_MAINNET_RPC_URL,
      accounts: PRIVATE_KEY !== undefined ? [PRIVATE_KEY] : [],
      saveDeployments: true,
      chainId: 137,
    },
    optimism: {
      url: `https://opt-mainnet.g.alchemy.com/v2/${providerApiKey}`,
      accounts: PRIVATE_KEY !== undefined ? [PRIVATE_KEY] : [],
    },
    optimismGoerli: {
      url: `https://opt-goerli.g.alchemy.com/v2/${providerApiKey}`,
      accounts: PRIVATE_KEY !== undefined ? [PRIVATE_KEY] : [],
    },
  },
};
