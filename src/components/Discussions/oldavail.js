import React from 'react';
// import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';
// import FlatButton from 'material-ui/FlatButton';
import axios from 'axios';
// import {Link} from 'react-router-dom';
import Paper from 'material-ui/Paper';
// import moment from 'moment';
import ReactTimeslotCalendar from 'react-timeslot-calendar';
// import CircularProgress from 'material-ui/CircularProgress';
// const _ = require("lodash");
var moment = require('moment-timezone');

class Availability extends React.Component {
  constructor(props) {
      super(props);
      this.state = {
        times: [],
        serverTimes: [],
        started: false,
      };
    }

    componentDidMount(){
      axios.get(`${process.env.REACT_APP_USERS_SERVICE_URL}/api/gettimeslots${this.props.location.search}`)
        .then((response) => {
          this.setState({serverTimes: response.data,}, () => {
            console.log(response)
            let lastElement = document.getElementsByClassName("tsc-timeslot")[document.getElementsByClassName("tsc-timeslot").length - 2]
            lastElement.click()
          })
        })
        .catch(function (error) {
          console.log(error)
        })
 
    }

    selectAvailable(allTimeslots, lastSelectedTimeslot){
      let allClone = allTimeslots.slice();
      this.setState({started: true}, () => {
        let clone = Object.assign({}, lastSelectedTimeslot)
        // let time = this.state.serverTimes[1]
        for (let time of this.state.serverTimes) {
          let mstime = moment(time.start_time).tz("America/New_York");
          let i = [moment(time.start_time).year(), moment(time.start_time).month(), moment(time.start_time).date()-1]
          let metime = moment(time.end_time).tz("America/New_York");;
          let ie = [moment(time.end_time).year(), moment(time.end_time).month(), moment(time.end_time).date()-1]
          clone.startDate['_d'] = mstime['_d'];
          clone.startDate['_i'] = i;
          clone.endDate['_d'] = metime['_d'];
          clone.endDate['_i'] = ie;
          allClone.push(clone);
          this.onSelectTimeslot(allClone, clone);
        }
      })
      // debugger;
      
    }

    onSelectTimeslot(allTimeslots, lastSelectedTimeslot){
      console.log(arguments, "arguments")
      debugger;
      console.log(allTimeslots, lastSelectedTimeslot)
      if (!this.state.started) {
        this.selectAvailable(allTimeslots, lastSelectedTimeslot)
      }
    // console.log(allTimeslots, "all",lastSelectedTimeslot)
  /**
   * All timeslot objects include `startDate` and `endDate`.
   * It is important to note that if timelots provided contain a single
   * value (e.g: timeslots = [['8'], ['9', '10']) then only `startDate` is filled up with
   * the desired information.
   */


   //I THINK I CAN JUST SAVE ALLTIMESLOTS TO STATE
    //   let prevSelected = this.state.times
    // if (!_.some(prevSelected, lastSelectedTimeslot)){
    //   prevSelected.push(lastSelectedTimeslot)
    //     this.setState({times: prevSelected})
    // }else{
    //   let minusNew = prevSelected.filter((el) => el.startDate._d.getTime() !== lastSelectedTimeslot.startDate._d.getTime())
    //   this.setState({times: minusNew})
    // }
  }


  render() {
    const { isAuthenticated } = this.props.auth;
    let timeslots = [
        ['1', '2'],
        ['2', '3'],
        ['3', '4'],
        ['4', '5'],
        ['5', '6'],
        ['6', '7'],
        ['7', '8'],
        ['8', '9'],
        ['9', '10'],
        ['10', '11'],
        ['11', '12'],
        ['12', '13'],
        ['13', '14'],
        ['14', '15'],
        ['15', '16'],
        ['16', '17'],
        ['17', '18'],
        ['18', '19'],
        ['19', '20'],
        ['20', '21'],
        ['21', '22'],
        ['22', '23'],
        ['24', '1'],
    ];
    return (
      <div>
      {isAuthenticated() && (
        <div>
          <Paper zDepth={2} style={{marginTop: '10px'}} >
            <ReactTimeslotCalendar
              initialDate={moment().format()}
              timeslots={timeslots}
              onSelectTimeslot={this.onSelectTimeslot.bind(this)}
              maxTimeslots={200}
            />
          </Paper>
        </div>
        )}
       { !isAuthenticated() && (
        <div>
          <Paper zDepth={2} style={{marginTop: '10px'}} >
            <ReactTimeslotCalendar
              initialDate={moment().format()}
              timeslots={timeslots}
              onSelectTimeslot={this.onSelectTimeslot.bind(this)}
              maxTimeslots={200}
            />
          </Paper>
        </div>
        )} 
        </div>
    );
  }
}

export default Availability;