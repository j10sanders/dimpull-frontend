import React from 'react';
import {GridList, GridTile} from 'material-ui/GridList';
import IconButton from 'material-ui/IconButton';
import StarBorder from 'material-ui/svg-icons/toggle/star-border';
import axios from 'axios';
import {Link} from 'react-router-dom';
import CircularProgress from 'material-ui/CircularProgress';
import RaisedButton from 'material-ui/RaisedButton';
import Divider from 'material-ui/Divider';
import Paper from 'material-ui/Paper';
import './landingpage.css';

const styles = {
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    width: '100%',
  },
  gridList: {
    // width: 600,
    maxWidth: '700px',
    maxHeight: '466px',
    height: 'inherit',
    textAlign: 'left',
    margin: '0 auto'
    // overflowY: 'hidden',
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
    return (
      <div style={{textAlign: 'center'}}>
      <section style={{paddingBottom: '35px'}} id="headerTop">
        <div className="row" id='headerRow'>
          <div className="col-sm-6">
          <div style={{maxWidth: '500px', margin: '0 auto', paddingBottom: '30px'}}>
            <h1 id='exchange'>Exchange your Crypto knowledge for ETH</h1>
      		  <h3 id='h3exchange' >Connect with those who are new to the crypto space, and get paid for your time. </h3>
            <h3 id='h3exchange'>Guarenteed by the Ethereum blockchain.</h3>
            <RaisedButton
              containerElement={<Link to="/discussions"  />}
              label="Meet the Experts"
              secondary={true}
              style={{marginTop: '60px', height: 'auto', lineHeight: '45px', display: 'flex', maxWidth:'230px', minWidth: '175px'}}
            />
          </div>
          
          </div>
          <div className="col-sm-6" id="colGrid">
          {this.state.dps && (
            <GridList
              id="GridlistID"
              style={styles.gridList}
              cols={2}
              padding={20}
              cellHeight={233}
            >
              
              {this.state.dps.map((dp) => (
                <Link to={`/discussionProfile?id=${dp.id}`} key={dp.id}>
                <GridTile
                  key={dp.id}
                  title={<span><b>{`${dp.first_name} ${dp.last_name}`}</b></span>}
                  subtitle={dp.description}
                  actionIcon={<IconButton></IconButton>}
                  
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
	  
    
      <div style={{backgroundColor: '#f7f7f7', marginTop: '100px', marginBottom: '100px'}}>
        <Divider style={{marginTop: '30px', marginBottom: '30px'}}/>
        <Paper id="help" zDepth={1}>
        <h2 id="howItWorks"> HOW IT WORKS </h2>
          <div className="row" id="helpRow">
            <div className="col-sm-3">
            <img src="http://res.cloudinary.com/dtvc9q04c/image/upload/v1519824000/Expert_Icon.png" alt={'expert'} id="imgWorks" />
              <h3 id='hHelp'>Find an Expert</h3>
              <p id="pHelp">Browse our roster to find a Crypto expert who matches your intrests and pricepoint.</p>
            </div>
            <div className="col-sm-3">
            <img src="http://res.cloudinary.com/dtvc9q04c/image/upload/v1519824000/Calendar_Icon.png" alt={'schedule'} id="imgWorks" />
              <h3 id='hHelp'>Schedule</h3>
              <p id="pHelp">Schedule your 30 minute call for a time that works for both parties</p>
            </div>
            <div className="col-sm-3">
            <img src="http://res.cloudinary.com/dtvc9q04c/image/upload/v1519824000/Phone_Icon.png" alt={'phone'} id="imgWorks" />
              <h3 id='hHelp'>Have a Conversation</h3>
              <p id="pHelp">Discuss your questions and seek advice during your one-on-one call.  Your privacy is protected: phone numbers are never shared.</p>
            </div>
            <div className="col-sm-3">
            <img src="http://res.cloudinary.com/dtvc9q04c/image/upload/v1519824000/ETHExhange_Icon.png" alt={'ether'} id="imgWorks" />
              <h3 id='hHelp'>Use the Blockchain</h3>
              <p id="pHelp">Payments are done exclusively in Ether.  Our smart-contract automatically initiates payment at the end of the call.</p>
            </div>

            
          </div>
        </Paper>
        <Divider style={{marginTop: '30px', marginBottom: '30px'}}/>
      </div>
      <h2 style={{marginBottom: '20px'}}> Are You an Expert? </h2>
      <p id='pRegister'> Register to become a dimpull expert. If we think you're a good fit, we'll add you to our roster of verified experts, 
      so you can start connecting with Crypto enthusiasts.</p>
      <RaisedButton
        containerElement={<Link to="/newProfile"  />}
        label="Create My Discussion Profile"
        secondary={true}
        style={{marginTop: '30px', marginBottom: '30px',height: 'auto', lineHeight: '45px', }}
        />
      
    </div>

    );

  }
}

export default Home;