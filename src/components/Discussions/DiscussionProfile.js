import React from 'react';
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';
import FlatButton from 'material-ui/FlatButton';
import axios from 'axios';
import {Link} from 'react-router-dom';
import CircularProgress from 'material-ui/CircularProgress';
import Dialog from 'material-ui/Dialog';
import history from '../../history';
import {List, ListItem} from 'material-ui/List';
import Subheader from 'material-ui/Subheader';
import TextField from 'material-ui/TextField';
import Paper from 'material-ui/Paper';
import RaisedButton from 'material-ui/RaisedButton';
import ReactStars from 'react-stars'

const style = {
    marginTop: 50,
    paddingBottom: 50,
    paddingTop: 25,
    width: '100%',
    textAlign: 'center',
    display: 'inline-block',
};

class DiscussionProfile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
      etherPrice: '',
      }
    }

    etherPrice(){
      axios.get('https://min-api.cryptocompare.com/data/price?fsym=ETH&tsyms=USD')
      .then(res => {
        this.setState({etherPrice: res.data.USD})
      })
    }

  componentDidMount(){
    const { isAuthenticated } = this.props.auth;
    const { getAccessToken } = this.props.auth;
    let headers = {}
    if ( isAuthenticated()) {
      headers = { 'Authorization': `Bearer ${getAccessToken()}`}
      axios.get(`${process.env.REACT_APP_USERS_SERVICE_URL}/api/register`, {
        headers
      })
     .then((response) => {
        if (response.data === "register phone"){
          history.push('/getNumber');
        }
        else{
          this.getDiscussion(headers);
        }
      }).catch(function (error) {
            console.log(error)
          })
    } else {
      this.getDiscussion(headers);
    }
  }

  getDiscussion(headers){
    this.etherPrice()
    axios.get(`${process.env.REACT_APP_USERS_SERVICE_URL}/discussion${this.props.location.search}`, {headers})
          .then((response) => {
            this.etherPrice();
            this.setState({host: `${response.data.first_name} ${response.data.last_name}`,
              image: response.data.image,
              auth_image: response.data.auth_pic,
              description: response.data.description,
              anonymous_phone_number: response.data.anonymous_phone_number,
              is_users: response.data.is_users,
              price: response.data.price,
              other_profile: response.data.otherProfile,
              needReview: response.data.needReview,
            })
            if (response.data.reviews) {
              this.setState({reviews: response.data.reviews,
                averageRating: response.data.averageRating
              })
            }
          }).catch(function (error) {
        console.log(error)
      })
  }

  deleteProfile(){
    const { isAuthenticated } = this.props.auth;
    const { getAccessToken } = this.props.auth;
    let headers = {}
    if ( isAuthenticated()) {
      headers = { 'Authorization': `Bearer ${getAccessToken()}`}
    }
    axios.get(`${process.env.REACT_APP_USERS_SERVICE_URL}/deleteDiscussion${this.props.location.search}`, {headers})
      .then((response) => {
        this.handleClose();
        history.replace('/discussions');
        })
      
      .catch(function (error) {
        console.log(error)
      })
  }

  handleOpen() {
    this.setState({open: true});
  }

  handleClose() {
    this.setState({open: false});
  }

  linkToProfile(profile){
    window.open(
      profile,
      '_blank' // <- This is what makes it open in a new window.
    );
  }

  // componentWillMount() {
  //     this.setState({ profile: {} });
  //     const { userProfile, getProfile } = this.props.auth;
  //     if (!userProfile) {
  //         getProfile((err, profile) => {
  //         this.setState({ profile });
  //       });
  //     } else {
  //       this.setState({ profile: userProfile });
  //     }
  // }


  submit(e) {
    const { isAuthenticated } = this.props.auth;
    if ( isAuthenticated()) {
      axios.post(`${process.env.REACT_APP_USERS_SERVICE_URL}/editdiscussion${this.props.location.search}`, { 
        user_id: this.state.profile.sub,
        description: this.state.description,
        image_url: this.state.image,
        otherProfile: this.state.otherProfile,
        price: this.state.price,
        timezone: this.state.timezone,
      }
      ).then(function (response) {
        console.log(response)
        history.replace('/calendar');
      })
    }
  }

  ratingChanged(newRating){
    console.log(newRating)
  }

  changeValue(e, type) {
      const value = e.target.value;
      const next_state = {};
      next_state[type] = value;
      this.setState(next_state)
    }

  render() {
    var cardStyle = {
      display: 'block',
      width: '60vw',
      transitionDuration: '0.3s',
      height: '45vw',
      margin: 'auto',
      paddingTop: '10px',
    }
    const actions = [
      <FlatButton
        label="Cancel"
        primary={true}
        onClick={() => this.handleClose()}
      />,
      <FlatButton
        label="Confirm: Delete this profile"
        primary={true}
        onClick={() => this.deleteProfile()}
      />,
    ];

    const reviews = []
    if (this.state.reviews) {
      console.log(reviews)
    }
    console.log(this.state)
    const subtitle = `($${this.state.price}/min)`
    const title = `${Number(Math.round((this.state.price/this.state.etherPrice)+'e8')+'e-8')} Ether/min`
    return (
      <div>
      {this.state.needReview &&
        <Paper style={style}>
        <h2>Please leave a review!</h2>
          <ReactStars
            count={5}
            onChange={this.ratingChanged}
            size={24}
            color2={'#ffd700'} />
          <TextField
            hintText="Review"
            floatingLabelText="Review"
            type="message"
            onChange={(e) => this.changeValue(e, 'message')}
            multiLine={true}
            rows={2}
            rowsMax={6}
            style={{textAlign: 'start', width: '95%'}}
            fullWidth={true}
          />

          
          <RaisedButton
              disabled={this.state.disabled}
              style={{ marginTop: 50 }}
              label="Submit"
              onClick={(e) => this.submit(e)}
            />
        </Paper>
      }
        <div style={cardStyle}>
        {this.state.host && (
          <Card>
          <CardHeader
            title={this.state.host}
            subtitle={this.state.description}
            avatar={this.state.auth_image}
          />
          <CardMedia
          style={{cursor:'pointer'}}
            overlay={<CardTitle title={title} subtitle={subtitle} />}
            onClick={() => this.linkToProfile(this.state.other_profile)}
          >
            <img src={this.state.image} alt=""  />
          </CardMedia>
          <CardTitle title={this.state.host} subtitle={this.state.anonymous_phone_number} />
          <CardText>
            {this.state.description}
          </CardText>
          <CardActions>
            {this.state.is_users && (
              <div>
                <FlatButton label="Edit Profile" containerElement={<Link to={`/editProfile${this.props.location.search}`} />} />
                <FlatButton label="Delete Profile" onClick={() => this.handleOpen()} containerElement={"Hi"}/>
                  <Dialog
                    title="Delete Discussion Profile"
                    actions={actions}
                    modal={false}
                    open={this.state.open}
                    onRequestClose={() => this.handleClose()}
                  >
                   Are you sure you want to delete this discussion profile?
                  </Dialog>
              </div>
            )}
            {!this.state.is_users && (
              <div>
                <FlatButton label="Contact" containerElement={<Link to={`/availability${this.props.location.search}`} />} />
                <FlatButton label="Save as favorite" containerElement={<Link to={`/availability${this.props.location.search}`} />} />
              </div>
            )}
          </CardActions>
        </Card>
        )}
        {!this.state.host && (
            <CircularProgress size={80} thickness={5} /> 
        )}
      </div>

      {this.state.reviews && 
        <div id="Reviews">
          <h1> Reviews </h1>
          <List>
          <Subheader>Recent chats</Subheader>
          {reviews}
          </List>
        </div>
      }
      </div>
    );
  }
}

export default DiscussionProfile;