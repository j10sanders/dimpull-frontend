import React from 'react';
import Subheader from 'material-ui/Subheader';
import RaisedButton from 'material-ui/RaisedButton';
import { Card, CardActions, CardMedia, CardTitle, CardText } from 'material-ui/Card';
import FlatButton from 'material-ui/FlatButton';
import { Link } from 'react-router-dom';
import CircularProgress from 'material-ui/CircularProgress';
import Dialog from 'material-ui/Dialog';
import PropTypes from 'prop-types';
import './discussionprofile.css';

class ProfileCard extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
    };
  }

  render () {
    return (
      <div id="cardStyle">
        {this.props.host && (
          <Card>
            <CardMedia
              style={{ cursor: 'pointer' }}
              overlay={<CardTitle title={this.props.host} subtitle={this.props.description} />}
              // onClick={() => this.props.linkToProfile(this.props.other_profile)}
            >
              <div id="holdImage" style={{ maxWidth: 'inherit', minWidth: 'inherit' }}>
                {this.props.image && (
                  <img src={this.props.image} alt={this.props.image} style={{ maxWidth: '100%' }} />
                )}
              </div>
            </CardMedia>
            <CardText>
              {this.props.who && (
                <div>
                  <h3 id="q"> Who are you? </h3>
                  <p id="answer">{this.props.who}</p>
                </div>
              )}
              {this.props.origin && (
                <div>
                  <h3 id="q"> What is your crypto origin story?</h3>
                  <p id="answer">{this.props.origin}</p>
                </div>
              )}
              {this.props.excites && (
                <div>
                  <h3 id="q"> What excites you about blockchain technology?</h3>
                  <p id="answer">{this.props.excites}</p>
                </div>
              )}
              {this.props.helps && (
                <div>
                  <h3 id="q"> What can you help callers with?</h3>
                  <p id="answer">{this.props.helps}</p>
                </div>
              )}
            </CardText>
            {this.props.title && (
              <CardTitle title={this.props.title} subtitle={this.props.subtitle} />
            )}
            <CardActions style={{ padding: '0px', marginRight: '-9px', marginTop: '6px' }} >
              {this.props.is_users && (
                <div>
                  <FlatButton label="Edit Profile" containerElement={<Link to={`/editProfile/${this.props.name}`} />} />
                  <FlatButton label="Delete Profile" onClick={() => this.handleOpen()} containerElement={"Hi"}/>
                  <Dialog
                    title="Delete Discussion Profile"
                    actions={this.props.actions}
                    modal={false}
                    open={this.props.open}
                    onRequestClose={() => this.handleClose()}
                  >
                   Are you sure you want to delete this discussion profile?
                  </Dialog>
                </div>
              )}
              {!this.props.is_users && (
                <div>
                  {!this.props.edit && (
                    <RaisedButton
                      style={{ lineHeight: '56px', height: '56px', boxShadow: 'rgba(0, 0, 0, 1) 0px 3px 10px, rgba(0, 0, 0, 0.12) 0px 2px 1px' }}
                      labelStyle={{ fontSize: '20px' }}
                      fullWidth
                      primary
                      label="Schedule a Call"
                      containerElement={<Link to={`/availability/${this.props.dp}`} />}
                    />
                  )}
                </div>
              )}
            </CardActions>
          </Card>
        )}
        {!this.props.host && (
          <CircularProgress size={80} thickness={5} />
        )}
        {!this.props.edit && (
          <Subheader inset style={{ paddingTop: '10px', lineHeight: 'inherit', paddingLeft: '0px' }}>This is an example profile while we prepare our first group of experts</Subheader>
        )}
      </div>
    );
  }
}

ProfileCard.propTypes = {
  dp: PropTypes.number,
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
  host: PropTypes.string
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
  dp: 0,
  actions: [{}],
  subtitle: '',
  host: ''
};


export default ProfileCard;
