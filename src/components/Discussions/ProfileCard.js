import React from 'react';
import Paper from 'material-ui/Paper';
// import RaisedButton from 'material-ui/RaisedButton';
import Divider from 'material-ui/Divider';
import { Card, CardActions, CardMedia, CardTitle } from 'material-ui/Card';
import FlatButton from 'material-ui/FlatButton';
import { Link } from 'react-router-dom';
import CircularProgress from 'material-ui/CircularProgress';
import Dialog from 'material-ui/Dialog';
import PropTypes from 'prop-types';
import IconButton from 'material-ui/IconButton';
import { List } from 'material-ui/List';
import Subheader from 'material-ui/Subheader';
import { AwesomeButton } from 'react-awesome-button';
import './discussionprofile.css';

const Markdown = require('react-remarkable');

const ProfileCard = props => (
    <div className="row" style={{ marginRight: '0px', marginLeft: '0px' }} >
      <div className="col-md-6" id="leftcol">
        <div id="pic">
          {props.host && (
            <Card>
              <CardMedia
                overlay={<CardTitle title={props.host} subtitle={props.description} />}
              >
                <div id="holdImage" style={{ maxWidth: 'inherit', minWidth: 'inherit' }}>
                  {props.image && (
                    <img src={props.image} alt={props.image} style={{ maxWidth: '100%', maxHeight: '500px' }} />
                  )}
                </div>
              </CardMedia>
              <CardActions style={{ padding: '0px', marginRight: '-9px', marginTop: '6px' }} >
                {props.is_users && (
                  <div>
                    <FlatButton label="Edit Profile" containerElement={<Link to={`/editProfile/${props.name}`} />} />
                    <FlatButton label="Delete Profile" onClick={() => props.handleOpen()} containerElement="Hi" />
                    <Dialog
                      title="Delete Discussion Profile"
                      actions={props.actions}
                      modal={false}
                      open={props.open}
                      onRequestClose={() => props.handleClose()}
                    >
                     Are you sure you want to delete this discussion profile?
                    </Dialog>
                  </div>
                )}
                {props.github && <a href={props.github} target="_blank"><IconButton className="fab fa-github" /></a> }
                {props.linkedin && <a href={props.linkedin} target="_blank"><IconButton className="fab fa-linkedin-in" /></a>}
                {props.twitter && <a href={props.twitter} target="_blank"><IconButton className="fab fa-twitter" /></a>}
                {props.youtube && <a href={props.youtube} target="_blank"><IconButton className="fab fa-youtube" /></a>}
                {props.medium && <a href={props.medium} target="_blank" ><IconButton className="fab fa-medium-m" /></a> }
                {props.averageRating && props.averageRating}
              </CardActions>
            </Card>
          )}
          </div>
        {props.reviews &&
          <div id="reviews">
            <h1> Reviews </h1>
            <List>
              <Subheader>
                Verified Caller Reviews
              </Subheader>
              {props.reviews}
            </List>
          </div>
        }
      </div>
      <div className="col-md-6" id="profile" style={{ width: props.edit && '30vw', marginLeft: props.edit && '10%' }}>
        {(props.who || props.origin || props.excites || props.helps) && (
          <Paper>
            <div id="qa">
              {props.who && (
                <div>
                  <h3 id="q"> Who are you? </h3>
                  <div id="answer"> <Markdown source={props.who} /></div>
                </div>
              )}
              {props.origin && (
                <div>
                  <h3 id="q"> What is your crypto origin story?</h3>
                  <div id="answer"><Markdown source={props.origin} /></div>
                </div>
              )}
              {props.excites && (
                <div>
                  <h3 id="q"> What excites you about blockchain technology?</h3>
                  <div id="answer"><Markdown source={props.excites} /></div>
                </div>
              )}
              {props.helps && (
                <div>
                  <h3 id="q"> What can you help callers with?</h3>
                  <div id="answer"><Markdown source={props.helps} /></div>
                </div>
              )}
            </div>
            <div>
            
              <Divider style={{ marginBottom: '6px' }} />
              {props.title && (
                <div>
                  <CardTitle title={props.title} subtitle={props.subtitle} style={{ marginBottom: '6px' }} />
                </div>
              )}
              {(!props.edit && !props.is_users) && (
                <div>
                  <AwesomeButton type="primary" style={{width: '100%', fontSize: '20px' }} action={() => props.schedule()}>Schedule a Call</AwesomeButton>

                </div>
              )}
            </div>
          </Paper>
        )}
        {!props.host && (
          <div style={{ position: 'fixed', top: '20%', left: '50%' }}>
            <CircularProgress size={80} thickness={5} />
          </div>
        )}
      </div>
    </div>
);

export default ProfileCard;

ProfileCard.propTypes = {
  edit: PropTypes.bool,
  actions: PropTypes.arrayOf(PropTypes.object),
  open: PropTypes.bool.isRequired,
  is_users: PropTypes.bool,
  origin: PropTypes.string,
  excites: PropTypes.string,
  helps: PropTypes.string,
  title: PropTypes.string,
  who: PropTypes.string,
  image: PropTypes.string,
  description: PropTypes.string,
  subtitle: PropTypes.string,
  host: PropTypes.string,
  handleOpen: PropTypes.func,
  handleClose: PropTypes.func
};

ProfileCard.defaultProps = {
  is_users: false,
  origin: '',
  excites: '',
  helps: '',
  title: '',
  who: '',
  image: '',
  description: '',
  edit: false,
  actions: [{}],
  subtitle: '',
  host: '',
  handleClose: () => {},
  handleOpen: () => {}
};
