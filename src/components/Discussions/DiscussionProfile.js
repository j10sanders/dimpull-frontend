import React from 'react';
import {Card, CardActions, CardMedia, CardTitle, CardText} from 'material-ui/Card';
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
import ReactStars from 'react-stars';
import Avatar from 'material-ui/Avatar';
import Divider from 'material-ui/Divider';
import './discussionprofile.css';

const style = {
    marginTop: '50px',
    paddingBottom: 50,
    paddingTop: '30px',
    width: '100%',
    textAlign: 'center',
    display: 'inline-block',
};

// const subQuestions = { 
//   paddingLeft: "0px", 
//   marginTop: "24px"
// }

const colors = ['FF9A57', '01B48F', 'D0D2D3', 'C879B2', '44C7F4']

class DiscussionProfile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
      etherPrice: '',
      stars: 5,
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
    }
    this.getDiscussion(headers);
  }

  getDiscussion(headers){
    this.etherPrice()
    axios.get(`${process.env.REACT_APP_USERS_SERVICE_URL}/discussion${this.props.location.search}`, {headers})
          .then((response) => {
            if (response.data === "not an expert yet"){
              this.setState({notExpert: true})
            }
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
              origin: response.data.origin,
              who: response.data.who,
              excites: response.data.excites,
              helps: response.data.helps,
            })
            if (response.data.reviewlist) {
              this.setState({reviews: response.data.reviewlist,
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
    // window.open(
    //   profile,
    //   '_blank' // <- This is what makes it open in a new window.
    // );
    //commented out because we don't need to link in seed profiles.
  }

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
        origin: this.state.origin,
        who: this.state.who,
        excites: this.state.excites,
        helps: this.state.help,
      }
      ).then(function (response) {
        history.replace('/calendar');
      })
    }
  }

  submitReview(e) {
    const { isAuthenticated } = this.props.auth;
    const { getAccessToken } = this.props.auth;
    if ( isAuthenticated()) {
      const headers = { 'Authorization': `Bearer ${getAccessToken()}`}
      axios.post(`${process.env.REACT_APP_USERS_SERVICE_URL}/submitreview`, { 
        stars: this.state.stars,
        comment: this.state.comment,
        discussion_id: this.props.location.search.slice(4),
      }, {headers}
      ).then(function (response) {
        this.setState({needReview: false, thanks: true})
      })
    }
  }

  ratingChanged(newRating){
    this.setState({stars: newRating})
  }

  changeValue(e, type) {
      const value = e.target.value;
      const next_state = {};
      next_state[type] = value;
      this.setState(next_state)
    }

  // var rand = myArray[Math.floor(Math.random() * myArray.length)];

  render() {
    const reviews = []
    if (this.state.reviews){
      for (let i of this.state.reviews){
        let image = "https://www.clker.com/cliparts/Z/j/o/Z/g/T/turquoise-anonymous-man-md.png"
        if (i.guest_initials){
          image = `https://ui-avatars.com/api/?name=${i.guest_initials.charAt(0)}+${i.guest_initials.charAt(1)}&rounded=true&background=${colors[Math.floor(Math.random() * colors.length)]}`
          console.log(image)
        }
        reviews.push(
          <ListItem
            primaryText = {i.comment}
            key={i.comment}
            leftAvatar = {<Avatar src={image} />}
            leftIcon={
              <div style={{float: 'right', margin: 'auto', position: 'inherit', width: 'auto'}}>
                <ReactStars
                  count={5}
                  size={24}
                  color2={'#ffd700'}
                  value={i.stars}
                  half={false}
                  edit={false}
                />
              </div>
            }
          />
        )
      }
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

    const title = `$${this.state.price} per half hour`
    const subtitle = `${Number(Math.round((this.state.price/this.state.etherPrice)+'e3')+'e-3')} Ether`
    if (this.state.notExpert){
      return(
      <div><h1>This user isn't a confimed expert yet</h1></div>
      )
    }

    return (
      <div style={{paddingBottom: '10px'}}>
      {this.state.thanks && (
        <h2>Thanks for your review!</h2>
      )}
      {this.state.needReview &&
        <Paper style={style}>
        <h2>Please leave a review!</h2>
        <div style={{display: 'flex', justifyContent: 'center'}}>
          <ReactStars
            count={5}
            onChange={(e) => this.ratingChanged(e)}
            size={24}
            color2={'#ffd700'}
            value={this.state.stars}
            half={false}
            style={{marginLeft: 'auto', marginRight: 'auto'}}
          />
        </div>
          <TextField
            floatingLabelText="Review"
            type="comment"
            onChange={(e) => this.changeValue(e, 'comment')}
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
              onClick={(e) => this.submitReview(e)}
            />
        </Paper>
      }
        <div id="cardStyle">
        
        {this.state.host && (
          <Card>
          
          

          <CardMedia
            style={{cursor:'pointer', }}
            overlay={<CardTitle title={this.state.host} subtitle={this.state.description} />}
            onClick={() => this.linkToProfile(this.state.other_profile)}
          >
          <div id="holdImage" style={{ maxWidth: 'inherit', minWidth: 'inherit'}}>
            <img src={this.state.image} alt={this.state.image}  style={{maxWidth: '100%'}} />
          </div>
          </CardMedia>
          
          

          <CardText>
            {this.state.who && (
              <div>
              <h3 id='q'> Who are you? </h3>
              <p id="answer">{this.state.who}</p>
              </div>
            )}
            {this.state.origin && (
              <div>
              <h3 id='q'> What is your crypto origin story?</h3>
              <p id="answer">{this.state.origin}</p>
              </div>
            )}
            {this.state.excites && (
              <div>
              <h3 id='q'> What excites you about blockchain technology?</h3>
              <p id="answer">{this.state.excites}</p>
              </div>
            )}
            {this.state.helps && (
              <div>
              <h3 id='q'> What can you help callers with?</h3>
              <p id="answer">{this.state.helps}</p>
              </div>
            )}
          </CardText>
          <CardTitle title={title} subtitle={subtitle} />
          <CardActions  style={{padding: '0px', marginRight: '-9px'}} >
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
                <RaisedButton fullWidth={true} primary={true} label="Contact" containerElement={<Link to={`/availability${this.props.location.search}`} />} />

              </div>
            )}
          </CardActions>
        </Card>

        )}
        {!this.state.host && (
            <CircularProgress size={80} thickness={5} /> 
        )}
        <Subheader inset={true} style={{paddingTop: '10px', lineHeight: 'inherit', paddingLeft: '0px'}}>This is an example profile while we prepare our first group of experts</Subheader>
        <div style ={{width: '100%', margin: "0 auto", textAlign: "center"}} >
      <Divider style={{marginTop: '80px'}}/>
          <h2 style={{paddingTop: '20px'}}>Are You an Expert?</h2>
          <RaisedButton
            containerElement={<Link to="/newProfile"  />}
            label="Become a Dimpull Expert"
            secondary={true}
            style={{marginTop: '10px', marginBottom: '10px'}}
            />
          <p style={{paddingTop: '15px'}}>If we think you're a good fit, we'll add you as a verified expert, so you can start connecting with crypto enthusiasts.</p>
        </div>

      </div>

      {this.state.reviews && 
        <div id="Reviews" style={{paddingTop: '30px'}}>
          <h1> Reviews </h1>
          <List>
          <Subheader>You can leave a review once you have a conversation with {this.state.host}.</Subheader>
          {reviews}
          </List>
        </div>
      }
            </div>
    );
  }
}

export default DiscussionProfile;