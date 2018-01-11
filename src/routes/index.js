import React, { Component } from 'react';
import {Redirect, Router, Route, Switch} from 'react-router-dom';
import Discussions from '../components/Discussions/Discussions';
import Contact from '../components/Discussions/Contact';
import DiscussionProfile from '../components/Discussions/DiscussionProfile';
import NewProfile from '../components/Discussions/NewProfile';
import Calendar from '../Profile/Calendar';
import { LoginPage } from '../LoginPage';
import { GetNumber } from '../LoginPage/GetNumber';
import { Home } from '../components/Home';
import { Header } from '../components/Header';
import Auth from '../Auth/Auth.js';
import history from '../history';
import Callback from '../Callback/Callback';
import Profile from '../Profile/Profile';
const auth = new Auth();

const handleAuthentication = ({location}) => {
  if (/access_token|id_token|error/.test(location.hash)) {
    auth.handleAuthentication();
  }
}


require('bootstrap-webpack');

class Routes extends Component {
	render() {
		return (
				<Router history={history}>
					<div>
						<Header />
						<div
						className="container"
                        style={{ 
                        	}}
                      	>
							<Switch>
								<Route exact path="/" render={(props) => <Home auth={auth} {...props} />} />
								<Route exact path="/login" render={(props) => <LoginPage auth={auth} {...props} />} />
								<Route exact path="/getNumber" render={(props) => <GetNumber auth={auth} {...props} />} />
							    <Route exact path="/discussions" render={(props) => <Discussions auth={auth} {...props} />} />
							    <Route path="/discussionProfile" render={(props) => <DiscussionProfile auth={auth} {...props} />} />
							    <Route path="/requestConversation" render={(props) => <Contact auth={auth} {...props} />} />
							    <Route path="/newProfile" render={(props) => <NewProfile auth={auth} {...props} />} />
							    <Route path="/calendar" render={(props) => <Calendar auth={auth} {...props} />} />
							    <Route path="/profile" render={(props) => (
						            !auth.isAuthenticated() ? (
						              <Redirect to="/home"/>
						            ) : (
						              <Profile auth={auth} {...props} />
						            )
						          )} />
							    <Route path="/callback" render={(props) => {
						          handleAuthentication(props);
						          return <Callback {...props} /> 
						        }}/>
						    </Switch>
					    </div>
					</div>
				</Router>
		);
	}
}

export default Routes;