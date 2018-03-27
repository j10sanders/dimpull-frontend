import React, { Component } from 'react';
import {Link} from 'react-router-dom';
import AppBar from 'material-ui/AppBar';
import Drawer from 'material-ui/Drawer';
import MenuItem from 'material-ui/MenuItem';
import FlatButton from 'material-ui/FlatButton';
import history from '../../history';
// import Divider from 'material-ui/Divider';
import './header.css';

class Header extends Component {
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
                            Meet the Experts
                        </MenuItem>
                    </div>
                </Drawer>
                
                <AppBar style={{position: "fixed" }}
                    title={<img src='https://res.cloudinary.com/dtvc9q04c/image/upload/v1520111213/dimpullgif.gif' style={{cursor:'pointer', width: "120px", height: "auto", imageRendering: 'crisp-edges'}} alt="logo"/>}
                    onTitleClick={() => this.goHome()}
                    onLeftIconButtonClick={() => this.openNav()}
                    iconElementRight={
                        <Link to={'/'} >  <FlatButton label={<img src='https://res.cloudinary.com/dtvc9q04c/image/upload/v1519823675/orangemagnet-48.png' style={{width: "40px",height: "auto"}} 
                            alt="logo"/>} id="home"/> 
                        </Link>
                    }
                />
            </header>
        );
    }
}

export default Header;