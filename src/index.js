import React from 'react';
import ReactDOM from 'react-dom';

import App from './App';
// import registerServiceWorker from './registerServiceWorker';
import Auth from './Auth/Auth';

require('./index.css') ;
const auth = new Auth();
async function start () {
  await auth.renewToken();
  ReactDOM.render(<App />, document.getElementById('root'));
}

start();
// registerServiceWorker();
