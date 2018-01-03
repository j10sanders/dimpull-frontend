import React from 'react';
import './App.css';
import darkBaseTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import Routes from './routes';

import { Footer } from './components/Footer';


class App extends React.Component {
    constructor(props) {
        super(props);
    }

    componentWillReceiveProps(nextProps){
        console.log(nextProps, "NEXTPROPS")
    }

    render() {
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
