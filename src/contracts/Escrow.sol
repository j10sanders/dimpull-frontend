pragma solidity ^0.4.17;

contract Escrow {
  address public owner;
  uint public fee;
  mapping (address =>  mapping (address => uint)) balances;

  function escrow() public {
    owner = msg.sender;
  }

  modifier onlyOwner() {
    if (msg.sender != owner) throw;
    _;
  }

  //Fee should be set in PPM
  function setFee(uint price) payable external {
    fee = price;
  }

  function start(address payee) external {
    balances[msg.sender][payee] += msg.value;
  }

  //Portion should be percentage of value to pay in PPM
  function end(address payer, address payee, uint portion) onlyOwner external returns(bool) {
    uint value = balances[payer][payee];
    uint payment = value * (portion / 1000000);
    payee.transfer(payment * (1 - (fee / 1000000)));
    payer.transfer(value * (1 - (portion / 1000000)));
    owner.transfer(payment * (fee / 1000000));
    return true;
  }

  function getFee() public view returns (uint) {
    return fee;
  }

}