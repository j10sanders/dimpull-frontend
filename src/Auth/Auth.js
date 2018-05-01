// import { Route, Redirect } from 'react-router'
import auth0 from 'auth0-js';
import history from '../history';
// import axios from 'axios';

// const paths = ["/newProfile"]

export default class Auth {
  auth0 = new auth0.WebAuth({
    domain: `${process.env.REACT_APP_AUTH0_DOMAIN}`,
    clientID: `${process.env.REACT_APP_AUTH0_clientID}`,
    redirectUri: `${process.env.REACT_APP_AUTH0_REDIRECT}`,
    responseType: 'token id_token',
    scope: 'openid email profile user_metadata app_metadata',
    audience: `${process.env.REACT_APP_AUTH0_AUDIENCE}`,
  });

  async login(redirectUrl) {
    let url = redirectUrl ? redirectUrl : ''
    this.auth0.authorize({
      state:url
    });
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
    }});
  }

  setSession(authResult) {
    // Set the time that the access token will expire at
    let expiresAt = JSON.stringify((authResult.expiresIn * 1000) + new Date().getTime());
    localStorage.setItem('access_token', authResult.accessToken);
    localStorage.setItem('id_token', authResult.idToken);
    localStorage.setItem('expires_at', expiresAt);
    if (authResult.state.substring(0,11) === '/newProfile' || authResult.state.substring(0,12) === '/editProfile'){
      history.replace(authResult.state)
    } else{
      history.replace('/');
    }
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

  userHasScopes(scopes) {
  const grantedScopes = JSON.parse(localStorage.getItem('scopes')).split(' ');
  return scopes.every(scope => grantedScopes.includes(scope));
}
}