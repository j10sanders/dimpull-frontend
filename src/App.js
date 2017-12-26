import React, { Component } from 'react';
// import logo from './logo.svg';
import './App.css';

import PropTypes from 'prop-types';
import darkBaseTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

/* application components */
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import Routes from './routes';

class App extends Component {
static propTypes = {
        children: PropTypes.node,
    };

    render() {
        return (
            <MuiThemeProvider muiTheme={darkBaseTheme()}>
                <section>
                    <Header />
                    <div
                      className="container"
                      style={{ marginTop: 10, paddingBottom: 250 }}
                    >
                        <Routes />
                    </div>
                    <div>
                        <Footer />
                    </div>
                </section>
            </MuiThemeProvider>
        );
    }
}

export default App;
