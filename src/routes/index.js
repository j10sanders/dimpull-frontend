import React from 'react';
import {BrowserRouter, Route, Switch} from 'react-router-dom';
import Discussions from '../components/Discussions/Discussions';
import DiscussionProfile from '../components/Discussions/DiscussionProfile';

export default () => 
	(<BrowserRouter >
		<Switch>
	    <Route path="/discussions" component={Discussions} />
	    <Route path="/discussionProfile" component={DiscussionProfile} />
	    </Switch>
	</BrowserRouter>);