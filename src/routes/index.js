import React from 'react';
import {BrowserRouter, Route, Switch} from 'react-router-dom';
import Discussions from '../components/Discussions/Discussions';
import DiscussionProfile from '../components/Discussions/DiscussionProfile';
import { history } from '../_helpers';
import { alertActions } from '../_actions';
import { PrivateRoute } from '../_components';
import { connect } from 'react-redux';
import { LoginPage } from '../LoginPage';
import { RegisterPage } from '../RegisterPage';
import { Home } from '../components/Home';
import { Header } from '../components/Header';

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
				<BrowserRouter>
					<div>
						<Header />
							<Switch>
								<Route exact path="/" component={Home} />
								<Route exact path="/login" component={LoginPage} />
								<Route exact path="/register" component={RegisterPage} />
							    <Route exact path="/discussions" component={Discussions} />
							    <PrivateRoute path="/discussionProfile" component={DiscussionProfile} />
						    </Switch>
					</div>
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