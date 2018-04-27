import React from 'react';
import axios from 'axios';
import { List, ListItem } from 'material-ui/List';
import Avatar from 'material-ui/Avatar';
import CircularProgress from 'material-ui/CircularProgress';
import { Link } from 'react-router-dom';
import Paper from 'material-ui/Paper';
import ReactStars from 'react-stars';
import { darkBlack } from 'material-ui/styles/colors';
import './discussionprofile.css';

class Discussions extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      dps: [],
      waiting: true
    };
  }

  componentDidMount () {
    this.getDiscussions();
  }

  async getDiscussions () {
    const { isAuthenticated } = this.props.auth;
    const { getAccessToken } = this.props.auth;
    if (isAuthenticated()) {
      const headers = { Authorization: `Bearer ${getAccessToken()}` };
      const discussions = await axios.get(`${process.env.REACT_APP_USERS_SERVICE_URL}/api/discussions/dps`, { headers });
      this.setState({ dps: discussions.data });
    } else {
      const discussions = await axios.get(`${process.env.REACT_APP_USERS_SERVICE_URL}/api/discussions/dps`);
      this.setState({ dps: discussions.data });
    }
    this.setState({ waiting: false });
  }

  render () {
    const waiting = this.state.waiting ? 'inherit' : 'none';
    return (
      <div style={{ textAlign: 'center', marginBottom: '80px' }}>
        <div style={{ marginTop: '50px' }}>
          <h1>Meet the Experts</h1>
        </div>
        <div id="meetExperts">
          <CircularProgress style={{ display: waiting, width: '100%' }} size={80} thickness={5} />
          <List>
            {this.state.dps.map(dp => (
              <Paper style={{ marginBottom: '12px', marginRight: '4px', marginLeft: '4px' }} key={dp.id} >
                <ListItem
                  leftAvatar={<Avatar src={dp.image.replace('h_595', 'h_100')} style={{ border: 0, objectFit: 'cover' }} />}
                  key={dp.id}
                  containerElement={<Link to={`/expert/${dp.url}`} key={dp.url} />}
                  primaryText={`${dp.first_name} ${dp.last_name}`}
                  secondaryText={
                    <p style={{ lineHeight: '18px' }}><span style={{ color: darkBlack }}>{dp.description} </span><br />{dp.who}</p>
                  }
                  style={{ textAlign: 'left' }}
                  secondaryTextLines={2}
                  leftIcon={
                    <div
                      style={{
                        float: 'right', margin: 'auto', position: 'inherit', width: 'auto'
                      }}
                    >
                      <div style={{ paddingBottom: '5px', textAlign: 'center' }}>
                        ${Number(dp.price).toFixed(0)}
                      </div>
                      {dp.averageRating ? (<ReactStars
                        count={5}
                        size={24}
                        color2="#ffd700"
                        value={dp.averageRating}
                        // half={false}
                        edit={false}
                      />
                      ) : (<div style={{ fontSize: '17px', color: 'darkgray' }}> No reviews yet </div>)}
                    </div>
                  }
                />
              </Paper>
            ))}
          </List>
        </div>
      </div>
    );
  }
}

export default Discussions;
