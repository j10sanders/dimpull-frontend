import React from 'react';
import moment from 'moment';
import ReactTimeslotCalendar from 'react-timeslot-calendar';

class Calendar extends React.Component {
	constructor(props) {
    super(props);
    this.state = {
      times:[]
    };
  }

  onSelectTimeslot(allTimeslots, lastSelectedTimeslot){
  /**
   * All timeslot objects include `startDate` and `endDate`.

   * It is important to note that if timelots provided contain a single
   * value (e.g: timeslots = [['8'], ['9', '10']) then only `startDate` is filled up with
   * the desired information.
   */
   let prevSelected = this.state.times
   prevSelected.push(lastSelectedTimeslot)
   this.setState({times: prevSelected})
   console.log(lastSelectedTimeslot.startDate); // MomentJS object.
   console.log(moment()._d < lastSelectedTimeslot.startDate)
   console.log(moment()._d, lastSelectedTimeslot.startDate._d)
}

	render() {
		const { isAuthenticated } = this.props.auth;
		console.log(this.state.times)
		let timeslots = [
		    ['1', '5'], 
		    ['6', '8'],
		    ['8', '10'],
		    ['10', '11'],
		    ['11', '12'],
		    ['12', '13'],
		    ['13', '14'],
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
	    <ReactTimeslotCalendar
	      initialDate={moment().format()}
	      timeslots={timeslots}
	      onSelectTimeslot={this.onSelectTimeslot.bind(this)}
	    />
	  );
	}
}

export default Calendar;