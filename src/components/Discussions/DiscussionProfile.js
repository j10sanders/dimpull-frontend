import React from 'react';
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';
import FlatButton from 'material-ui/FlatButton';
import axios from 'axios';
import {Link} from 'react-router-dom';
import CircularProgress from 'material-ui/CircularProgress';
import Dialog from 'material-ui/Dialog';
import history from '../../history';

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
            })
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

    const subtitle = `($${this.state.price}/min)`
    const title = `${Number(Math.round((this.state.price/this.state.etherPrice)+'e8')+'e-8')} Ether/min`
    return (
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
    );
  }
}

export default DiscussionProfile;