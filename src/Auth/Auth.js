// import { Route, Redirect } from 'react-router'
import auth0 from 'auth0-js';
import history from '../history';

export default class Auth {
  userProfile;
  tokenRenewalTimeout;

  auth0 = new auth0.WebAuth({
    domain: `${process.env.REACT_APP_AUTH0_DOMAIN}`,
    clientID: `${process.env.REACT_APP_AUTH0_clientID}`,
    redirectUri: `${process.env.REACT_APP_AUTH0_REDIRECT}`,
    responseType: 'token id_token',
    scope: 'openid email profile user_metadata app_metadata',
    audience: `${process.env.REACT_APP_AUTH0_AUDIENCE}`,
  });

  constructor() {
    this.login = this.login.bind(this);
    this.logout = this.logout.bind(this);
    this.handleAuthentication = this.handleAuthentication.bind(this);
    this.isAuthenticated = this.isAuthenticated.bind(this);
    this.getProfile = this.getProfile.bind(this);
    this.getAccessToken = this.getAccessToken.bind(this);
    this.renewToken = this.renewToken.bind(this);
    this.scheduleRenewal();
  }

  login(redirectUrl) {
    let url = redirectUrl ? redirectUrl : ''
    this.auth0.authorize({
      state:url
    });
    localStorage.setItem('logged_out', false);
  }

  handleAuthentication() {
    this.auth0.parseHash((err, authResult) => {
      if (authResult && authResult.accessToken && authResult.idToken) {
        this.setSession(authResult);
    } else if (err) {
      if (err.message === 'nothing to see here') {
        console.log(err)
        return;
      }
      history.replace('/home');
    }
    });
  }

  setSession(authResult) {
    // Set the time that the access token will expire at
    let expiresAt = JSON.stringify((authResult.expiresIn * 1000) + new Date().getTime());
    localStorage.setItem('access_token', authResult.accessToken);
    localStorage.setItem('id_token', authResult.idToken);
    localStorage.setItem('expires_at', expiresAt);
    localStorage.setItem('logged_out', false);
    this.scheduleRenewal();
    try {
      const a = authResult.state;
      if (a.substring(0,11) === '/newProfile' || a.substring(0,12) === '/editProfile' || a.substring(0,5) === '/home' || a.substring(0,9) === '/calendar' || a.substring(0,8) === '/profile'){
        history.replace(a)
      } else if (a.a.location.pathname) {
        return;
      } else {
        history.replace('/');
      }
    } catch (e) {
      if (e instanceof ReferenceError){
        throw new Error('nothing to see here');
      }
    }
  }
  

  getAccessToken() {
    const accessToken = localStorage.getItem('access_token');
    if (!accessToken) {
      throw new Error('No access token found');
    }
    return accessToken;
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
    localStorage.removeItem('scopes');
    localStorage.setItem('logged_out', true);
    this.userProfile = null;
    clearTimeout(this.tokenRenewalTimeout);
    // navigate to the home route
    history.replace('/');
  }

  isAuthenticated() {
    // Check whether the current time is past the 
    // access token's expiry time
    let expiresAt = localStorage.getItem('expires_at') ? JSON.parse(localStorage.getItem('expires_at')) : new Date();
    return new Date().getTime() < expiresAt;
  }

  renewToken() {
    const logged_out = localStorage.getItem('logged_out');
    if (logged_out === 'true') {
      return;
    }
    this.auth0.checkSession({}, (err, result) => {
        if (err) {
          console.log(err);
        } else {
          this.setSession(result);
        }
      }
    );
  }

  scheduleRenewal() {
    const expiresAt = localStorage.getItem('expires_at') ? JSON.parse(localStorage.getItem('expires_at')) : new Date();
    const delay = expiresAt - Date.now();
    // const delay = 10
    if (delay > 0) {
      this.tokenRenewalTimeout = setTimeout(() => {
        this.renewToken();
      }, delay);
    }
  }
}