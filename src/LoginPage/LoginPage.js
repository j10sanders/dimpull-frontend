import React from 'react';
// import { Link } from 'react-router-dom';
import RaisedButton from 'material-ui/RaisedButton';

class LoginPage extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      first_name: ''
    };
  }

  login () {
    this.props.auth.login();
  }logout () {
    this.props.auth.logout();
  }

  componentDidMount () {
    const { isAuthenticated } = this.props.auth;
    if(!isAuthenticated() && process.env.REACT_APP_USERS_SERVICE_URL){
      this.login();
    }else{
      if (!process.env.REACT_APP_USERS_SERVICE_URL){
        console.log('REACT_APP_USERS_SERVICE_URL env variable not set')
      }
      this.getNames();
    }
  }


  getNames (name) {
    if (name) {
      this.setState({hasName: true, 
              first_name: name.split(' ').slice(0, -1).join(' '),
              last_name: name.split(' ').slice(-1).join(' ')
              });
      return;
    }
    let fullUrl = `https://jonsanders:auth0:com/user_metadata`
    this.setState({ profile: {} });
    const { userProfile, getProfile } = this.props.auth;
    if (!userProfile) {
      getProfile((err, profile) => {
        this.setState({ profile });
        if (profile.given_name) {
          this.setState({hasName: true, 
            first_name: profile.given_name,
            last_name: profile.family_name,
          })
        } else if (profile[fullUrl]){
          if (profile[fullUrl].given_name) {
            this.setState({hasName: true, 
              first_name: profile[fullUrl].given_name,
              last_name: profile[fullUrl].family_name,
            })
          } 
        } else if (profile.name) {
            this.setState({hasName: true, 
              first_name: profile.name.split(' ').slice(0, -1).join(' '),
              last_name: profile.name.split(' ').slice(-1).join(' ')
            })
          }
      });
    } else {
        this.setState({ profile: userProfile });
        if (userProfile.given_name) {
          this.setState({hasName: true, 
            first_name: userProfile.given_name,
            last_name: userProfile.family_name,
          })
        } else if (userProfile[fullUrl]){
          if (userProfile[fullUrl].given_name){
            this.setState({hasName: true, 
              first_name: userProfile[fullUrl].given_name,
              last_name: userProfile[fullUrl].family_name,
            })
          } 
        } else if (userProfile.name) {
            this.setState({hasName: true, 
              first_name: userProfile.name.split(' ').slice(0, -1).join(' '),
              last_name: userProfile.name.split(' ').slice(-1).join(' ')
            })
          }
        else{
          this.setState({hasName: true, first_name: '',last_name: ''})
        }
    }
  }


  render () {
    const { isAuthenticated } = this.props.auth;
    return (
      <div className="container">
        {
          isAuthenticated() && (
            <div>
              <div style={{ textAlign: 'center', marginTop: '20px' }}>
                {this.state.first_name.length > 0 && (
                  <h4>
                    {this.state.first_name}, you are logged in.
                  </h4>
                )}
                <RaisedButton
                  primary
                  style={{ marginTop: 10 }}
                  label="Log Out?"
                  onClick={this.logout.bind(this)}
                />
              </div>
            </div>
          )
        }
      </div>
    );
  }
}

export default LoginPage;
