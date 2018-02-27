import React from 'react';
import {GridList, GridTile} from 'material-ui/GridList';
import IconButton from 'material-ui/IconButton';
import Subheader from 'material-ui/Subheader';
import StarBorder from 'material-ui/svg-icons/toggle/star-border';
import axios from 'axios';
import {Link} from 'react-router-dom';
import CircularProgress from 'material-ui/CircularProgress';
import { Home } from '../../components/Home';
import RaisedButton from 'material-ui/RaisedButton';
import FontIcon from 'material-ui/FontIcon';
import SvgIcon from 'material-ui/SvgIcon';
import Divider from 'material-ui/Divider';
import Paper from 'material-ui/Paper';
// import './landingpage.css';

// const HomeIcon = (props) => (
//   <SvgIcon {...props}>
//     <path d="M100.1 72L64 93.7 27.9 72c-.8-.5-1.9-.3-2.5.4-.6.7-.7 1.7-.2 2.5l37.2 52.2.1.1c.1.1.1.2.2.2l.1.1c.1.1.2.1.2.2 0 0 .1 0 .1.1.1 0 .2.1.3.1h.1c.1 0 .3.1.4.1.2 0 .3 0 .4-.1h.1c.1 0 .2-.1.3-.1 0 0 .1 0 .1-.1.1 0 .2-.1.2-.2l.1-.1.2-.2.1-.1 37.2-52.2c.5-.8.5-1.8-.2-2.5s-1.4-.8-2.3-.4zM62 97.1v22.6L34 80.4l28 16.7zm4 22.6V97.1l28-16.8-28 39.4z"/>
//   </SvgIcon>
// );

const styles = {
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    width: '100%',
  },
  gridList: {
    width: 800,
    overflowY: 'hidden',
  },
};

class Discussions extends React.Component {
	constructor(props) {
    super(props);
    this.state = {dps: null,
                  };
  }

  componentWillReceiveProps(nextProps){
    console.log(nextProps, "nextProps")
  }

  componentDidMount(){
    console.log("mounted", process.env.REACT_APP_USERS_SERVICE_URL)
    const { isAuthenticated } = this.props.auth;
    const { getAccessToken } = this.props.auth;
    if ( isAuthenticated()) {
      const headers = { 'Authorization': `Bearer ${getAccessToken()}`}
    	axios.get(`${process.env.REACT_APP_USERS_SERVICE_URL}/api/discussions`, { headers })
  	   .then((response) => 
  	      this.setState({dps: response.data}))
  	    .catch(function (error) {
  	      console.log(error)
  	  })
    }else{
      axios.get(`${process.env.REACT_APP_USERS_SERVICE_URL}/api/discussions`)
       .then((response) => 
          this.setState({dps: response.data}))
        .catch(function (error) {
          console.log(error)
      })
    }
  };

 render() {
    return (
      <div style={{textAlign: 'center'}}>
        <h1> Discussion Profiles </h1>
        <div style={styles.root}>
        {this.state.dps && (
    	    <GridList
    	      cellHeight={180}
            id="GridlistID"
    	      style={styles.gridList}
            cols={3}
    	    >
          <Subheader>These are placeholder profiles, while we vet our first experts!</Subheader>
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
      </div>
      <Divider style={{marginTop: '80px'}}/>
          <h2 style={{paddingTop: '20px'}}> Are You an Expert? </h2>
          <RaisedButton
            containerElement={<Link to="/newProfile"  />}
            label="Create a Discussion Profile"
            secondary={true}
            style={{marginTop: '10px', marginBottom: '10px'}}
            />
          <p style={{paddingTop: '15px'}}> If we think you're a good fit, we'll add you as a verified expert, so you can start connecting with crypto enthusiasts.</p>
    </div>
    );
  }
}

export default Discussions;