import './calendar.css'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import 'react-big-calendar/lib/addons/dragAndDrop/styles.less'
import React from 'react';
import moment from 'moment';
// import HTML5Backend from 'react-dnd-html5-backend'
// import { DragDropContext } from 'react-dnd'
import BigCalendar from 'react-big-calendar'
import withDragAndDrop from 'react-big-calendar/lib/addons/dragAndDrop'
import RaisedButton from 'material-ui/RaisedButton';
import Paper from 'material-ui/Paper';
import axios from 'axios';
import history from '../history';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import Snackbar from 'material-ui/Snackbar';
import CircularProgress from 'material-ui/CircularProgress';

BigCalendar.setLocalizer(BigCalendar.momentLocalizer(moment))
const DragAndDropCalendar = withDragAndDrop(BigCalendar)

class Calendar extends React.Component {
	    constructor(props) {
	    super(props)
	    this.state = {
	      events: [], 
	      open: false,
	      event: '',
	      snackOpen: false,
        waiting: true,
	    }
    this.moveEvent = this.moveEvent.bind(this)
  }

  moveEvent({ event, start, end }) {
    const { events } = this.state
    const idx = events.indexOf(event)
    const updatedEvent = { ...event, start, end }
    const nextEvents = [...events]
    nextEvents.splice(idx, 1, updatedEvent)
    this.setState({
      events: nextEvents,
    })
    // alert(`${event.title} was dropped onto ${event.start}`)
  }

  resizeEvent = (resizeType, { event, start, end }) => {
    const { events } = this.state

    const nextEvents = events.map(existingEvent => {
      return existingEvent.id === event.id
        ? { ...existingEvent, start, end }
        : existingEvent
    })

    this.setState({
      events: nextEvents,
    })
  }


  getTimeSlots(startDate, endDate, interval) {
    let slots = [];
    let intervalMillis = interval * 60 * 1000;
    while (startDate < endDate) {
        // So that you get "00" if we're on the hour.
        var mins = (startDate.getMinutes() + '0').slice(0, 2);
        slots.push(startDate.getHours() + ':' + mins);
        startDate.setTime(startDate.getTime() + intervalMillis);
    }
    return slots;
  }

  getTimeDate(time) {
    var timeParts = time;
    var d = new Date();
    d.setHours(timeParts.getHours());
    d.setMinutes(timeParts.getMinutes());
    d.setSeconds(timeParts.getSeconds());
    return d;
  }

  addEvent(start, end) {
		if (start < new Date()){
			this.setState({snackOpen: true})
		} else {
			let events = this.state.events;
      const settings = {
        timeSlotGap: 30,
        minTime: start,
        maxTime: end,
      };
      let slots = this.getTimeSlots(this.getTimeDate(settings.minTime), this.getTimeDate(settings.maxTime), settings.timeSlotGap);
      for (let i of slots) {
        const split = i.split(":")
        let star = new Date(start.valueOf())
        star.setHours(split[0]);
        star.setMinutes(split[1]);
        const newEnd = moment(star).add(30, 'm').toDate();
        let newEvent = {};
        if (events.length === 0) {
          newEvent = {id: 0, title: "Available", allDay: false, start: star, end: newEnd}
        } else {
          newEvent = {id: events[events.length - 1].id + 1, title: "Available", allDay: false, start: star, end: newEnd}
        }
        events.push(newEvent)
        this.setState({events: events})
      }
		}
	}

  handleRequestClose = () => {
    this.setState({
      snackOpen: false,
    });
  };

	// handleOpen(evt) {
 //    // console.log(evt)
 //    this.setState({open: true, event: evt});
	// }
	// handleClose() {
 //  	this.setState({open: false});
	// }

	removeTimeslot(event){
		let events = this.state.events
		var filtered = events.filter(function(el) { return el.id !== event.id });
		this.setState({events: filtered})
		this.setState({open: false})
	}

	submit(){
		axios.post(`${process.env.REACT_APP_USERS_SERVICE_URL}/api/savetimeslots`,
      {
        user_id: this.state.profile.sub,
        times: this.state.events,
    	})
    	history.replace('/discussions');
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
	  const { isAuthenticated } = this.props.auth;
    const { getAccessToken } = this.props.auth;
    let headers = {}
    if ( isAuthenticated()) {
      headers = { 'Authorization': `Bearer ${getAccessToken()}`}
    }
      axios.get(`${process.env.REACT_APP_USERS_SERVICE_URL}/api/getmytimeslots`, {headers})
        .then((response) => {
          let events = []
          let index = 0
          for (let e of response.data) {
            let start = new Date(e.start)
            let end = new Date(e.end)
            let s_userTimezoneOffset = start.getTimezoneOffset() * 60000;
            let e_userTimezoneOffset = end.getTimezoneOffset() * 60000;
            let event = {id: index, title: "Available to talk", allDay: false, start: new Date(start.getTime()- s_userTimezoneOffset), end: new Date(end.getTime() - e_userTimezoneOffset)}
            events.push(event)
            index += 1
          }
          this.setState({
            events: events,
            waiting: false
          })
        })
        .catch(function (error) {
          console.log(error)
        })
    }
  	
  render() {
		const actions = [
			<FlatButton
				label="Cancel"
				primary={true}
				onClick={() => this.handleClose()}
			/>,
			<FlatButton
				label="Remove"
				primary={true}
				onClick={() => this.removeTimeslot()}
			/>,
		];

    return (
      <div id="calendarDiv">
      {this.state.waiting ? <CircularProgress />
      :
        (
          <div>
            <Snackbar
              open={this.state.snackOpen}
              message="You can't set past availability."
              autoHideDuration={4000}
              onRequestClose={this.handleRequestClose}
            />
            <Paper style={{marginTop: '10px'}} >
              <DragAndDropCalendar
                selectable
                events={this.state.events}
                onEventDrop={this.moveEvent}
                resizable
                onEventResize={this.resizeEvent}
                defaultView="week"
                defaultDate={new Date()}
                onSelectEvent={event => this.removeTimeslot(event)}
                onSelectSlot={slotInfo => this.addEvent(slotInfo.start, slotInfo.end)}
              />
              <Dialog
                title="Remove this timeslot?"
                actions={actions}
                modal={false}
                open={this.state.open}
                onRequestClose={() => this.handleClose.bind(this)}
              >
              </Dialog>
                 <RaisedButton label="Submit Timeslots" fullWidth={true} primary={true}
              onClick={() => this.submit()}
              />
            </Paper>
          </div>
        )
      }
      </div>
    )
  }
}

export default Calendar;