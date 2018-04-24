const Escrow = artifacts.require("Escrow");

contract('Escrow test', async (accounts) => {
  // it("should link 200000 to last account", async () => {
  //   const instance = await Escrow.deployed();
  //   // const addr = await instance.Escrow.call({ from: accounts[0] });
  //   const send = await instance.start.call(accounts[9], { from: accounts[1], value: 200000 });
  //   assert.equal(send, 200000);
  // });

  it("should transfer to account", async () => {
    const getBal = web3.eth.getBalance
    const instance = await Escrow.deployed({ from: accounts[0] });
    const esc = instance;
    await esc.setFee(18000, { from: accounts[0] });
    await esc.start(accounts[2], { from: accounts[1], value: 2000000000000000 });
    const balance = await esc.balances.call(accounts[1], accounts[2]);
    const balNum = balance.toString(10);
    await esc.end(accounts[2], accounts[1], { from: accounts[0] });
    const bal = await getBal(accounts[2]).toNumber();
    assert.equal(balNum, 2000000000000000);
    assert.equal(bal, 100001963636363640000);
  });
})

// Escrow.deployed().then(function(instance){return instance.setFee(18000, {from: web3.eth.accounts[0]})})
// .then(function(instance){return instance.start.call(web3.eth.accounts[2], { from: web3.eth.accounts[1], value: 2000000000000000 })}).then(function(instance){return instance.balances.call(web3.eth.accounts[2], web3.eth.accounts[1])})

// Escrow.deployed().then(function(instance){return instance.setFee(18000, {from: web3.eth.accounts[0]})})

// Escrow.deployed().then(function(instance){esc = instance})
// getBal = web3.eth.getBalance
// const accounts = web3.eth.accounts
// for (let i of accounts){console.log(getBal(i).toNumber())}
// esc.setFee(18000, {from: accounts[0]})
// esc.start(accounts[2], { from: accounts[1], value: 2000000000000000 }); //DON"T .CALL!!!
// esc.balances.call(accounts[1], accounts[2]).then(function(bal){return console.log(bal.toNumber())})

// Escrow.deployed().then(function(instance){esc = instance})
// esc.setFee(18000, {from: accounts[0]})
// esc.start.call(web3.eth.accounts[2], { from: web3.eth.accounts[1], value: 2000000000000000 })
// esc.balances.call(accounts[1], accounts[2]).then(function(bal){return bal.toNumber()})

// for (let i of this.accounts){console.log(web3.eth.getBalance(i).toNumber())}