import React, { Component } from 'react';
import { List, ListItem } from 'material-ui/List';
import Subheader from 'material-ui/Subheader';
// import MobileTearSheet from '../../../MobileTearSheet';

const customerFAQs = [
  [`What is Dimpull?`,
    `Dimpull is a marketplace for experienced crypto traders and experts to provide their time and knowledge to new crypto ethusiats through phone calls.`],
  [`Why should I use Dimpull?`,
    `Dimpull connects you with the best experts in the blockchain ecosystem to get firsthand 1-on-1 advice.  Questions about where the market is headed?  Wondering what a 'cup and handle' is, or other TA patterns?  Need advice on a major BTC, BCH, ETH, or LTC purchase?  Ask a Dimpull expert.`],
  [`How do I pay for calls?`,
    `Calls on Dimpull are paid for with Ether using the MetaMask browser extension.  See below if you want to learn how to purchase Ether.`],
  [`What is this escrow business?`,
    `Dimpull uses an escrow smart contract to hold funds during the call.  As a caller you pay into this escrow contract before a call.  Once a call is completed, funds are sent from the escrow contract to the expert.  Using an escrow contract on the blockchain allows payments to go from callers to experts without either user needing to trust Dimpull to hold those funds.  In other words, there is no way for Dimpull to take funds from callers or experts.`],
  [`How much does it cost to use Dimpull?`,
    `Dimpull takes 18% of payments to experts to run the website and ensure that conversations on the platform meet current legal guidelines.`],
];

const expertFAQs = [
  [`Why should I use Dimpull?`,
    `Dimpull provides you an easy way for you to connect with people who want your advice and get paid for your time.  Payments are automatic following a call's completion, so you get your hard earned ETH immediately.`],
  [`How do I get paid for calls?`,
    `On Dimpull, users pay in ETH for your time on the phone.  When you sign up for Dimpull, we ask for the Ethereum address that you want these payments to get sent to.  After a call finishes, ETH payment will automatically get sent to your Ethereum address from our escrow smart contract.  It's that simple!`],
  [`What if the caller doesn't want to pay?`,
    `Callers pay into our escrow contract prior to the start of a call.  As an expert, you are guarenteed payment for calls that take place.`],
  [`What if a call does not last the full 30 minutes?`,
    `If both parties agree to end a call early, callers still pay for the entirety of the 30 minutes.`],
  [`How does Dimpull make money?`,
    `Callers pay Dimpull 18% of an expert's rate during each call.  This fee is paid directly to Dimpull through the smart contract.  Experts are paid the full rate that they set on their profile.`],
  [``,
    ``],
  [``,
    ``],
  [``,
    ``],
  [``,
    ``],
  [``,
    ``],
  [``,
    ``],
  [``,
    ``],
  [``,
    ``],
  [``,
    ``]
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
          />
        ]}
      />
    ));
    return (
      <div className="container">
        <div className="row">
          <div className="col-md-6 col-md-offset-0">
            <List>
              <Subheader>For Curious Users</Subheader>
              {customerfaqRender}
            </List>
          </div>
          <div className="col-md-6 col-md-offset-0">
            <List>
              <Subheader>For Experts</Subheader>
              {expertfaqRender}
            </List>
          </div>
        </div>
      </div>
    );
  }
}

export default FAQ;
