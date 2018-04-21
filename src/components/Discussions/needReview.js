import TextField from 'material-ui/TextField';
import Paper from 'material-ui/Paper';
import React from 'react';
import RaisedButton from 'material-ui/RaisedButton';
import axios from 'axios';
import ReactStars from 'react-stars';

const style = {
  margin: '0 auto',
  marginTop: '50px',
  paddingBottom: 50,
  paddingTop: '30px',
  width: '100%',
  textAlign: 'center',
  display: 'inline-block'
};

class NeedReview extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      comment: '',
      stars: 5,
      disabled: true,
      initials: ''
    };
  }

  isDisabled () {
    if (this.state.initials.length !== 2) {
      this.setState({
        disabled: true
      });
    } else {
      this.setState({
        disabled: false
      });
    }
  }

  submitReview (e) {
    const { isAuthenticated } = this.props.auth;
    const { getAccessToken } = this.props.auth;
    let headers = {};
    if (isAuthenticated()) {
      headers = { Authorization: `Bearer ${getAccessToken()}` };
    }
    axios.post(`${process.env.REACT_APP_USERS_SERVICE_URL}/submitreview`, {
      stars: this.state.stars,
      comment: this.state.comment,
      url: this.props.url,
      cid: this.props.cid,
      initials: this.state.initials
    }, { headers })
      .then(response => this.props.reviewed());
  }

  ratingChanged (newRating) {
    this.setState({ stars: newRating });
  }

  changeValue (e, type) {
    const nextState = {};
    nextState[type] = e.target.value;
    if (type === 'initials') {
      if (e.target.value.length > 2) {
        return;
      }
    }
    this.setState(nextState, () => {
      this.isDisabled();
    });
  }

  render () {
    return (
      <Paper style={style}>
        <h2>Please leave a review!</h2>
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <ReactStars
            count={5}
            onChange={e => this.ratingChanged(e)}
            size={24}
            color2={'#ffd700'}
            value={this.state.stars}
            half={false}
            style={{ marginLeft: 'auto', marginRight: 'auto' }}
          />
        </div>
        <TextField
          floatingLabelText="Review"
          type="comment"
          onChange={e => this.changeValue(e, 'comment')}
          multiLine
          rows={2}
          rowsMax={6}
          style={{ textAlign: 'start', width: '95%' }}
          fullWidth
        />
        <TextField
          value={this.state.initials}
          floatingLabelText="Initials"
          type="initials"
          onChange={e => this.changeValue(e, 'initials')}
          // style={{ textAlign: 'start', width: '95%' }}
        />
        <RaisedButton
          disabled={this.state.disabled}
          style={{ marginTop: 50 }}
          label="Submit"
          onClick={e => this.submitReview(e)}
        />
      </Paper>
    );
  }
}

export default NeedReview;
