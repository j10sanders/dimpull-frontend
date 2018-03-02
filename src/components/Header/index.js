import React, { Component } from 'react';
import {Link} from 'react-router-dom';
import AppBar from 'material-ui/AppBar';
import Drawer from 'material-ui/Drawer';
import MenuItem from 'material-ui/MenuItem';
import FlatButton from 'material-ui/FlatButton';
import history from '../../history';
// import Divider from 'material-ui/Divider';
import './header.css';

export class Header extends Component {
    constructor(props) {
        super(props);
        this.state = {
            open: false,
        };

    }

    handleClickOutside() {
        this.setState({
            open: false,
        });
    }

    openNav() {
        this.setState({
            open: true,
        });
    }

    goHome(){
        history.push('/')
    }

    render() {
        return (
            <header>
                <Drawer open={this.state.open}
                    docked={false}
                    onRequestChange={(open) => this.setState({open})}>
                    <div>
                        <MenuItem 
                        containerElement={<Link to="/login" />}
                        onClick={() => this.setState({open: false})}
                        >
                            Register/Login
                        </MenuItem>
                        <MenuItem 
                        containerElement={<Link to="/discussions" />}
                        onClick={() => this.setState({open: false})}
                        >
                            View Discussion Profiles
                        </MenuItem>
                    </div>
                </Drawer>
                
                <AppBar
                    title={<img src='http://res.cloudinary.com/dtvc9q04c/image/upload/v1519823472/180124_DimpullLogo_Final2_Outlined_OldSchoolMagnet_White.png' style={{cursor:'pointer', width: "120px", height: "auto"}} alt="logo"/>}
                    onTitleClick={() => this.goHome()}
                    onLeftIconButtonClick={() => this.openNav()}
                    iconElementRight={
                        <Link to={'/'} >  <FlatButton label={<img src='http://res.cloudinary.com/dtvc9q04c/image/upload/v1519823675/orangemagnet-48.png' style={{width: "40px",height: "auto"}} 
                            alt="logo"/>} id="home"/> 
                        </Link>
                    }
                />
            </header>
        );
    }
}