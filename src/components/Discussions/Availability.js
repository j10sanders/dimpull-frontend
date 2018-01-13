import React from 'react';
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';
import FlatButton from 'material-ui/FlatButton';
import axios from 'axios';
import {Link} from 'react-router-dom';
import CircularProgress from 'material-ui/CircularProgress';


class Availability extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      }
    }

    componentDidMount(){
      axios.get(`${process.env.REACT_APP_USERS_SERVICE_URL}/api/gettimeslots${this.props.location.search}`)
        .then((response) => {
          console.log(response)
          }
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

export default Availability;