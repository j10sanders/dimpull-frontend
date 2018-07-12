import React from 'react';
import { List, ListItem } from 'material-ui/List';
import Avatar from 'material-ui/Avatar';
import CircularProgress from 'material-ui/CircularProgress';
import { Link } from 'react-router-dom';
import Paper from 'material-ui/Paper';

import './discussionprofile.css';

const Discussions = props => (
  <div style={{ textAlign: 'center', marginBottom: '80px' }}>
    <div style={{ marginTop: '50px' }}>
      <h1>Meet the Experts</h1>
    </div>
    <div id="meetExperts">
      <CircularProgress style={{ display: props.waiting ? 'inherit' : 'none', width: '100%' }} size={80} thickness={5} />
      <List>
        {props.dps.map(dp => (
          <Paper style={{ marginBottom: '12px', marginRight: '4px', marginLeft: '4px' }} key={dp.id} >
            <ListItem
              leftAvatar={<Avatar src={dp.image.replace('h_595', 'h_100')} style={{ border: 0, objectFit: 'cover', marginTop: '0px'}} />}
              key={dp.id}
              containerElement={<Link to={`/${dp.url}`} key={dp.url} />}
              primaryText={<p style={{ marginTop: '-4px', fontSize: '16px', fontWeight: '500'}}>{`${dp.first_name} ${dp.last_name}`}</p>}
              secondaryText={
                <p><span style={{ color: '#505050' }}>{dp.description}</span><br /></p>
              }
              style={{ textAlign: 'left' }}
              leftIcon={
                <div
                  style={{
                    float: 'right', margin: 'auto', position: 'inherit', width: 'auto'
                  }}
                >
                  <div style={{ paddingBottom: '0px', textAlign: 'center', marginTop: '-18px' }}>
                    ${Number(dp.price).toFixed(0)}
                  </div>
                  {dp.timeslots !== 0
                    ? <div style={{ paddingTop: '14px', fontWeight: 'bold', textAlign: 'center' }}>Book Now</div>
                    : <div style={{ paddingTop: '14px' }}>Request Times?</div>
                  }
                </div>
              }
            />
          </Paper>
        ))}
      </List>
    </div>
  </div>
);

export default Discussions;
