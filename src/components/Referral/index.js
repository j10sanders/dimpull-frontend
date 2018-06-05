import React from 'react';
import CircularProgress from 'material-ui/CircularProgress';

class Ref extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      waiting: true
    };
  }

  componentWillMount () {
    const { isAuthenticated } = this.props.auth;
    if (!isAuthenticated()) {
      this.props.auth.login(`/newProfile/${this.props.location.pathname}`);
    }
    this.setState({ waiting: false });
  }

  render () {
    if (this.state.waiting) {
      return (<CircularProgress />);
    }
    return (
      <div>
        You have already registered, so this referral link is invalid.
      </div>
    );
  }
}

export default Ref;
