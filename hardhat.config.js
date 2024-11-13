require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

module.exports = {
  solidity: "0.8.27",
  networks: {
    sepolia: {
      url: "https://sepolia.infura.io/v3/be8d335d6a7f47df9d23572a28233647", 
      accounts: ['b9433accc50d9f7fd37f0c43540555b86f9f8b3cea1dcff836933c64874a1d1c'] 
  }
  }
};