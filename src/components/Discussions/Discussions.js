import React from 'react';
import axios from 'axios';
import {List, ListItem} from 'material-ui/List';
import Avatar from 'material-ui/Avatar';
import CircularProgress from 'material-ui/CircularProgress';
import { Link } from 'react-router-dom';
import Paper from 'material-ui/Paper';
import ReactStars from 'react-stars';
import { darkBlack } from 'material-ui/styles/colors';

import './discussionprofile.css';


class Discussions extends React.Component {
	constructor(props) {
    super(props);
    this.state = {
      dps: [],
      waiting: true
    };
  }

  async getDiscussions(){
    const { isAuthenticated } = this.props.auth;
    const { getAccessToken } = this.props.auth;
    if ( isAuthenticated()) {
      const headers = { 'Authorization': `Bearer ${getAccessToken()}`}
      let discussions = await axios.get(`${process.env.REACT_APP_USERS_SERVICE_URL}/api/discussions`, { headers })
      this.setState({dps: discussions.data})
    } else {
      let discussions = await axios.get(`${process.env.REACT_APP_USERS_SERVICE_URL}/api/discussions`)
      this.setState({dps: discussions.data})
    }
    this.setState({waiting: false})
  }

  componentDidMount(){
    this.getDiscussions();
  }

 render () {
  let waiting = this.state.waiting ? 'inherit': 'none'
    return (
      <div style={{textAlign: 'center'}}>
      <CircularProgress style={{display: waiting, width: '100%'}} size={80} thickness={5} />
        <div style={{ marginTop: '50px' }}>
          <h1>Meet the Experts</h1>
        </div>
        <div id="meetExperts">
          <Paper>
            <List>
              {this.state.dps.map((dp) => (
          	    <ListItem
                  leftAvatar={<Avatar src={dp.image} style={{border: 0, objectFit: 'cover'}}/>}
                  key={dp.id}
                  containerElement={<Link to={`/expert/${dp.url}`} key={dp.url}/>}
                  primaryText={`${dp.first_name} ${dp.last_name}`}
                  secondaryText={<p><span style={{color: darkBlack}}>{dp.description} </span>{dp.who}</p>}
                  style={{ textAlign: 'left' }}
                  secondaryTextLines={2}
                  leftIcon={
                    <div
                      style={{
                        float: 'right', margin: 'auto', position: 'inherit', width: 'auto'
                      }}
                    >
                    <div style={{marginTop:'-10px', paddingBottom:'5px', textAlign: 'center' }}>$50</div>
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
              ))}
            </List>
          </Paper>
        </div>
    </div>
    );
  }
}

export default Discussions;