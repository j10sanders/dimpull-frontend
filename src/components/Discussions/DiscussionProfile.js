import React from 'react';
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';
import FlatButton from 'material-ui/FlatButton';
import axios from 'axios';
// import { browserHistory } from 'react-router';

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
      // this.setState({host: this.props.location.search.host,
      //       image: this.props.location.search.image,
      //       description: this.props.location.search.description
      //     })
    }


  render() {
    console.log(this.props)
    return (
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
  );
}

}

export default DiscussionProfile;