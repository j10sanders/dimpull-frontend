import React from 'react';
import {GridList, GridTile} from 'material-ui/GridList';
import IconButton from 'material-ui/IconButton';
import Subheader from 'material-ui/Subheader';
import StarBorder from 'material-ui/svg-icons/toggle/star-border';
import axios from 'axios';
import {Link} from 'react-router-dom';
import CircularProgress from 'material-ui/CircularProgress';

const styles = {
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
  },
  gridList: {
    width: 500,
    overflowY: 'hidden',
  },
};

class MyDiscussions extends React.Component {
	constructor(props) {
    super(props);
    this.state = {dps: null,
    };
  }

  componentWillReceiveProps(nextProps){
    console.log(nextProps, "nextProps")
  }

	componentDidMount() {
    const { isAuthenticated } = this.props.auth;
    const { getAccessToken } = this.props.auth;
    if ( isAuthenticated()) {
      const headers = { 'Authorization': `Bearer ${getAccessToken()}`}
    	axios.get(`${process.env.REACT_APP_USERS_SERVICE_URL}/api/mydiscussions`, { headers })
        .then((response) => 
          this.setState({dps: response.data}))
        .catch(function (error) {
          console.log(error)
      })
    } 
	}

 render() {
  // const { isAuthenticated } = this.props.auth;
  const dps = this.state.dps
    return (
      <div>
    {dps !== "user has no discussion profiles" && (
      <div style={styles.root}>
    {this.state.dps && (
      <GridList
        cellHeight={180}
        id="GridlistID"
        style={styles.gridList}
      >
        <Subheader>Discussion Profiles</Subheader>
        {this.state.dps.map((dp) => (
          <Link to={`/discussionProfile?id=${dp.id}`} key={dp.id}>
          <GridTile
            key={dp.id}
            title={dp.description}
            subtitle={<span>by <b>{`${dp.first_name} ${dp.last_name}`}</b></span>}
            actionIcon={<IconButton><StarBorder color="white" /></IconButton>}
          >
            <img src={dp.image} alt={dp.id} />
          </GridTile>
          </Link>
        ))}
      </GridList>
      )}
        {!this.state.dps && (
          <CircularProgress size={80} thickness={5} /> 
        )}
    </div>
      )}
    
    {dps === "user has no discussion profiles" && (
      <div> <h1> You don't have any discussion profiles </h1></div>
    )}
    </div>
    );
  }
}

export default MyDiscussions;