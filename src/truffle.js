module.exports = {
  // See <http://truffleframework.com/docs/advanced/configuration>
  // to customize your Truffle configuration!

  networks: {
    development: {
      host: "localhost",
      port: 8545,
      network_id: "*",
      gas: 30000000 // Match any network id
    }
  },
  solc: { optimizer: { enabled: true, runs: 200 } }
};
