import React, { Component } from 'react';
import {Redirect, Router, Route, Switch} from 'react-router-dom';
import asyncComponent from "../components/AsyncComponent";
import Auth from '../Auth/Auth.js';
import history from '../history';
import Callback from '../Callback/Callback';
const auth = new Auth();
const AsyncHome = asyncComponent(() => import("../components/Home"));
const AsyncNewProfile = asyncComponent(() => import("../components/Discussions/NewProfile"));
const AsyncEditProfile = asyncComponent(() => import("../components/Discussions/EditProfile"));
const AsyncAvailability = asyncComponent(() => import("../components/Discussions/Availability"));
const AsyncCalendar = asyncComponent(() => import("../Profile/Calendar"));
const AsyncPay = asyncComponent(() => import("../components/Discussions/Pay"));
const AsyncDiscussionProfile = asyncComponent(() => import("../components/Discussions/DiscussionProfile"));
const AsyncContact = asyncComponent(() => import("../components/Discussions/Contact"));
const AsyncMyDiscussions = asyncComponent(() => import("../components/Discussions/MyDiscussions"));
const AsyncDiscussions = asyncComponent(() => import("../components/Discussions/Discussions"));
const AsyncLoginPage = asyncComponent(() => import("../LoginPage/LoginPage"));
const AsyncGetNumber = asyncComponent(() => import("../LoginPage/GetNumber"));
const AsyncHeader = asyncComponent(() => import("../components/Header"));
const AsyncProfile = asyncComponent(() => import("../Profile/Profile"));

const handleAuthentication = ({location}) => {
  if (/access_token|id_token|error/.test(location.hash)) {
    auth.handleAuthentication();
  }
}

class Routes extends Component {
	render() {
		return (
			<Router history={history}>
				<div>
					<AsyncHeader auth={auth} />
					<div
						className="container"
            style={{ 
              paddingBottom: '65px',
              marginTop: '64px',
              // height: '100%',
              // minHeight: '88vh'
            }}
        	>
						<Switch>
						<Route exact path="/" render={(props) => <AsyncHome auth={auth} {...props} />} />
						<Route exact path="/home" render={(props) => <AsyncHome auth={auth} {...props} />} />
							<Route exact path="/login" render={(props) => <AsyncLoginPage auth={auth} {...props} />} />
							<Route exact path="/getNumber" render={(props) => <AsyncGetNumber auth={auth} {...props} />} />
						    <Route exact path="/discussions" render={(props) => <AsyncDiscussions auth={auth} {...props} />} />
						    <Route exact path="/mydiscussions" render={(props) => <AsyncMyDiscussions auth={auth} {...props} />} />
						    <Route path="/expert" render={(props) => <AsyncDiscussionProfile auth={auth} {...props} />} />
						    <Route path="/requestConversation" render={(props) => <AsyncContact auth={auth} {...props} />} />
						    <Route path="/newProfile" render={(props) => <AsyncNewProfile auth={auth} {...props} />} />
						    <Route path="/editProfile" render={(props) => <AsyncEditProfile auth={auth} {...props} />} />
						    <Route path="/availability" render={(props) => <AsyncAvailability auth={auth} {...props} />} />
						    <Route path="/calendar" render={(props) => <AsyncCalendar auth={auth} {...props} />} />
						    <Route path="/pay" render={(props) => <AsyncPay auth={auth} {...props} />} />
						    <Route path="/profile" render={(props) => (
					            !auth.isAuthenticated() ? (
					              <Redirect to="/home"/>
					            ) : (
					              <AsyncProfile auth={auth} {...props} />
					            )
					          )} />
						    
						    <Route path="/callback" render={(props) => {
					          handleAuthentication(props);
					          return <Callback {...props} /> 
					        }}/>
					      <Route path="*" render={(props) => <AsyncDiscussionProfile auth={auth} {...props} />} />
					    </Switch>
				    </div>
				</div>
			</Router>
		);
	}
}

export default Routes;