import React from 'react';
import {GridList, GridTile} from 'material-ui/GridList';
import IconButton from 'material-ui/IconButton';
import Subheader from 'material-ui/Subheader';
import StarBorder from 'material-ui/svg-icons/toggle/star-border';
import axios from 'axios';
import {Link} from 'react-router-dom';
import CircularProgress from 'material-ui/CircularProgress';
import RaisedButton from 'material-ui/RaisedButton';
import FontIcon from 'material-ui/FontIcon';
import SvgIcon from 'material-ui/SvgIcon';
import Divider from 'material-ui/Divider';
import Paper from 'material-ui/Paper';
import './landingpage.css';

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
    // width: 600,
    overflowY: 'hidden',
  },
};

class Home extends React.Component {
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
  	      this.setState({dps: response.data.slice(0,4)}))
  	    .catch(function (error) {
  	      console.log(error)
  	  })
    }else{
      axios.get(`${process.env.REACT_APP_USERS_SERVICE_URL}/api/discussions`)
       .then((response) => 
          this.setState({dps: response.data.slice(0,4)}))
        .catch(function (error) {
          console.log(error)
      })
    }

    };

 render() {
  //<Subheader>Discussion Profiles</Subheader>
  // const { isAuthenticated } = this.props.auth;\
  // let Header = [<h1> Discussion Profiles </h1>]
  // const { isAuthenticated } = this.props.auth;
  //   const { getAccessToken } = this.props.auth;
  //   if ( isAuthenticated()) {
  //     Header = <Home />
  //   }
    return (
      <div style={{textAlign: 'center'}}>
      <section style={{paddingBottom: '35px', paddingTop: '70px'}}>
        <div className="row">
          <div className="col-sm-6">
          <div style={{width: '500px', margin: '0 auto'}}>
            <h1 style={{fontSize: '55px', paddingTop: '20px'}}>Exchange your Crypto knowledge for ETH</h1>
      		  <h3 style={{fontSize: '20px', color:'black'}}>Connect with those who are new to the crypto scene, and get paid for your time. </h3><h3 style={{fontSize: '20px', color:'black'}}>Guarenteed by the Ethereum blockchain.</h3>
          </div>
          </div>
          <div className="col-sm-6">
          {this.state.dps && (
            <GridList
              cellHeight={180}
              id="GridlistID"
              style={styles.gridList}
              cols={2}
            >
              
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
        </div>
    </section>
	  
    <RaisedButton
      containerElement={<Link to="/discussions"  />}
      label="See More Expert Profiles"
      secondary={true}
      style={{marginTop: '40px'}}
      />
      <div style={{backgroundColor: '#f2faff', marginTop: '100px', marginBottom: '100px'}}>
        <Divider style={{marginTop: '30px', marginBottom: '30px'}}/>
        <Paper style={{marginLeft: '140px', marginRight: '140px', marginTop: '50px', marginBottom: '50px', paddingTop: '30px', paddingBottom: '30px', paddingLeft: '90px', paddingRight: '90px'}} zDepth={1}>
          <div className="row">
            <div className="col-sm-4">
              <h2 style={{paddingBottom: '10px', paddingTop: '10px'}}> How it Works</h2>
              <img src='https://image.ibb.co/bSKkj6/orange_magnet_48.png' />
            </div>
            <div className="col-sm-6" style={{width: '66%'}}>
              <p id="leftalign">Dimpull is a platform for crypto traders of all backgrounds to have 30 minute phone calls with experts in the community.</p>
              <p id="leftalign">Traders should expect to learn more about the space, and refine trading/investment strategies through conversations.</p>
              <p id="leftalign">Nobody's phone number gets shared with the other party, and you can choose to remain anonymous if that's important to you.</p>
              <p id="leftalign">Because payments are in Ether, experts don't have to trust anyone. Our smart contract initiates payment at the close of a call.</p>
            </div>
          </div>
        </Paper>
        <Divider style={{marginTop: '30px', marginBottom: '30px'}}/>
      </div>
      <h2 style={{marginBottom: '20px'}}> Are You an Expert? </h2>
      <RaisedButton
        containerElement={<Link to="/newProfile"  />}
        label="Create a Discussion Profile"
        secondary={true}
        style={{marginTop: '10px', marginBottom: '10px'}}
        />
      <p style={{paddingTop: '25px', fontSize:'17px'}}> If we think you're a good fit, we'll add you as a verified expert, so you can start connecting with crypto enthusiasts.</p>
    </div>

    );

  }
}

export default Home;