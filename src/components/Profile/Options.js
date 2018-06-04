import React from 'react';
import { List, ListItem } from 'material-ui/List';
import { Link } from 'react-router-dom';
import Paper from 'material-ui/Paper';
import Snackbar from 'material-ui/Snackbar';
import { Card, CardActions, CardText } from 'material-ui/Card';
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';
import './Profile.css';

const Options = props => (
	<div style={{ textAlign: 'center', marginBottom: '80px' }}>
	  <div id="accountButtons">
	    <div style={{ marginBottom: '16px' }}>
	      <h2 style={{ display: !props.status.url ? 'none' : 'initial'}}>{`dimpull.com/${props.status.url}`}</h2>
	    </div>
	    <List>
	      <Paper style={{ marginBottom: '24px', marginRight: '4px', marginLeft: '4px' }} zDepth={2} key={1} >
	        <ListItem innerDivStyle={{ padding: '5px' }}>
	          <ListItem
	            key="Set Your Availability"
	            containerElement={<Link to={`/calendar`} key={'cal'} />}
	            primaryText="Set Availability"
	            secondaryText={
	              <p style={{ lineHeight: '17px' }}><span style={{ color: '#eaeaea' }} >Your calendar</span></p>
	            }
	            style={{ textAlign: 'left', backgroundColor: '#268bd2', color: 'white', fontSize: '20px' }}
	            hoverColor="yellow"
	          />
	        </ListItem>
	      </Paper>
	      <Paper style={{ marginBottom: '24px', marginRight: '4px', marginLeft: '4px' }} zDepth={2} key={2} >
	        <ListItem innerDivStyle={{ padding: '5px' }}>
	          <ListItem
	            key="Scheduled Calls"
	            containerElement={<Link to={`/bookedtimes`} key={'booked'} />}
	            primaryText="Scheduled Calls"
	            secondaryText={
	              <p style={{ lineHeight: '17px' }}><span style={{ color: '#eaeaea' }} >Your upcoming calls</span></p>
	            }
	            style={{ textAlign: 'left', backgroundColor: '#268bd2', color: 'white', fontSize: '20px' }}
	          />
	        </ListItem>
	      </Paper>
	      <Paper style={{ marginBottom: '24px', marginRight: '4px', marginLeft: '4px' }} zDepth={2} key={4} >
	        <ListItem innerDivStyle={{ padding: '5px' }}>
	          <ListItem
	            key="View Profile"
	            containerElement={props.status.url ? <Link to={`/${props.status.url}`} key={'url'} /> : <Link to={`/editProfile`} key={'url'} /> }
	            primaryText={`View Profile`}
	            secondaryText={
	              <p style={{ lineHeight: '17px' }}><span style={{ color: '#eaeaea' }} >See your public profile</span></p>
	            }
	            style={{ textAlign: 'left', backgroundColor: '#268bd2', color: 'white', fontSize: '20px' }}
	          />
	        </ListItem>
	      </Paper>
	      <Paper style={{ marginBottom: '24px', marginRight: '4px', marginLeft: '4px' }} zDepth={2} key={3} >
	        <ListItem innerDivStyle={{ padding: '5px' }}>
	          <ListItem
	            key="Edit Profile"
	            containerElement={props.status.url ? <Link to={`/editProfile/${props.status.url}`} key={'edit'} /> : <Link to={`/editProfile`} key={'url'} /> }
	            primaryText="Edit Profile"
	            secondaryText={
	              <p style={{ lineHeight: '17px' }}><span style={{ color: '#eaeaea' }} >Keep your profile up to date</span></p>
	            }
	            style={{ textAlign: 'left', backgroundColor: '#268bd2', color: 'white', fontSize: '20px' }}
	          />
	        </ListItem>
	      </Paper>
	    </List>
	    <div style={{ marginTop: '20px' }}>
	      <Card expanded={props.status.callsExpanded} style={{ marginBottom: '30px' }}>
	        <CardText expandable>
	          <p style={{ fontSize: 'larger', textAlign: 'left' }}>{`Put a link to your public profile (dimpull.com/${props.status.url}) on your homepage and in your LinkedIn and Twitter bios. Visitors can now pay for a conversation.`}</p>
	        </CardText>
	        <CardActions>
	          <FlatButton label="How To Get More Calls" onClick={() => props.handleExpand('callsExpanded')} style={{ display: props.status.callsExpanded ? 'none' : 'initial' }} />
	        </CardActions>
	      </Card>
	      <Card expanded={props.status.refExpanded} style={{ marginBottom: '30px' }}>
	        <CardText expandable>
	          <p style={{ fontSize: 'larger', textAlign: 'left' }}>
	            {`Referral Link: dimpull.com/newProfile/ref=${props.status.referral}`}</p>
	          <p style={{ color: 'dark-grey' }}>Refer an expert to earn 5% of their revenues.  They get $10 extra on their first call.</p>
	        </CardText>
	        <CardActions>
	          <FlatButton label="Referral Link" onClick={() => props.handleExpand('refExpanded')} style={{ display: props.status.refExpanded ? 'none' : 'initial' }} />
	        </CardActions>
	      </Card>
	      <Card expanded={props.status.vipExpanded} style={{ marginBottom: '30px' }}>
	        <CardText expandable>
	          <p style={{ fontSize: 'larger', textAlign: 'left' }}>{`Offer Free Calls: dimpull.com/${props.status.url}/vip=${props.status.vip}`}</p>
	          <p style={{ color: 'dark-grey' }}>"VIP link" is helpful for getting initial reviews</p>
	          <RaisedButton
	            onClick={() => props.newVipId()}
	            label="Change VIP link (in case free calls are getting overused)"
	            // primary
	            style={{ marginTop: '12px' }}
	          />
	        </CardText>
	        <CardActions>
	          <FlatButton label="Give Free Calls" onClick={() => props.handleExpand('vipExpanded')} style={{ display: props.status.vipExpanded ? 'none' : 'initial' }} />
	        </CardActions>
	      </Card>
	    </div>
	  </div>
	  <Snackbar
	    open={props.status.vipupdated}
	    message="Updated vip link"
	    autoHideDuration={4000}
	    onRequestClose={(e) => props.handleRequestClose(e)}
	  />
	</div>
);

export default Options;