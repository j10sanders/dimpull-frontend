// import { Route, Redirect } from 'react-router'
import auth0 from 'auth0-js';
import history from '../history';
import axios from 'axios';

export default class Auth {
  auth0 = new auth0.WebAuth({
    domain: 'jonsanders.auth0.com',
    clientID: 'QBLBoATBNMLbdIIn4GOBQLsxcuXZR1EW',
    redirectUri: 'http://localhost:3000/callback',
    responseType: 'token id_token',
    scope: 'openid email profile',
    audience: 'https://jonsanders.auth0.com/api/v2/',
  });

  login() {
    this.auth0.authorize();
  }

  constructor() {
    this.login = this.login.bind(this);
    this.logout = this.logout.bind(this);
    this.handleAuthentication = this.handleAuthentication.bind(this);
    this.isAuthenticated = this.isAuthenticated.bind(this);
    this.getProfile = this.getProfile.bind(this);
    this.getAccessToken = this.getAccessToken.bind(this);
  }

  getAccessToken() {
    const accessToken = localStorage.getItem('access_token');
    if (!accessToken) {
      throw new Error('No access token found');
    }
    return accessToken;
  }

  handleAuthentication() {
    this.auth0.parseHash((err, authResult) => {

      if (authResult && authResult.accessToken && authResult.idToken) {
        this.setSession(authResult);
        let headers = {}
        if ( this.isAuthenticated()) {
          headers = { 'Authorization': `Bearer ${this.getAccessToken()}`}
        }
        console.log("Headers", headers)
        axios.get(`${process.env.REACT_APP_USERS_SERVICE_URL}/api/register`, {
          headers
          // user_id: authResult.idTokenPayload.sub,
        })
       .then((response) => {
          console.log(response)
          if (response.data === "register phone"){
            history.replace('/getNumber');
          }
          else{
            console.log(response, "response")
            history.replace('/discussions');
          }
        })
        .catch(function (error) {
          console.log(error)
      })
      } else if (err) {
        history.replace('/');
        console.log(err);
      }
    });
  }

  setSession(authResult) {
    // Set the time that the access token will expire at
    let expiresAt = JSON.stringify((authResult.expiresIn * 1000) + new Date().getTime());
    localStorage.setItem('access_token', authResult.accessToken);
    localStorage.setItem('id_token', authResult.idToken);
    localStorage.setItem('expires_at', expiresAt);
    // navigate to the home route
    history.replace('/');
  }

  getProfile(cb) {
    let accessToken = this.getAccessToken();
    this.auth0.client.userInfo(accessToken, (err, profile) => {
      if (profile) {
        this.userProfile = profile;
      }
      cb(err, profile);
    });
  }

  logout() {
    // Clear access token and ID token from local storage
    localStorage.removeItem('access_token');
    localStorage.removeItem('id_token');
    localStorage.removeItem('expires_at');
    // navigate to the home route
    history.replace('/');
  }

  isAuthenticated() {
    // Check whether the current time is past the 
    // access token's expiry time
    let expiresAt = JSON.parse(localStorage.getItem('expires_at'));
    return new Date().getTime() < expiresAt;
  }
}