import TextField from 'material-ui/TextField';
import Paper from 'material-ui/Paper';
import React from 'react';
import RaisedButton from 'material-ui/RaisedButton';
import axios from 'axios';
import ReactStars from 'react-stars';

const style = {
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
      stars: 5
    };
  }

  submitReview (e) {
    const { isAuthenticated } = this.props.auth;
    const { getAccessToken } = this.props.auth;
    if (isAuthenticated()) {
      const headers = { 'Authorization': `Bearer ${getAccessToken()}`}
      axios.post(`${process.env.REACT_APP_USERS_SERVICE_URL}/submitreview`, {
        stars: this.state.stars,
        comment: this.state.comment,
        discussion_id: this.props.discussion_id
      }, { headers })
        .then(response => this.props.reviewed());
    }
  }

  ratingChanged (newRating) {
    this.setState({ stars: newRating });
  }

  changeValue (e, type) {
    const nextState = {};
    nextState[type] = e.target.value;
    this.setState(nextState);
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
          multiLine={true}
          rows={2}
          rowsMax={6}
          style={{ textAlign: 'start', width: '95%' }}
          fullWidth={true}
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
