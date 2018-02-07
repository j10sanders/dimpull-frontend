import React, { Component } from 'react';
import {Link} from 'react-router-dom';
import AppBar from 'material-ui/AppBar';
import Drawer from 'material-ui/Drawer';
import MenuItem from 'material-ui/MenuItem';
import FlatButton from 'material-ui/FlatButton';

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
                    title={<img src='https://image.ibb.co/hgomGw/whiteblue.png' style={{ width: "120px", height: "auto"}} alt="logo"/>}
                        onLeftIconButtonClick={() => this.openNav()}
                    iconElementRight={
                        <Link to={'/'} >  <FlatButton label={<img src='https://image.ibb.co/bSKkj6/orange_magnet_48.png' style={{width: "40px",height: "auto"}} 
                            alt="logo"/>} id="home"/> 
                        </Link>
                    }
                />
            </header>
        );
    }
}