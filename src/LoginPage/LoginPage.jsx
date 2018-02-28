import React from 'react';
// import { Link } from 'react-router-dom';
// import RaisedButton from 'material-ui/RaisedButton';


class LoginPage extends React.Component {
  login() {
    this.props.auth.login();
  }logout() {
    this.props.auth.logout();
  }

  componentDidMount(){
    const { isAuthenticated } = this.props.auth;
    if(!isAuthenticated() && process.env.REACT_APP_USERS_SERVICE_URL){
      this.login();
    }else{
      if (!process.env.REACT_APP_USERS_SERVICE_URL){
        console.log('REACT_APP_USERS_SERVICE_URL env variable not set')
      }
    }
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
        
      </div>
    );
  }
}
export { LoginPage }; 