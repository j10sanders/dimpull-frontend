import React from 'react';
import { GridList, GridTile } from 'material-ui/GridList';
import { Link, withRouter } from 'react-router-dom';
import Divider from 'material-ui/Divider';
import Paper from 'material-ui/Paper';
import PropTypes from 'prop-types';
import 'react-toastify/dist/ReactToastify.min.css';
import { AwesomeButton } from 'react-awesome-button';
import Carousel from 'nuka-carousel';
import smalleth from '../../utils/whiteeth.png';
import { DefaultProfiles, sliderList } from './DefaultProfiles';
import history from '../../history';
import './landingpage.css';

class H extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      dps: null
    };
  }

  // componentDidMount () {
  //   this.getExperts();
  // }

  // async getExperts () {
  //   const response = await axios.get(`${process.env.REACT_APP_USERS_SERVICE_URL}/api/discussions/home`);
  //   if (response.data) {
  //     this.setState({ dps: response.data.slice(0, 4) });
  //   }
  // }

  render () {
    let link = () => history.push('/newProfile');
    let label = 'Become a Dimpull Expert';
    const style = {
      fontSize: '18px', marginTop: '30px', height: 'auto', lineHeight: '50px', display: 'flex', minWidth: '190px', float: 'left', marginRight: '4px'
    };
    if (this.props.isAuthenticated && this.props.isexpert) {
      link = () => history.push('/profile');
      label = 'Edit Your Profile';
    }
    return (
      <div style={{ textAlign: 'center' }}>
        <div>
          <section id="headerTop">
            <div className="row" id="headerRow">
              <div className="col-sm-6">
                <div id="head">
                  <h1 id="exchange">Talk Before You Trade</h1>
                  <h3 id="h3exchange">Have a conversation with a blockchain expert</h3>
                  <h3 id="h3exchange" className="secondH3">Use Ethereum to book your call </h3>
                  {!this.props.isAuthenticated ? (
                    <AwesomeButton
                      type="primary"
                      action={link}
                      style={style}
                    >
                      {label}
                      <img id="ethimg" alt="ethimg" style={{ marginBottom: '4px', marginLeft: '6px' }} src={smalleth} />
                    </AwesomeButton>
                  ) : (
                    <AwesomeButton
                      type="primary"
                      action={link}
                      style={style}
                    >
                      {label}
                      <img id="ethimg" alt="ethimg" style={{ marginBottom: '4px', marginLeft: '6px' }} src={smalleth} />
                    </AwesomeButton>
                  )}
                  <div id="findAbove">
                    <AwesomeButton type="reddit" action={() => history.push('/experts')} style={{ fontSize: '18px', marginTop: '30px', height: 'auto', lineHeight: '50px', minWidth: '190px', float: 'left' }} >Find Your Expert</AwesomeButton>
                  </div>
                </div>
              </div>
              <div className="col-sm-6" id="colGrid">
                {this.state.dps ? (
                  <GridList
                    id="GridlistID"
                    // cols={2}
                    // padding={20}
                    // cellHeight={820}
                  >
                    {this.state.dps.map(dp => (
                      <Link to={`/expert/${dp.url}`} key={dp.url}>
                        <GridTile
                          key={dp.id}
                          title={<span><b>{`${dp.first_name} ${dp.last_name}`}</b></span>}
                          subtitle={dp.description}
                        >
                          <img src={dp.image} alt={dp.id} />
                        </GridTile>
                      </Link>
                    ))}
                  </GridList>
                ) : (
                  <div>
                    <div id="allFour">
                      <DefaultProfiles />
                    </div>
                    <div id="slider" >
                      <Carousel
                        // initialSlideHeight={450}
                        autoplay
                        autoplayInterval={5000}
                        wrapAround
                        // width="520px"
                        speed={800}
                      >
                        {sliderList.map(dp => (
                          <GridList
                            id="GridlistID"
                            cols={1}
                            key={dp.id}
                            // padding={20}
                            // cellHeight={220}
                          >
                            <Link to={`/expert/${dp.url}`} key={dp.url} style={{ height: 'auto' }} >
                              <GridTile
                                key={dp.id}
                                title={<span><b>{`${dp.first_name} ${dp.last_name}`}</b></span>}
                                subtitle={dp.description}
                                style={{ height: 405, width: '540px', margin: '0px auto' }}
                              >
                                <img src={dp.image} alt={dp.id} />
                              </GridTile>
                            </Link>

                          </GridList>
                        ))}
                      </Carousel>
                    </div>
                    <div id="findBelow">
                      <AwesomeButton type="reddit" action={() => history.push('/experts')} style={{ fontSize: '18px', marginTop: '40px', height: 'auto', lineHeight: '50px', minWidth: '190px', width: '10%' }} >Find Your Expert</AwesomeButton>
                    </div>
                  </div>
                )}
              </div>

            </div>
          </section>
          <div style={{ backgroundColor: '#f7f7f7', marginTop: '48px', marginBottom: '100px' }}>
            <Divider style={{ marginTop: '30px', marginBottom: '30px' }} />
            <Paper id="help" zDepth={1}>
              <h2 id="howItWorks"> HOW IT WORKS </h2>
              <div className="row" id="helpRow">
                <div className="col-sm-3">
                  <img src="https://res.cloudinary.com/dtvc9q04c/image/upload/c_scale,h_256/v1519824000/Expert_Icon.png" alt="expert" id="imgWorks" />
                  <h3 id="hHelp">Find an Expert</h3>
                  <p id="pHelp">
                    Browse our roster to find a crypto expert who matches your interests
                  </p>
                </div>
                <div className="col-sm-3">
                  <img src="https://res.cloudinary.com/dtvc9q04c/image/upload/c_scale,h_256/v1519824000/Calendar_Icon.png" alt="schedule "id="imgWorks" />
                  <h3 id="hHelp">Schedule</h3>
                  <p id="pHelp">Schedule call with an expert</p>
                </div>
                <div className="col-sm-3">
                  <img src="https://res.cloudinary.com/dtvc9q04c/image/upload/c_scale,h_256/v1519824000/Phone_Icon.png" alt="phone" id="imgWorks" />
                  <h3 id="hHelp">Have a Conversation</h3>
                  <p id="pHelp">Get one-on-one personalized advice</p>
                </div>
                <div className="col-sm-3">
                  <img src="https://res.cloudinary.com/dtvc9q04c/image/upload/c_scale,h_256/v1519824000/ETHExhange_Icon.png" alt="ether"id="imgWorks" />
                  <h3 id="hHelp">Use the Blockchain</h3>
                  <p id="pHelp">Our smart-contract holds Ether payments until the end of the call</p>
                </div>
              </div>
              <div style={{ fontSize: '19px', paddingTop: '12px' }} ><Link to="/faq">See the Full FAQs</Link></div>
            </Paper>
            <Divider style={{ marginTop: '30px', marginBottom: '30px' }} />
          </div>
          {this.props.isexpert ? (
            <div>
              <h2 style={{ marginBottom: '20px' }}> How to get more calls: </h2>
              <p id="pRegister"> Share your profile link on your homepage, LinkedIn, and Twitter.  Find more tips in your profile settings page:
              </p>
              <AwesomeButton type="primary" action={() => history.push('/profile')} style={{ fontSize: '18px', marginTop: '30px', marginBottom: '30px', height: 'auto', lineHeight: '45px' }} >Settings</AwesomeButton>
            </div>)
            : (
              <div>
                <h2 style={{ marginBottom: '20px' }}> Are You an Expert? </h2>
                <p id="pRegister"> Register to become a dimpull expert. If we think you're a good fit, we'll add you to our roster of verified experts, 
                  so you can start connecting with crypto enthusiasts.
                </p>
                {!this.props.isAuthenticated && (
                  <AwesomeButton type="reddit" action={() => this.props.auth.login('/newProfile')} style={{ fontSize: '18px', marginTop: '30px', marginBottom: '30px', height: 'auto', lineHeight: '45px' }} >Become a Dimpull Expert</AwesomeButton>
                )}
                {this.props.isAuthenticated && (
                  <AwesomeButton type="reddit" action={() => history.push('/newProfile')} style={{ fontSize: '18px', marginTop: '30px', marginBottom: '30px', height: 'auto', lineHeight: '45px' }} >Become a Dimpull Expert</AwesomeButton>
                )}
              </div>
            )}
        </div>
      </div>
    );
  }
}

H.propTypes = {
  auth: PropTypes.shape({
    isAuthenticated: PropTypes.func,
    getAccessToken: PropTypes.func,
    login: PropTypes.func
  })
};

H.defaultProps = {
  auth: PropTypes.object
};

const Home = withRouter(H);
export default Home;
