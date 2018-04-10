const Escrow = artifacts.require("Escrow");

contract('Escrow test', async (accounts) => {

  it("should start contract", async () => {
    let instance = await Escrow.deployed();
    let addr = await instance.escrow.call({ from: accounts[0] })
    assert.equal(addr, accounts[0]);
  })

  it("should link 200000 to last account", async () => {
  	const instance = await Escrow.deployed();
    const addr = await instance.escrow.call({ from: accounts[0] });
    const send = await instance.start.call(accounts[9], { from: accounts[1], value: 200000 });
    assert.equal(send, 200000);
	});

  it("should transfer to account", async () => {
  	const instance = await Escrow.deployed();
    // const addr = await instance.escrow.call({ from: accounts[0] });
    // const send = await instance.start.call(accounts[9], { from: accounts[3], value: 200000 });
    const s = await instance.s.call({gas: '3000000'});
    // const val = s.toNumber();
    assert.equal(s, true);
	});

 //  it("should transfer 200000 to last account", async () => {
 //  	let instance = await Escrow.deployed();
 //    let addr = await instance.escrow.call({ from: accounts[1] });
 //    let sen = await instance.start.call(accounts[9], { from: accounts[2], value: 200000 });
 //    assert.equal(sen, 200000);
	// });
  // it("should call a function that depends on a linked library", async () => {
  //   let esc = await Escrow.deployed();
  //   let outCoinBalance = await esc.getBalance.call(accounts[0]);
  //   let escCoinBalance = outCoinBalance.toNumber();
  //   let outCoinBalanceEth = await esc.getBalanceInEth.call(accounts[0]);
  //   let escCoinEthBalance = outCoinBalanceEth.toNumber();
  //   assert.equal(escCoinEthBalance, 2 * escCoinBalance);

  // });

  // it("should send coin correctly", async () => {

  //   // Get initial balances of first and second account.
  //   let account_one = accounts[0];
  //   let account_two = accounts[1];

  //   let amount = 10;


  //   let instance = await Escrow.deployed();
  //   let esc = instance;

  //   let balance = await esc.getBalance.call(account_one);
  //   let account_one_starting_balance = balance.toNumber();

  //   balance = await esc.getBalance.call(account_two);
  //   let account_two_starting_balance = balance.toNumber();
  //   await esc.sendCoin(account_two, amount, {from: account_one});

  //   balance = await esc.getBalance.call(account_one);
  //   let account_one_ending_balance = balance.toNumber();

  //   balance = await esc.getBalance.call(account_two);
  //   let account_two_ending_balance = balance.toNumber();

  //   assert.equal(account_one_ending_balance, account_one_starting_balance - amount, "Amount wasn't correctly taken from the sender");
  //   assert.equal(account_two_ending_balance, account_two_starting_balance + amount, "Amount wasn't correctly sent to the receiver");
  // });

})