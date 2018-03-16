import getMuiTheme from 'material-ui/styles/getMuiTheme';
// import baseTheme from 'material-ui/styles/baseThemes/lightBaseTheme';
// import * as Colors from 'material-ui/styles/colors';
// import { fade } from 'material-ui/utils/colorManipulator'
import React from 'react';
import './App.css';
// import darkBaseTheme from 'material-ui/styles/getMuiTheme';
// import {deepOrange500} from 'material-ui/styles/colors';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import Routes from './routes';
import { Footer } from './components/Footer';

require('bootstrap-webpack');


const styles = {
  container: {
    textAlign: 'center',
    paddingTop: 200,
  },
};

const muiTheme = getMuiTheme({
  palette: {
    primary1Color: "#268bd2",
    accent1Color: "#ff6235"
  },
});


class App extends React.Component {
    
    // <Footer />

    render() {
        return (
            <div id="othersection">
            <MuiThemeProvider muiTheme={muiTheme} style={styles}>
                <section id='section'>
                    <Routes />
                </section>
            </MuiThemeProvider>
            <Footer />
            </div>
        );
    }
}

export default App;
