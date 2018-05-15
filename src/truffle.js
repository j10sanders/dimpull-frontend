const HDWalletProvider = require("truffle-hdwallet-provider");

const mnemonic ="lens ladder destroy burden scout payment trade alley sorry arrange top earn";

module.exports = {
  // See <http://truffleframework.com/docs/advanced/configuration>
  // to customize your Truffle configuration!

  networks: {
    development: {
      host: "localhost",
      port: 9545,
      network_id: "*",
      gas: 30000000 // Match any network id
    },
    ropsten: {
      provider: function() {
        return new HDWalletProvider(mnemonic, "https://ropsten.infura.io/SzMj9kYHCc61XSf9IFDh")
      },
      network_id: 3,
      gas: 4612388
    },
    rinkeby: {
      provider: function() {
        return new HDWalletProvider(mnemonic, "https://rinkeby.infura.io/I5csQZeeCq5xFJFx11J4 ")
      },
      network_id: 4,
      gas: 4612388
    }

  },
  solc: { optimizer: { enabled: true, runs: 200 } }
};
