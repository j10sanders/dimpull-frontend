import React, { Component } from 'react';
import './App.css';
import darkBaseTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import Routes from './routes';
import { connect } from 'react-redux';
import { history } from './_helpers';
import { alertActions } from './_actions';
import { PrivateRoute } from './_components';

/* application components */

import { Header } from './components/Header';
import { Footer } from './components/Footer';

class App extends React.Component {
    constructor(props) {
        super(props);

        const { dispatch } = this.props;
        history.listen((location, action) => {
            // clear alert on location change
            dispatch(alertActions.clear());
        });
    }

    componentWillReceiveProps(nextProps){
        console.log(nextProps, "NEXTPROPS")
    }

    shouldComponentUpdate(){
        debugger;
    }

    render() {
        const { alert } = this.props;
        return (
            <MuiThemeProvider muiTheme={darkBaseTheme()}>
                <section>
                    <div
                      className="container"
                      style={{ paddingBottom: 250 }}
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
