import React, { Component } from 'react';
import axios from 'axios';
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

class Routes extends Component {
  constructor (props) {
    super(props);
    this.state = {
      expert: false,
      isAuthenticated: false,
      picture: null
    };
  }

  componentWillReceiveProps (nextProps, nextContext) {
    if (nextProps.location.pathname === '/' && this.props.location.pathname === '/login') {
      this.getProfile();
    }
    if (!this.state.picture) {
      this.getProfile();
    }
  }

  getProfile () {
    if (!this.state.picture) {
      if (this.state.isAuthenticated) {
        const { userProfile, getProfile } = auth;
        if (!userProfile) {
          getProfile((err, profile) => {
            if (profile) {
              this.setState({ picture: profile.picture });
            } else {
              this.checkExpert();
            }
          });
        } else {
          this.setState({ picture: userProfile.picture });
        }
      } else {
        this.setState({ picture: null, isAuthenticated: false });
      }
    }
  }

  componentDidMount () {
    this.checkExpert();
    this.timeoutCheckExpert();
  }


  timeoutCheckExpert () {
    window.setTimeout(() => {
      if (!this.state.expert) {
        this.checkExpert();
      }
    }, 2000);
  }

  async checkExpert () {
    const { isAuthenticated } = auth;
    const { getAccessToken } = auth;
    if (isAuthenticated()) {
      this.setState({ isAuthenticated: true });
      const headers = { Authorization: `Bearer ${getAccessToken()}` };
      const response = await axios.get(`${process.env.REACT_APP_USERS_SERVICE_URL}/isexpert`, { headers });
      if (response.data.expert) {
        this.setState({ expert: true });
      }
      if (response.data.pic) {
        this.setState({ picture: response.data.pic });
      }
    }
  }

  render () {
    const { isAuthenticated, expert, picture } = this.state;
    return (
      <Router history={history}>
        <div>
          <Route render={(props) => <Header isAuthenticated={isAuthenticated} picture={picture} {...props} />} />
          <div
            className="container"
            style={{ 
              paddingBottom: '65px',
              marginTop: '64px',
            }}
          >
            <ScrollToTop>
              <Switch>
                <Route exact path="/" render={(props) => <AsyncHome auth={auth} isAuthenticated={isAuthenticated} isexpert={expert} {...props} />} />
                <Route exact path="/home" render={(props) => <AsyncHome auth={auth} isAuthenticated={isAuthenticated} isexpert={expert} {...props} />} />
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
                <Route path="/callback" render={(props) => { handleAuthentication(props); return <Callback {...props} /> }}/>
                <Route path="*" render={(props) => <AsyncDiscussionProfile auth={auth} {...props} />} />
              </Switch>
            </ScrollToTop>
          </div>
        </div>
      </Router>
    );
  }
}

export default Routes;