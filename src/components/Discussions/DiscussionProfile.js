import React from 'react';
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';
import FlatButton from 'material-ui/FlatButton';
import axios from 'axios';

class DiscussionProfile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      host: 'waiting...', 
      image: 'http://support.cashbackcloud.co/wp-content/uploads/2017/01/add-on-force-pending-referrals.png',
      description: 'waiting...',
      anonymous_phone_number: '+1-000-000-0000',
      }
    }

    componentDidMount(){
      console.log(this.props.location.search, "MOUNTED")
      axios.get(`${process.env.REACT_APP_USERS_SERVICE_URL}/conversations${this.props.location.search}`)
        .then((response) => 
          // console.log("GOT A RESPONSE", response)
          this.setState({host: response.data.host,
            image: response.data.image,
            description: response.data.description,
            anonymous_phone_number: response.data.anonymous_phone_number,
          }
          ))
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
    return (
      <div  style={cardStyle}>
        <Card>
        <CardHeader
          title={this.state.host}
          subtitle={this.state.description}
          avatar={this.state.image}
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
          <FlatButton label="Contact" onClick={console.log("CLICK")} />
          <FlatButton label="Save as favorite" />
        </CardActions>
      </Card>
    </div>
    );
  }
}

export default DiscussionProfile;