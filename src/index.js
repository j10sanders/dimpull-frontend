import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
// import registerServiceWorker from './registerServiceWorker';
import Auth from './Auth/Auth';

const auth = new Auth();
auth.renewToken();
ReactDOM.render(<App />, document.getElementById('root'));
// registerServiceWorker();
