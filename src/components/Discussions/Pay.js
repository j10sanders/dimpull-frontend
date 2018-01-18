import React from 'react';
import RaisedButton from 'material-ui/RaisedButton';
import getWeb3 from '../../utils/getWeb3';
import EscrowContract from '../../build/contracts/Escrow.json'


class Pay extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      Fee: 0,
      web3: null
    };
  }

  submit() {
  }

  componentWillMount() {
    // Get network provider and web3 instance.
    // See utils/getWeb3 for more info.

    getWeb3
    .then(results => {
      this.setState({
        web3: results.web3,
        Fee: 0
      })
      // debugger;
      // Instantiate contract once web3 provided.
      this.instantiateContract()
    })
    .catch(() => {
      console.log('Error finding web3.')
    })
  }

  instantiateContract() {
    /*
     * SMART CONTRACT EXAMPLE
     *
     * Normally these functions would be called in the context of a
     * state management library, but for convenience I've placed them here.
     */

    const contract = require('truffle-contract')
    const escrow = contract(EscrowContract)
    escrow.setProvider(this.state.web3.currentProvider)

    // Declaring this for later so we can chain functions on SimpleStorage.
    var escrowInstance

    // Get accounts.
    this.state.web3.eth.getAccounts((error, accounts) => {
      escrow.deployed().then((instance) => {
        escrowInstance = instance

        // Stores a given value, 5 by default.
        return escrowInstance.setFee(60, {from: accounts[0]})
      }).then((result) => {
        // Get the value from the contract to prove it worked.
        return escrowInstance.getFee.call()
      }).then((result) => {
        // Update state with the result.
        return this.setState({ Fee: result.c[0] })
      })
    })
  }

  render() {
    console.log(this.state, "state")
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