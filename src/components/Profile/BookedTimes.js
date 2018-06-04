import React from 'react';
import { List, ListItem } from 'material-ui/List';
import { Link } from 'react-router-dom';
import CircularProgress from 'material-ui/CircularProgress';
import FlatButton from 'material-ui/FlatButton';
import Dialog from 'material-ui/Dialog';
import Snackbar from 'material-ui/Snackbar';
import Paper from 'material-ui/Paper';
import axios from 'axios';
import './Profile.css';

class BookedTimes extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      convos: [],
      cancelCall: false,
      snackOpen: false,
      errorSnack: false
    };
  }

  componentDidMount () {
    this.getTimes();
  }

  async getTimes () {
    this.setState({ waiting: true });
    const { isAuthenticated } = this.props.auth;
    const { getAccessToken } = this.props.auth;
    let headers = {};
    if (isAuthenticated()) {
      this.setState({ isAuthenticated: true });
      headers = { Authorization: `Bearer ${getAccessToken()}` };
      const response = await axios.get(`${process.env.REACT_APP_USERS_SERVICE_URL}/getbookedtimeslots`, { headers });
      if (response.data.times) {
        const convos = response.data.times;
        const obj = [];
        for (let i of convos) {
          obj.push([this.formatDate(i[0]), i[1], i[0]]);
        }
        this.setState({ convos: obj });
      }
      this.setState({ waiting: false });
    }
  }

  formatDate (time, message) {
    const date = new Date(time);
    const offset = new Date().getTimezoneOffset() / 60;
    let hours = date.getHours() - offset;
    let minutes = date.getMinutes();
    const ampm = hours >= 12 ? 'pm' : 'am';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? '0'+minutes : minutes;
    const strTime = hours + ':' + minutes + ' ' + ampm;
    return date.getMonth() + 1 + "/" + date.getDate() + "/" + date.getFullYear() + " " + strTime;
  }

  handleOpen (e) {
    this.setState({ cancelCall: true, call: e});
  }

  closeCancel () {
    this.setState({ cancelCall: false });
  }

  async confirmCancel () {
    const { getAccessToken } = this.props.auth;
    let headers = {};
    this.setState({ isAuthenticated: true });
    headers = { Authorization: `Bearer ${getAccessToken()}` };
    const response = await axios.post(`${process.env.REACT_APP_USERS_SERVICE_URL}/cancelcall`, {
      cancelCallTime: this.state.call
    }, { headers });
    if (response.data.canceled) {
      this.setState({ snackOpen: true });
      this.closeCancel();
      this.getTimes();
    } else {
      this.setState({ errorSnack: true });
    }
  }

  handleRequestClose () {
    this.setState({ snackOpen: false, errorSnack: false });
  }

  render () {
    const actions = [
      <FlatButton
        label="Nevermind - I'll take this call"
        primary
        onClick={() => this.closeCancel()}
      />,
      <FlatButton
        label="Yes, cancel this call"
        primary
        onClick={() => this.confirmCancel()}
      />
    ];
    return (
      <div style={{ textAlign: 'center', marginBottom: '80px' }}>
        {this.state.waiting ? (
          <CircularProgress size={80} thickness={5} />
        ) : (
          <div id="accountButtons">
            {this.state.convos.length > 0 ? (
              <List>
                {this.state.convos.map(convo => (
                  <Paper style={{ marginBottom: '12px', marginRight: '4px', marginLeft: '4px' }} key={convo[2]} >
                    <ListItem
                      key={convo[2]}
                      primaryText={convo[0]}
                      style={{ textAlign: 'left' }}
                      secondaryText={convo[1]}
                      rightIcon={
                        <i style={{ color: 'Tomato' }} className="fas fa-times" />
                      }
                      onClick={() => this.handleOpen(convo[2])}
                    />
                  </Paper>
                ))}
              </List>
            )
              : <div>
                  No conversations upcoming.<Link to="/calendar" key="cal" >  Make sure to leave open timeslots for people to book! </Link>
              </div>
            }
          </div>
        )}
        <Dialog
          title="Are you sure you want to cancel this call?"
          actions={actions}
          modal={false}
          open={this.state.cancelCall}
          onRequestClose={() => this.closeCancel()}
        >
          {`We may disable your profile, since we can't allow many missed calls.
          The user will be refunded, but can still leave a review on your profile.
          You cannot undo this.`}
        </Dialog>
        <Snackbar
          open={this.state.snackOpen}
          message="Call cancelled :("
          autoHideDuration={7000}
          onRequestClose={() => this.handleRequestClose()}
        />
        <Snackbar
          open={this.state.errorSnack}
          message="There may have been an error cancelling the call...  Check with admin@dimpull.com"
          autoHideDuration={10000}
          onRequestClose={() => this.handleRequestClose()}
        />
      </div>
    );
  }
}

export default BookedTimes;
