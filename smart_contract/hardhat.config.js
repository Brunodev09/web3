const { resolve } = require('path');
const { config } = require("dotenv");
config({ path: resolve(__dirname, ".env") });

require('@nomicfoundation/hardhat-toolbox');

module.exports = {
  solidity: '0.8.0',
  networks: {
    sepolia: {
      url: process.env.ALCHEMY_API,
      accounts: [process.env.PRIVATE_KEY]
    }
  }

}