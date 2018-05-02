import React from 'react';
import { List, ListItem } from 'material-ui/List';
import Paper from 'material-ui/Paper';
import axios from 'axios';
import './Profile.css';

class BookedTimes extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      convos: []
    };
  }

  componentDidMount () {
    this.getTimes();
  }

  async getTimes () {
    const { isAuthenticated } = this.props.auth;
    const { getAccessToken } = this.props.auth;
    let headers = {};
    if (isAuthenticated()) {
      headers = { Authorization: `Bearer ${getAccessToken()}` };
      const response = await axios.get(`${process.env.REACT_APP_USERS_SERVICE_URL}/getbookedtimeslots`, { headers });
      if (response.data.times) {
        const convos = response.data.times
        const obj = []
        for (let i of convos) {
          obj.push([this.formatDate(i[0]), i[1]])
        }
        this.setState({ convos: obj });
      }
    }
  }

  formatDate (time, message) {
    let date = new Date(time)
    var offset = new Date().getTimezoneOffset() / 60;
    var hours = date.getHours() - offset
    var minutes = date.getMinutes();
    var ampm = hours >= 12 ? 'pm' : 'am';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? '0'+minutes : minutes;
    var strTime = hours + ':' + minutes + ' ' + ampm;
    return date.getMonth()+1 + "/" + date.getDate() + "/" + date.getFullYear() + " " + strTime;
  }

  render () {
    return (
      <div style={{ textAlign: 'center', marginBottom: '80px' }}>
        <div id="accountButtons">
          <List>
            {this.state.convos.map(convo => (
              <Paper style={{ marginBottom: '12px', marginRight: '4px', marginLeft: '4px' }} key={convo[0]} >
                <ListItem
                  key={convo[0]}
                  primaryText={convo[0]}
                  style={{ textAlign: 'left' }}
                  secondaryText={convo[1]}
                  // leftIcon={
                  //   'No'
                  // }
                />
              </Paper>
            ))}
          </List>
        </div>
      </div>
    );
  }
}

export default BookedTimes;
