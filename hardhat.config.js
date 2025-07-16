require("@nomicfoundation/hardhat-toolbox");
require("@nomicfoundation/hardhat-verify");
require("@chainlink/env-enc").config();
require("./tasks/depoly-fundme.js");
require("./tasks/interact-fundme.js");

const SEPOLIA_URL = process.env.SEPOLIA_URL; // sepolia 网络地址
const PRIVATE_KEY = process.env.PRIVATE_KEY; // 账户私钥1
const PRIVATE_KEY_1 = process.env.PRIVATE_KEY_1;
const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY; // 来自于https://etherscan.io/apidashboard


/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.28",
  networks:{
    sepolia: {
      url:SEPOLIA_URL,
      accounts:[PRIVATE_KEY,PRIVATE_KEY_1],
      chainId:11155111
    }
  },
  etherscan: {
    // Your API key for Etherscan
    // Obtain one at https://etherscan.io/
    apiKey: ETHERSCAN_API_KEY,
    timeout: 30000 // 验证超时增加到30秒
  },
  sourcify: {
    enabled: true
}
};
