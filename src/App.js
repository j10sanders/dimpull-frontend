import getMuiTheme from 'material-ui/styles/getMuiTheme';
import React from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import './App.css';
import Routes from './routes';
import { Footer } from './components/Footer';

require('bootstrap-webpack');

const styles = {
  container: {
    textAlign: 'center',
    paddingTop: 200
  }
};

const muiTheme = getMuiTheme({
  palette: {
    primary1Color: '#268bd2',
    accent1Color: '#ff6235'
  }
});

function App (props) {
  return (
    <div id="othersection">
      <MuiThemeProvider muiTheme={muiTheme} style={styles}>
        <section id="section">
          <Routes />
        </section>
      </MuiThemeProvider>
      <Footer />
    </div>
  );
}

export default App;
