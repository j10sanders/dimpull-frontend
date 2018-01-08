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
      console.log(this.props.location.search, "MOUNTED")
      axios.get(`${process.env.REACT_APP_USERS_SERVICE_URL}/discussion${this.props.location.search}`)
        .then((response) => 
          this.setState({host: `${response.data.first_name} ${response.data.last_name}`,
            image: response.data.image,
            auth_image: response.data.auth_pic,
            description: response.data.description,
            anonymous_phone_number: response.data.anonymous_phone_number,
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
    debugger;
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
          <Link to={`/requestConversation${this.props.location.search}`}> <FlatButton label="Contact" /> </Link>
          <FlatButton label="Save as favorite" />
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