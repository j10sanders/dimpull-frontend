import React from 'react';
import ReactDOM from 'react-dom';
import Auth from './Auth/Auth';
import App from './App';
// import registerServiceWorker from './registerServiceWorker';
import './index.css';

const auth = new Auth();
const start = async () => {
  await auth.renewToken();
  ReactDOM.render(<App auth={auth} />, document.getElementById('root'));
};

start();
// registerServiceWorker();
