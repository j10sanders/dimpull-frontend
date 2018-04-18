import React from 'react';
import Paper from 'material-ui/Paper';
import RaisedButton from 'material-ui/RaisedButton';
import Divider from 'material-ui/Divider';
import { Card, CardActions, CardMedia, CardTitle } from 'material-ui/Card';
import FlatButton from 'material-ui/FlatButton';
import { Link } from 'react-router-dom';
import CircularProgress from 'material-ui/CircularProgress';
import Dialog from 'material-ui/Dialog';
import PropTypes from 'prop-types';
import TextField from 'material-ui/TextField';
import IconButton from 'material-ui/IconButton';

import './discussionprofile.css';

class ProfileCard extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
    };
  }

  render () {
    return (
      <div className="container">
        <div className="row" style={{ marginRight: '0px', marginLeft: '0px' }} >
          <div className="col-md-6" id="pic">
            {this.props.host && (
              <Card>
                <CardMedia
                  style={{ cursor: 'pointer' }}
                  overlay={<CardTitle title={this.props.host} subtitle={this.props.description} />}
                  // onClick={() => this.props.linkToProfile(this.props.other_profile)}
                >
                  <div id="holdImage" style={{ maxWidth: 'inherit', minWidth: 'inherit' }}>
                    {this.props.image && (
                      <img src={this.props.image} alt={this.props.image} style={{ maxWidth: '100%', maxHeight: '500px' }} />
                    )}
                  </div>
                </CardMedia>
                <CardActions style={{ padding: '0px', marginRight: '-9px', marginTop: '6px' }} >
                  {this.props.is_users && (
                    <div>
                      <FlatButton label="Edit Profile" containerElement={<Link to={`/editProfile/${this.props.name}`} />} />
                      <FlatButton label="Delete Profile" onClick={() => this.props.handleOpen()} containerElement="Hi" />
                      <Dialog
                        title="Delete Discussion Profile"
                        actions={this.props.actions}
                        modal={false}
                        open={this.props.open}
                        onRequestClose={() => this.props.handleClose()}
                      >
                       Are you sure you want to delete this discussion profile?
                      </Dialog>
                    </div>
                  )}
                  {this.props.github && <IconButton iconClassName="fab fa-github" href={this.props.github} target="_blank" /> }
                  {this.props.linkedin && <IconButton iconClassName="fab fa-linkedin-in" href={this.props.linkedin} target="_blank" /> }
                  {this.props.twitter && <IconButton iconClassName="fab fa-twitter" href={this.props.twitter} target="_blank" /> }
                  {this.props.medium && <IconButton iconClassName="fab fa-medium-m" href={this.props.medium} target="_blank" /> }
                </CardActions>
              </Card>
            )}
          </div>
          <div className="col-md-6" id="profile" style={{ width: this.props.edit && '30vw', marginLeft: this.props.edit && '10%' }}>
            {(this.props.who || this.props.origin || this.props.excites || this.props.helps) && (
              <Paper>
                <div id="qa">
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
                </div>
                {!this.props.is_users && (
                  <div>
                    <Divider style={{ marginBottom: '6px' }} />
                    {this.props.title && (
                      <CardTitle title={this.props.title} subtitle={this.props.subtitle} style={{ marginBottom: '6px' }} />
                    )}
                    {!this.props.edit && (
                      <div>
                        <RaisedButton
                          style={{ lineHeight: '56px', height: '56px', boxShadow: 'rgba(0, 0, 0, 1) 0px 3px 10px, rgba(0, 0, 0, 0.12) 0px 2px 1px' }}
                          labelStyle={{ fontSize: '20px' }}
                          fullWidth
                          primary
                          label="Schedule a Call"
                          // containerElement={<Link to={`/availability/${this.props.dp}`} />}
                          onClick={() => this.props.getEmail()}
                        />
                        <Dialog
                          title="We aren't ready just yet!"
                          actions={this.props.ok}
                          modal={false}
                          open={this.props.emailOpen}
                          onRequestClose={() => this.props.emailClose()}
                        >
                          {this.props.host} will be accepting calls VERY soon.
                          To be notified when the platform is ready, please enter your email below.  We promise no spam!
                          <TextField
                            // hintText="Link to another site's profile"
                            floatingLabelText="Your email"
                            type="email"
                            value={this.props.email}
                            fullWidth
                            // errorText={this.state.tel_error_text}
                            onChange={e => this.props.changeEmail(e)}
                          />
                        </Dialog>
                      </div>
                    )}
                  </div>
                )}
              </Paper>
            )}
            {!this.props.host && (
              <CircularProgress size={80} thickness={5} />
            )}
          </div>
        </div>
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
  dp: 0,
  actions: [{}],
  subtitle: '',
  host: ''
};

export default ProfileCard;
