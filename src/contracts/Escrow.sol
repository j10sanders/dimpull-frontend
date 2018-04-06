pragma solidity ^0.4.13;

contract Escrow {
  address public owner;
  uint public fee;

  //Balances temporarily made public for testing; to be removed
  mapping (address =>  mapping (address => uint)) public balances;

  function escrow() public {
    owner = msg.sender;
  }

  modifier onlyOwner() {
    require(msg.sender == owner);
    _;
  }

  //Fee should be set in PPM
  function setFee(uint price) onlyOwner external {
    fee = price;
  }

  function start(address payee) payable external {
    balances[msg.sender][payee] = balances[msg.sender][payee] + msg.value;
  }

  //Portion should be percentage of value to pay in PPM
  function end(address payer, address payee, uint portion) onlyOwner external returns(bool) {
    uint value = balances[payer][payee];

    uint invoice = value / (1000000 / portion);
    uint paidFee = invoice / (1000000 / fee);
    uint payment = invoice - paidFee;
    uint returned = value - invoice;

    payee.transfer(payment);
    payer.transfer(returned);
    owner.transfer(paidFee);

    return true;
  }
}