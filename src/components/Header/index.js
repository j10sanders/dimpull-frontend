import React, { Component } from 'react';
import {Link} from 'react-router-dom';
// import { connect } from 'react-redux';
// import { bindActionCreators } from 'redux';
import AppBar from 'material-ui/AppBar';
import Drawer from 'material-ui/Drawer';
import MenuItem from 'material-ui/MenuItem';
import FlatButton from 'material-ui/FlatButton';
import Divider from 'material-ui/Divider';
import { LoginPage } from '../../LoginPage';
// import { RegisterPage } from '../../RegisterPage';
// import { withRouter } from 'react-router-dom'

// import * as actionCreators from '../../actions/auth';

// function mapStateToProps(state) {
//     return {
//         token: state.auth.token,
//         userName: state.auth.userName,
//         isAuthenticated: state.auth.isAuthenticated,
//     };
// }

// function mapDispatchToProps(dispatch) {
//     return bindActionCreators(actionCreators, dispatch);
// }

// @connect(mapStateToProps, mapDispatchToProps)
export class Header extends Component {
    constructor(props) {
        super(props);
        this.state = {
            open: false,
        };

    }

    dispatchNewRoute(route) {
        // browserHistory.push(route);
        this.setState({
            open: false,
        });

    }


    handleClickOutside() {
        this.setState({
            open: false,
        });
    }


    logout(e) {
        e.preventDefault();
        this.props.logoutAndRedirect();
        this.setState({
            open: false,
        });
    }

    openNav() {
        this.setState({
            open: true,
        });
    }

    render() {
        return (
            <header>
                <Drawer open={this.state.open}
                 docked={false}
                onRequestChange={(open) => this.setState({open})}>
                    {
                        !this.props.isAuthenticated ?
                            <div>
                                <MenuItem 
                                containerElement={<Link to="/login" />}
                                >
                                    Login
                                </MenuItem>
                                <MenuItem 
                                containerElement={<Link to="/register" />}
                                >
                                    Register
                                </MenuItem>
                            </div>
                            :
                            <div>
                                <MenuItem onClick={() => this.dispatchNewRoute('/analytics')}>
                                    Analytics
                                </MenuItem>
                                <Divider />

                                <MenuItem onClick={(e) => this.logout(e)}>
                                    Logout
                                </MenuItem>
                            </div>
                    }
                </Drawer>
                
                <AppBar
                  title="Dimpull"
                  onLeftIconButtonClick={() => this.openNav()}
                  iconElementRight={
                    <Link to={'/'} >  <FlatButton label="Home" /> </Link>
                    }
                />
            </header>
        );
    }
}

// Header.propTypes = {
//     logoutAndRedirect: React.PropTypes.func,
//     isAuthenticated: React.PropTypes.bool,
// };
