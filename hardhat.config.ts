import {SEPOLIA_RPC_URL, PRIVATE_KEY, ETHERSCAN_API_KEY} from "./constants";
import "dotenv/config";
import "@nomicfoundation/hardhat-verify"

const config = {
  solidity: "0.8.24",
  defaultNetwork: "hardhat",
  networks: {
    sepolia: {
      url: SEPOLIA_RPC_URL,
      accounts: [PRIVATE_KEY],
      chainId: 11155111
    }
  },
  etherscan: {
    apiKey: ETHERSCAN_API_KEY
  },
};

export default config;