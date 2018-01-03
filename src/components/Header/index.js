import React, { Component } from 'react';
import {Link} from 'react-router-dom';
import AppBar from 'material-ui/AppBar';
import Drawer from 'material-ui/Drawer';
import MenuItem from 'material-ui/MenuItem';
import FlatButton from 'material-ui/FlatButton';
// import Divider from 'material-ui/Divider';

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
                            Login
                        </MenuItem>
                        <MenuItem 
                        containerElement={<Link to="/register" />}
                        onClick={() => this.setState({open: false})}
                        >
                            Register
                        </MenuItem>
                    </div>
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