import { config as dotEnvConfig } from "dotenv";
import { HardhatUserConfig } from "hardhat/config";
import type { HttpNetworkUserConfig } from "hardhat/types";
import { BigNumber } from "ethers";
import "@nomicfoundation/hardhat-toolbox";
import "@nomiclabs/hardhat-etherscan";
import "@nomiclabs/hardhat-ethers";
import "@openzeppelin/hardhat-upgrades";
import "hardhat-gas-reporter";

// Load the env configuration
dotEnvConfig();

const primarySolidityVersion = process.env.SOLIDITY_VERSION || "0.7.6";
const soliditySettings = process.env.SOLIDITY_SETTINGS
  ? JSON.parse(process.env.SOLIDITY_SETTINGS)
  : undefined;

const DEFAULT_MNEMONIC =
  "candy maple cake sugar pudding cream honey rich smooth crumble sweet treat";

const sharedNetworkConfig: HttpNetworkUserConfig = {};
if (process.env.PK) {
  sharedNetworkConfig.accounts = [process.env.PK];
} else {
  sharedNetworkConfig.accounts = {
    mnemonic: process.env.MNEMONIC || DEFAULT_MNEMONIC,
  };
}

const config: HardhatUserConfig = {
  solidity: {
    compilers: [
      { version: primarySolidityVersion, settings: soliditySettings },
      { version: "0.6.12" },
      { version: "0.5.17" },
    ],
  },

  networks: {
    // Local networks
    ganache: {
      url: "http://127.0.0.1:7545",
      from: process.env.FROM,
    },
    hardhat: {
      from: process.env.FROM,
    },

    // Ethereum
    mainnet: {
      ...sharedNetworkConfig,
      url: `https://mainnet.infura.io/v3/${process.env.INFURA_KEY}`,
    },
    goerli: {
      ...sharedNetworkConfig,
      url: `https://goerli.infura.io/v3/${process.env.INFURA_KEY}`,
    },
    sepolia: {
      ...sharedNetworkConfig,
      url: `https://sepolia.infura.io/v3/${process.env.INFURA_KEY}`,
    },

    // Optimism
    optimisticEthereum: {
      ...sharedNetworkConfig,
      url: `https://optimism-mainnet.infura.io/v3/${process.env.INFURA_KEY}`,
    },
    optimisticGoerli: {
      ...sharedNetworkConfig,
      url: `https://optimism-goerli.infura.io/v3/${process.env.INFURA_KEY}`,
    },

    // Arbitrum
    arbitrum: {
      ...sharedNetworkConfig,
      url: `https://arbitrum-mainnet.infura.io/v3/${process.env.INFURA_KEY}`,
    },
    arbitrumGoerli: {
      ...sharedNetworkConfig,
      url: `https://arbitrum-goerli.infura.io/v3/${process.env.INFURA_KEY}`,
    },

    // Base

    base: {
      ...sharedNetworkConfig,
      url: "https://mainnet.base.org",
      gasPrice: 1500000050,
    },
    baserli: {
      ...sharedNetworkConfig,
      url: "https://goerli.base.org",
      gasPrice: 150000000,
    },

    // WBTestnet
    wbTestnet: {
      ...sharedNetworkConfig,
      url: "https://rpc-testnet.whitebit.network",
    },

    // Polygon
    polygon: {
      ...sharedNetworkConfig,
      url: `https://polygon-mainnet.infura.io/v3/${process.env.INFURA_KEY}`,
    },
    polygonMumbai: {
      ...sharedNetworkConfig,
      url: `https://polygon-mumbai.infura.io/v3/${process.env.INFURA_KEY}`,
    },

    // BNB Chain
    bsc: {
      ...sharedNetworkConfig,
      url: "https://bsc-dataseed.binance.org/",
      gasPrice: 5000000000,
    },
    bscTestnet: {
      ...sharedNetworkConfig,
      url: "https://data-seed-prebsc-1-s1.binance.org:8545",
    },
  },

  etherscan: {
    apiKey: {
      mainnet: process.env.ETHER_SCAN_KEY as string,
      goerli: process.env.ETHER_SCAN_KEY as string,
      sepolia: process.env.ETHER_SCAN_KEY as string,
      bsc: process.env.BSC_SCAN_KEY as string,
      bscTestnet: process.env.BSC_SCAN_KEY as string,
      optimisticEthereum: process.env.OPTIMISTIC_SCAN_KEY as string,
      optimisticGoerli: process.env.OPTIMISTIC_SCAN_KEY as string,
      arbitrumOne: process.env.ARBI_SCAN_KEY as string,
      arbitrumGoerli: process.env.ARBI_SCAN_KEY as string,
      polygon: process.env.POLYGON_SCAN_KEY as string,
      polygonMumbai: process.env.POLYGON_SCAN_KEY as string,
      base: process.env.BASE_SCAN_KEY as string,
      baserli: "NO NEED API KEY FOR THIS TESTNET",
    },
    customChains: [
      {
        network: "baserli",
        chainId: 84531,
        urls: {
          apiURL: "https://api-goerli.basescan.org/api",
          browserURL: "https://goerli.basescan.org",
        },
      },
      {
        network: "base",
        chainId: 8453,
        urls: {
          apiURL: "https://api.basescan.org/api",
          browserURL: "https://basescan.org",
        },
      },
    ],
  },
  gasReporter: {
    enabled: process.env.REPORT_GAS ? true : false,
  },
};

export default config;

declare var task: any;
task(
  "signerBalance",
  "Get the signer balance on specified network",
  async () => {
    const { ethers } = require("hardhat");
    const wallet = ethers.Wallet.fromMnemonic(process.env.MNEMONIC);
    await ethers.provider
      .getBalance(wallet.address)
      .then((balance: BigNumber) => {
        console.log(
          `${wallet.address} has ${ethers.utils.formatEther(
            balance
          )} in balance`
        );
      });
  }
);

task("balance", "Prints an account's balance")
  .addParam("address", "The account's address")
  .setAction(async (taskArgs) => {
    const { ethers } = require("hardhat");

    const balance = await ethers.provider.getBalance(taskArgs.address);

    console.log(ethers.utils.formatEther(balance), "ETH");
  });

task("deploy", "Deploy contract")
  .addFlag("upgradable", "The contract is upgradable as proxy and factory")
  .addParam("contractName", "The contract's name")
  .setAction(async (taskArgs) => {
    const { ethers, upgrades } = require("hardhat");

    const ContractFactory = await ethers.getContractFactory(
      taskArgs.contractName
    );

    if (!taskArgs.upgradable) {
      const contract = await ContractFactory.deploy();
      await contract.deployed();

      console.log(`Contract deployed at ${contract.address}`);
      console.log(`Transaction: ${contract.deployTransaction.hash}`);
    } else {
      const contract = await upgrades.deployProxy(ContractFactory);
      await contract.deployed();

      console.log(`Contract deployed as proxy at ${contract.addres}`);
      console.log(`Transaction: ${contract.deployTransaction.hash}`);
    }
  });

task("upgrade", "Upgrade factory contract")
  .addParam("contractName", "The Factory contract name to deploy")
  .addParam("proxyAddress", "The Proxy contract address to upgrade")
  .setAction(async (taskArgs) => {
    const { ethers, upgrades } = require("hardhat");

    const ContractFactory = await ethers.getContractFactory(
      taskArgs.contractName
    );

    const contract = await upgrades.upgradeProxy(
      taskArgs.contractAddress,
      ContractFactory
    );

    console.log(`Transaction: ${contract.deployTransaction.hash}`);
  });
