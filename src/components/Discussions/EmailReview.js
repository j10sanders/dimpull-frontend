import React from 'react';
import ReactStars from 'react-stars';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import Divider from 'material-ui/Divider';
import CircularProgress from 'material-ui/CircularProgress';
import { Link } from 'react-router-dom';
import axios from 'axios';
import history from '../../history';
import ProfileCard from './ProfileCard';
import './discussionprofile.css';

class EmailReview extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      waiting: true
    };
  }

  componentDidMount () {
    this.getURL();
  }

  async getURL () {
    const pathName = this.props.location.pathname;
    const dpid = pathName.match(/\/([^\/]+)\/?$/)[1];
    const url = await axios.get(`${process.env.REACT_APP_USERS_SERVICE_URL}/urlFromDPID${dpid}`); // TODO: make this path
    if (url.data !== 'invalid') {
      this.getDiscission(url);
    } // TODO: error handling
  }

  async getDiscussion (url) {
    const dp = axios.get(`${process.env.REACT_APP_USERS_SERVICE_URL}/expert/${url}`);
    if (dp.data === 'not an expert yet') {
      this.setState({ notExpert: true });
    } else if (dp.data === 'does not exist') {
      this.setState({ nonExistant: true });
      return;
    } else if (dp.data === 'editProfile') {
      history.push(`/editProfile`);
    } else if (dp.data === 404) {
      this.setState({ four0four: true });
      return;
    }
    this.setState({
      host: `${dp.data.first_name} ${dp.data.last_name}`,
      image: dp.data.image,
      description: dp.data.description,
      is_users: dp.data.is_users,
      // price: dp.data.price,
      needReview: dp.data.needReview,
      origin: dp.data.origin,
      who: dp.data.who,
      excites: dp.data.excites,
      helps: dp.data.helps,
      linkedin: dp.data.linkedin,
      medium: dp.data.medium,
      twitter: dp.data.twitter,
      github: dp.data.github,
      dp: dp.data.id
    });
    this.setState({ waiting: false });
  }

  handleOpen () {
    this.setState({ open: true });
  }

  handleClose () {
    this.setState({ open: false });
  }

  getEmail () {
    this.setState({ emailOpen: true });
  }

  emailClose () {
    this.setState({ emailOpen: false });
  }

  changeEmail (e) {
    this.setState({ email: e.target.value });
  }

  async submitEmail () {
    try {
      await axios.post(`${process.env.REACT_APP_USERS_SERVICE_URL}/addemail`, {
        email: this.state.email
      });
    } catch (err) {
      this.emailClose();
    }
    this.emailClose();
  }

  linkToProfile (profile){
    // window.open(
    //   profile,
    //   '_blank' // <- This is what makes it open in a new window.
    // );
    //commented out because we don't need to link in seed profiles.
  return;
  }

  reviewed () {
    this.setState({ needReview: false, thanks: true });
  }

  render () {
    if (this.state.nonExistant) {
      return <div> {"That profile doesn't exist"} </div>;
    }

    const ok = [
      <FlatButton
        label="No Thanks"
        primary
        onClick={() => this.emailClose()}
      />,
      <FlatButton
        label="Submit"
        primary
        onClick={() => this.submitEmail()}
      />
    ];

    if (this.state.notExpert) {
      return (
        <div id="unconfirmed">
          <h1>This user isn't a confimed expert yet...</h1>
        </div>
      );
    }

    if (this.state.four0four) {
      return <div>404 - this page does not exist</div>;
    }

    return (
      <div style={{ paddingBottom: '10px' }}>
        {this.state.thanks && (
          <h2>Thanks for your review!</h2>
        )}
        {this.state.needReview &&
          <NeedReview
            reviewed={() => this.reviewed()}
            discussion_id={this.props.location.search.slice(4)}
            auth={this.props.auth}
          />
        }
        {this.state.waiting ? <CircularProgress size={80} thickness={5} /> : (
          <ProfileCard
            host={this.state.host}
            description={this.state.description}
            image={this.state.image}
            who={this.state.who}
            origin={this.state.origin}
            excites={this.state.excites}
            helps={this.state.helps}
            open={this.state.open}
            search={this.props.location.search}
            name={this.props.location.pathname.split('/').pop().trim()} // get the last part of expert/jon
            handleClose={() => this.handleClose()}
            deleteProfile={() => this.deleteProfile()}
            otherProfile={this.state.otherProfile}
            linkToProfile={() => this.linkToProfile()}
            is_users={this.state.is_users}
            dp={this.state.dp}
            handleOpen={() => this.handleOpen()}
            getEmail={() => this.getEmail()}
            emailOpen={this.state.emailOpen}
            emailClose={() => this.emailClose()}
            email={this.state.email}
            changeEmail={e => this.changeEmail(e)}
            ok={ok}
            linkedin={this.state.linkedin}
            github={this.state.github}
            twitter={this.state.twitter}
            medium={this.state.medium}
          />
        )}
      </div>
    );
  }
}

export default EmailReview;
