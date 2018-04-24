import React from 'react';
// import axios from 'axios';
import RaisedButton from 'material-ui/RaisedButton';
import getWeb3 from '../../utils/getWeb3';
import EscrowContract from '../../build/contracts/Escrow.json';

class Pay extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      Fee: 0,
      web3: null
    };
  }

  componentWillMount () {
    debugger;
    // Get network provider and web3 instance.
    // See utils/getWeb3 for more info.
    getWeb3
      .then((results) => {
        this.setState({
          web3: results.web3,
          Fee: 0
        });
        // Instantiate contract once web3 provided.
        this.instantiateContract();
      })
      .catch(() => {
        console.log('Error finding web3.');
      });
  }

  async submit () {
    const escrowinstance = await this.state.escrow.deployed();
    const account = await this.state.web3.eth.accounts;
    const payeeAddress = '0x1C34D277B51ec49536FE7843E289933e0f8020ED';
    const result = await escrowinstance.start(payeeAddress, { from: account[0], value: 2000000000000000000 });
    console.log(result);
    debugger;
  }

  instantiateContract () {
    /*
     * SMART CONTRACT EXAMPLE
     *
     * Normally these functions would be called in the context of a
     * state management library, but for convenience I've placed them here.
     */
    const contract = require('truffle-contract');
    const escrow = contract(EscrowContract);
    escrow.setProvider(this.state.web3.currentProvider);
    this.setState({ escrow });
  }

  render () {
    console.log(this.state, 'state');
    return (
      <div className="col-md-6 col-md-offset-3">
        <RaisedButton
          disabled={this.state.disabled}
          style={{ marginTop: 50 }}
          label={this.state.Fee}
          onClick={() => this.submit()}
        />
      </div>
    );
  }
}

export default Pay;
