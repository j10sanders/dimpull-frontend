import React from 'react';
import './App.css';
import darkBaseTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import Routes from './routes';
import { Footer } from './components/Footer';

require('bootstrap-webpack');

class App extends React.Component {
    
    componentWillReceiveProps(nextProps){
        console.log(nextProps, "NEXTPROPS")
    }

    render() {
        return (
            <MuiThemeProvider muiTheme={darkBaseTheme()}>
                <section id='section'>
                    <Routes />
                    <Footer />
                </section>
            </MuiThemeProvider>
        );
    }
}

export default App;
