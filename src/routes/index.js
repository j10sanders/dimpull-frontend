import React from 'react';
import {BrowserRouter, Route, Switch} from 'react-router-dom';
import Discussions from '../components/Discussions/Discussions';
import DiscussionProfile from '../components/Discussions/DiscussionProfile';
import { history } from '../_helpers';
import { alertActions } from '../_actions';
import { PrivateRoute } from '../_components';
import { connect } from 'react-redux';
import { LoginPage } from '../LoginPage';

class Routes extends React.Component {
	constructor(props) {
        super(props);

        const { dispatch } = this.props;
        history.listen((location, action) => {
            // clear alert on location change
            dispatch(alertActions.clear());
        });
    }

	render() {
		const { alert } = this.props;
		return (
				<BrowserRouter >
					<Switch>
						<Route path="/login" component={LoginPage} />
					    <Route path="/discussions" component={Discussions} />
					    <PrivateRoute path="/discussionProfile" component={DiscussionProfile} />
				    </Switch>
				</BrowserRouter>
		);
	}
}


function mapStateToProps(state) {
    const { alert } = state;
    return {
        alert
    };
}

const connectedApp = connect(mapStateToProps)(Routes);
export default Routes;