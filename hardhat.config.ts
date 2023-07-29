import { config as dotEnvConfig } from "dotenv";
import { HardhatUserConfig } from "hardhat/config";
import { BigNumber } from "ethers";
import "@nomicfoundation/hardhat-toolbox";
import "@nomiclabs/hardhat-etherscan";
import "@nomiclabs/hardhat-ethers";
import "hardhat-gas-reporter";

// Load the env configuration
dotEnvConfig();

const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.18",
    settings: {
      optimizer: {
        enabled: true,
      },
    },
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
      url: `https://mainnet.infura.io/v3/${process.env.INFURA_KEY}`,
      accounts: { mnemonic: process.env.MNEMONIC },
    },
    goerli: {
      url: `https://goerli.infura.io/v3/${process.env.INFURA_KEY}`,
      accounts: { mnemonic: process.env.MNEMONIC },
    },
    sepolia: {
      url: `https://sepolia.infura.io/v3/${process.env.INFURA_KEY}`,
      accounts: { mnemonic: process.env.MNEMONIC },
    },

    // Optimism
    optimisticEthereum: {
      url: `https://optimism-mainnet.infura.io/v3/${process.env.INFURA_KEY}`,
      accounts: { mnemonic: process.env.MNEMONIC },
    },
    optimisticGoerli: {
      url: `https://optimism-goerli.infura.io/v3/${process.env.INFURA_KEY}`,
      accounts: { mnemonic: process.env.MNEMONIC },
    },

    // Arbitrum
    arbitrum: {
      url: `https://arbitrum-mainnet.infura.io/v3/${process.env.INFURA_KEY}`,
      accounts: { mnemonic: process.env.MNEMONIC },
    },
    arbitrumGoerli: {
      url: `https://arbitrum-goerli.infura.io/v3/${process.env.INFURA_KEY}`,
      accounts: { mnemonic: process.env.MNEMONIC },
    },

    // Base

    base: {
      url: "https://mainnet.base.org",
      accounts: { mnemonic: process.env.MNEMONIC },
      gasPrice: 1500000050,
    },
    baserli: {
      url: "https://goerli.base.org",
      accounts: { mnemonic: process.env.MNEMONIC },
    },

    // WBTestnet
    wbTestnet: {
      url: "https://rpc-testnet.whitebit.network",
      accounts: { mnemonic: process.env.MNEMONIC },
    },

    // Polygon
    polygon: {
      url: `https://polygon-mainnet.infura.io/v3/${process.env.INFURA_KEY}`,
      accounts: { mnemonic: process.env.MNEMONIC },
    },
    polygonMumbai: {
      url: `https://polygon-mumbai.infura.io/v3/${process.env.INFURA_KEY}`,
      accounts: { mnemonic: process.env.MNEMONIC },
    },

    // BNB Chain
    bsc: {
      url: "https://bsc-dataseed.binance.org/",
      accounts: { mnemonic: process.env.MNEMONIC },
      gasPrice: 5000000000,
    },
    bscTestnet: {
      url: "https://data-seed-prebsc-1-s1.binance.org:8545",
      accounts: { mnemonic: process.env.MNEMONIC },
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
  async (_: any, { ethers }) => {
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
