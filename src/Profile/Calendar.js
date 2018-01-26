import './calendar.css'
import React from 'react';
import moment from 'moment';
import ReactTimeslotCalendar from 'react-timeslot-calendar';
import RaisedButton from 'material-ui/RaisedButton';
import Paper from 'material-ui/Paper';
import axios from 'axios';
const _ = require("lodash");


class Calendar extends React.Component {
	constructor(props) {
	    super(props);
	    this.state = {
	      times:[]
	    };
  	}

	onSelectTimeslot(allTimeslots, lastSelectedTimeslot){
		// console.log(allTimeslots, "all",lastSelectedTimeslot)
  /**
   * All timeslot objects include `startDate` and `endDate`.
   * It is important to note that if timelots provided contain a single
   * value (e.g: timeslots = [['8'], ['9', '10']) then only `startDate` is filled up with
   * the desired information.
   */


   //I THINK I CAN JUST SAVE ALLTIMESLOTS TO STATE
	    let prevSelected = this.state.times
		if (!_.some(prevSelected, lastSelectedTimeslot)){
			prevSelected.push(lastSelectedTimeslot)
	   		this.setState({times: prevSelected})
		}else{
			let minusNew = prevSelected.filter((el) => el.startDate._d.getTime() !== lastSelectedTimeslot.startDate._d.getTime())
			this.setState({times: minusNew})
		}
	}

	componentWillMount() {
	    this.setState({ profile: {} });
	    const { userProfile, getProfile } = this.props.auth;
	    if (!userProfile) {
	      getProfile((err, profile) => {
	        this.setState({ profile });
	      });
	    } else {
	      this.setState({ profile: userProfile });
	    }
	  }

	 componentDidMount(){
	 	let defaultEnabled = document.querySelectorAll('.tsc-timeslot:not(.tsc-timeslot--disabled)')
	 	for (let i of defaultEnabled){
	 		console.log(moment(i.outerText))
	 	}

	 	// let endDate = moment('2018-01-13T17:00:00-05:00')
	 	// let startDate = moment('2018-01-13T16:00:00-05:00')
	 	// this.onSelectTimeslot([{endDate: {endDate}, startDate: startDate}], {endDate: endDate, startDate: startDate})
	 }

	submit(){
		axios.post(`${process.env.REACT_APP_USERS_SERVICE_URL}/api/savetimeslots`,
        {
        user_id: this.state.profile.sub,
        times: this.state.times,
    	})
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
		    <RaisedButton label="Submit Timeslots" fullWidth={true} primary={true}
		    	onClick={() => this.submit()}
		    />
		    </Paper>
		    
		    </div>
		    )}

          { !isAuthenticated() && (
            <div>
          	<Paper zDepth={2} id='paperCal'>
		    <ReactTimeslotCalendar
		      initialDate={moment().format()}
		      timeslots={timeslots}
		      onSelectTimeslot={this.onSelectTimeslot.bind(this)}
		      maxTimeslots={200}
		    />
		    <RaisedButton label="Submit Timeslots" fullWidth={true} primary={true}
		    	onClick={() => this.submit()}
		    />
		    </Paper>
		    </div>
		     )}
          
        </div>
	  );
	}
}

export default Calendar;