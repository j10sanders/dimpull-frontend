import React from 'react';
import {Router, Route, Switch} from 'react-router-dom';
import asyncComponent from "../components/AsyncComponent";
import Auth from '../Auth/Auth.js';
import history from '../history';
import Callback from '../Callback/Callback';
import Header from '../components/Header';
import ScrollToTop from './scrollToTop';
const auth = new Auth();
const AsyncHome = asyncComponent(() => import("../components/Home"));
const AsyncNewProfile = asyncComponent(() => import("../components/Discussions/NewProfile"));
const AsyncEditProfile = asyncComponent(() => import("../components/Discussions/EditProfile"));
const AsyncAvailability = asyncComponent(() => import("../components/Discussions/Availability"));
const AsyncFAQ = asyncComponent(() => import("../components/FAQ/faq"));
const AsyncCalendar = asyncComponent(() => import("../components/Profile/Calendar"));
// const AsyncPay = asyncComponent(() => import("../components/Discussions/Pay"));
const AsyncDiscussionProfile = asyncComponent(() => import("../components/Discussions/DiscussionProfile"));
const AsyncContact = asyncComponent(() => import("../components/Discussions/Contact"));
const AsyncDiscussions = asyncComponent(() => import("../components/Discussions/Discussions"));
const AsyncLoginPage = asyncComponent(() => import("../LoginPage/LoginPage"));
const AsyncGetNumber = asyncComponent(() => import("../LoginPage/GetNumber"));
const AsyncProfile = asyncComponent(() => import("../components/Profile"));
const AsyncBookedTimes = asyncComponent(() => import("../components/Profile/BookedTimes"));

const handleAuthentication = ({location}) => {
  if (/access_token|id_token|error/.test(location.hash)) {
    auth.handleAuthentication();
  }
}

const Routes = () => (
	<Router history={history}>
		<div>
			<Route render={(props) => <Header auth={auth} {...props} />} />
			<div
				className="container"
        style={{ 
          paddingBottom: '65px',
          marginTop: '64px',
        }}
    	>
    	<ScrollToTop>
				<Switch>
					<Route exact path="/" render={(props) => <AsyncHome auth={auth} {...props} />} />
					<Route exact path="/home" render={(props) => <AsyncHome auth={auth} {...props} />} />
					<Route exact path="/login" render={(props) => <AsyncLoginPage auth={auth} {...props} />} />
					<Route exact path="/getNumber" render={(props) => <AsyncGetNumber auth={auth} {...props} />} />
			    <Route exact path="/experts" render={(props) => <AsyncDiscussions auth={auth} {...props} />} />
			    <Route path="/expert" render={(props) => <AsyncDiscussionProfile auth={auth} {...props} />} />
			    <Route path="/requestConversation" render={(props) => <AsyncContact auth={auth} {...props} />} />
			    <Route path="/newProfile" render={(props) => <AsyncNewProfile auth={auth} {...props} />} />
			    <Route path="/editProfile" render={(props) => <AsyncEditProfile auth={auth} {...props} />} />
			    <Route path="/availability" render={(props) => <AsyncAvailability auth={auth} {...props} />} />
			    <Route path="/faq" render={(props) => <AsyncFAQ auth={auth} {...props} />} />
			    <Route path="/calendar" render={(props) => <AsyncCalendar auth={auth} {...props} />} />
			    <Route path="/bookedtimes" render={(props) => <AsyncBookedTimes auth={auth} {...props} />} />
			    <Route path="/profile" render={(props) => <AsyncProfile auth={auth} {...props} />} />
			    <Route path="/callback" render={(props) => {
		          handleAuthentication(props);
		          return <Callback {...props} /> 
		        }}/>
			      <Route path="*" render={(props) => <AsyncDiscussionProfile auth={auth} {...props} />} />
			    </Switch>
			  </ScrollToTop>
		  </div>
		</div>
	</Router>
);

export default Routes;