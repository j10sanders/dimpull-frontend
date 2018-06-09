import React, { Component } from 'react';
import { List, ListItem } from 'material-ui/List';
import Subheader from 'material-ui/Subheader';
// import MobileTearSheet from '../../../MobileTearSheet';

const style = { lineHeight: '24px' };
const subStyle = { fontWeight: 600, fontSize:'17px' };




const customerFAQs = [
  [`What is Dimpull?`,
    `Dimpull is a platform for people to connect with blockchain experts through paid 1-on-1 phone calls.`],
  [`Why should I use Dimpull?`,
    `Dimpull connects you with the best experts in the blockchain ecosystem to get 1-on-1 advice.  Questions about where the BTC, BCH, ETH, or LTC market is headed?  Wondering what a 'cup and handle' is, or other TA patterns?  Need advice on a major BTC, BCH, ETH, or LTC trade?  Need help building a decentralized application?  Ask a Dimpull expert.`],
  [`How do I pay for calls?`,
    `Calls on Dimpull are paid for with Ether using the MetaMask browser extension.  See the blockchain section if you want to learn how to install MetaMask and purchase Ether.`],
  [`Why does Dimpull escrow funds?`,
    `Dimpull uses an escrow smart contract to hold funds during a call.  As a caller you pay into this escrow contract before a call.  Once a call is completed, funds are sent from the escrow contract to the expert.  Using an escrow contract on the blockchain allows payments to go from callers to experts without either user needing to trust Dimpull to hold those funds.  In other words, there is no way for Dimpull to take funds from callers or experts.`],
  [`How much does it cost to use Dimpull?`,
    `Dimpull takes 18% of payments to experts in order to run the website and ensure that conversations on the platform meet current legal guidelines.`],

];

const expertFAQs = [
  [`Why should I use Dimpull?`,
    `Dimpull provides an easy way to connect with people who want your advice and to get paid for giving advice.  Payments are automatic following a call's completion, so you get your hard earned ETH immediately :)`],
  [`How do I get paid for calls?`,
    `On Dimpull, users pay in ETH for your time on the phone.  When you sign up for Dimpull, we ask for your Ethereum address.  After a call finishes, ETH payment will automatically get sent to your Ethereum address from our escrow smart contract.  It's that simple!`],
  [`What if the caller doesn't want to pay?`,
    `Callers pay into our escrow contract prior to the start of a call.  As an expert, you are guaranteed payment for calls that take place.`],
  [`What if a call does not last the full 30 minutes?`,
    `If both parties agree to end a call early, callers still pay for the entirety of the 30 minutes.`],
  [`How does Dimpull make money?`,
    `Callers pay Dimpull 18% of an expert's rate during each call.  This fee is paid directly to Dimpull through the smart contract.  Experts are paid the full rate that they set on their profile.`],
];

const blockchainFAQs = [
  [`What is Ethereum?`,
    `Ethereum is a programmable blockchain that allows developers to decentralize part or all of the applications they build.  The native asset of Ethereum is Ether (aka ETH).`],
  [`What is MetaMask?`,
    `MetaMask is a digital wallet that holds your ETH.  ETH is a cryptoasset that is used to pay for calls on Dimpull.`],
  [`How do I install MetaMask?`,
    `See here: https://youtu.be/tfETpi-9ORs`],
  [`How can I get Ether (ETH)?`,
    `If you are a US citizen, you can purchase Ether through MetaMask (with Coinbase).  Just click the "Buy" button in MetaMask.  If you are not a US citizen, you will need to purchase Ether through an exchange and transfer it to your MetaMask wallet.`],
  [`Why is Dimpull using the blockchain?`,
    `Blockchains provide trust.  Using an escrow contract on the blockchain allows payments to go from callers to experts without either user needing to trust Dimpull to hold those funds.  In other words, there is no way for Dimpull to take funds from callers or experts.  You don't need to trust us; trust the blockchain.`],

];

class FAQ extends Component {
  constructor (props) {
    super(props);
    this.state = {
    };
  }

  render () {
    const customerfaqRender = customerFAQs.map(x => (
      <ListItem
        key={x[0]}
        primaryText={x[0]}
        initiallyOpen={false}
        primaryTogglesNestedList={true}
        nestedItems={[
          <ListItem
            key={x[1]}
            primaryText={x[1]}
            disabled={true}
            style={style}
          />
        ]}
      />
    ));
    const expertfaqRender = expertFAQs.map(x => (
      <ListItem
        key={x[0]}
        primaryText={x[0]}
        initiallyOpen={false}
        primaryTogglesNestedList={true}
        nestedItems={[
          <ListItem
            key={x[1]}
            primaryText={x[1]}
            disabled={true}
            style={style}
          />
        ]}
      />
    ));
    const blockchainfaqRender = blockchainFAQs.map(x => (
      <ListItem
        key={x[0]}
        primaryText={x[0]}
        initiallyOpen={false}
        primaryTogglesNestedList={true}
        nestedItems={[
          <ListItem
            key={x[1]}
            primaryText={x[1]}
            disabled={true}
            style={style}
          />
        ]}
      />
    ));
    return (
      <div className="container-fluid" style={{ paddingTop: '20px' }}>
        <div style={{ paddingBottom: '42px' }}>
          <img src="https://res.cloudinary.com/dtvc9q04c/image/upload/c_scale,h_276/v1524751458/DimpullFAQ.png" alt="faqdimp" className="img-responsive center-block" />
        </div>
        <div className="row">
          <div className="col-md-4 col-md-offset-0">
            <List>
              <Subheader style={subStyle}>For Curious Users</Subheader>
              {customerfaqRender}
            </List>
          </div>
          <div className="col-md-4 col-md-offset-0">
            <List>
              <Subheader style={subStyle}>For Experts</Subheader>
              {expertfaqRender}
            </List>
          </div>
          <div className="col-md-4 col-md-offset-0">
            <List>
              <Subheader style={subStyle}>Blockchain</Subheader>
              {blockchainfaqRender}
            </List>
          </div>
        </div>
      </div>
    );
  }
}

export default FAQ;
