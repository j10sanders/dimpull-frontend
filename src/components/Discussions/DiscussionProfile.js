import React from 'react';
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';
import FlatButton from 'material-ui/FlatButton';
import axios from 'axios';
import {Link} from 'react-router-dom';
import CircularProgress from 'material-ui/CircularProgress';


class DiscussionProfile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      }
    }

    componentDidMount(){
      const { isAuthenticated } = this.props.auth;
      const { getAccessToken } = this.props.auth;
      let headers = {}
      if ( isAuthenticated()) {
        headers = { 'Authorization': `Bearer ${getAccessToken()}`}
      }
        axios.get(`${process.env.REACT_APP_USERS_SERVICE_URL}/discussion${this.props.location.search}`, {headers})
          .then((response) => 
            this.setState({host: `${response.data.first_name} ${response.data.last_name}`,
              image: response.data.image,
              auth_image: response.data.auth_pic,
              description: response.data.description,
              anonymous_phone_number: response.data.anonymous_phone_number,
              is_users: response.data.is_users,
            })
            )
          .catch(function (error) {
            console.log(error)
        })

    }

  render() {
    var cardStyle = {
    display: 'block',
    width: '30vw',
    transitionDuration: '0.3s',
    height: '45vw',
    margin: 'auto',
    }
    console.log(this.state)
    console.log(this.props.location)
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
          overlay={<CardTitle title="Overlay title" subtitle="Overlay subtitle" />}
        >
          <img src={this.state.image} alt="" />
        </CardMedia>
        <CardTitle title={this.state.host} subtitle={this.state.anonymous_phone_number} />
        <CardText>
          {this.state.description}
        </CardText>
        <CardActions>
          {this.state.is_users && (
            <FlatButton label="Edit Profile" containerElement={<Link to={`/availability${this.props.location.search}`} />} />
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