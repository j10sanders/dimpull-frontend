import React from 'react';
// import { Link } from 'react-router-dom';


class LoginPage extends React.Component {
  login() {
    this.props.auth.login();
  }logout() {
    this.props.auth.logout();
  }
  render() {
    const { isAuthenticated } = this.props.auth;
    return (
      <div className="container">
        {
          isAuthenticated() && (
              <h4>
                You are logged in!
                <a
                  style={{ cursor: 'pointer' }}
                  onClick={this.logout.bind(this)}
                >
                  Log Out
                </a>
              </h4>
            )
        }
        {
          !isAuthenticated() && (
              <h4>
                {process.env.REACT_APP_USERS_SERVICE_URL}
                <a
                  style={{ cursor: 'pointer' }}
                  onClick={this.login.bind(this)}
                >
                  Log In
                </a>
                {' '}to continue.
              </h4>
            )
        }
      </div>
    );
  }
}
export { LoginPage }; 