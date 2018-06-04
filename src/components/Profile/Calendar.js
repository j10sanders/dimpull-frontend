import './calendar.css'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import 'react-big-calendar/lib/addons/dragAndDrop/styles.less'
import React from 'react';
import moment from 'moment';
import BigCalendar from 'react-big-calendar'
import withDragAndDrop from 'react-big-calendar/lib/addons/dragAndDrop'
import RaisedButton from 'material-ui/RaisedButton';
import Paper from 'material-ui/Paper';
import axios from 'axios';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import Snackbar from 'material-ui/Snackbar';
import filter from 'lodash/filter';
import CircularProgress from 'material-ui/CircularProgress';
import TextField from 'material-ui/TextField';
import { agreement } from '../../utils/agreements'
import history from '../../history';

const Markdown = require('react-remarkable');
BigCalendar.setLocalizer(BigCalendar.momentLocalizer(moment))
const DragAndDropCalendar = withDragAndDrop(BigCalendar)

class Calendar extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      events: [], 
      event: '',
      snackOpen: false,
      waiting: true,
      tc: false,
      initialsErrorText: 'Initialize form in order to accept',
      openedTime: false,
      reminder: false,
      saved: false,
      saving: false
    }
  this.moveEvent = this.moveEvent.bind(this)
  }

  componentWillMount() {
    const { isAuthenticated } = this.props.auth;
    if ( !isAuthenticated()) {
      this.props.auth.login('/calendar')
    }
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
    this.fetchTimes()
  }

  async fetchTimes () {
    const { getAccessToken } = this.props.auth;
    const headers = { 'Authorization': `Bearer ${getAccessToken()}`}
    const expert = await axios.get(`${process.env.REACT_APP_USERS_SERVICE_URL}/isexpert`, { headers });
    if (!expert.data.expert) {
      history.push('/newProfile')
    }
    const response = await axios.get(`${process.env.REACT_APP_USERS_SERVICE_URL}/api/getmytimeslots`, {headers})
    if (response.data === 'terms') {
      this.setState({ tc: true, waiting: false })
    } else {
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
    }
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
        const mins = (startDate.getMinutes() + '0').slice(0, 2);
        slots.push(startDate.getHours() + ':' + mins);
        startDate.setTime(startDate.getTime() + intervalMillis);
    }
    return slots;
  }

  getTimeDate(time) {
    const timeParts = time;
    const d = new Date();
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
        const exists = filter(events, e => e["start"].getTime() === star.getTime()).length === 0;
        if (exists) {
          if (events.length === 0) {
            newEvent = {id: 0, title: "Available", allDay: false, start: star, end: newEnd}
          } else {
            newEvent = {id: events[events.length - 1].id + 1, title: "Available", allDay: false, start: star, end: newEnd}
          }
          events.push(newEvent)
        }
      }
      this.setState({events: events, reminder: true})
    }
	}

  handleRequestClose = () => {
    this.setState({
      snackOpen: false, reminder: false, saved: false
    });
  };

	async submit () {
    this.setState({saving: true})

		await axios.post(`${process.env.REACT_APP_USERS_SERVICE_URL}/api/savetimeslots`,
      {
        user_id: this.state.profile.sub,
        times: this.state.events,
    	})
    this.setState({ saved: true, saving: false })
	}

  async accept () {
    this.setState({ tc: false, waiting: true })
    const { getAccessToken } = this.props.auth;
    let headers = {}
    headers = { 'Authorization': `Bearer ${getAccessToken()}`}
    const response = await axios.post(
      `${process.env.REACT_APP_USERS_SERVICE_URL}/acceptTerms`,
      {
        accepted: true
      }, { headers }
    );
    if (response.data === 'confirmed') {
      this.setState({ tc: false, waiting: false })
    }
  }

  changeValue (e, type) {
    const nextState = {};
    nextState[type] = e.target.value;
    if (type === 'initials'){
      if (e.target.value.length > 1){
        this.setState({ initialsErrorText: null });
      }
    }
    this.setState(nextState);
  }

  handleClose () {
   this.setState({openedTime: false});
  }

  selectEvent (event) {
    this.setState({ selectedEvent: event, openedTime: true})
  }

  setRecurring () {
    let events = this.state.events;
    const start = new Date(this.state.selectedEvent.start);
    const end = new Date(this.state.selectedEvent.end);
    for (let i = 1; i < 17; i++) {
      const s = new Date(+start);
      const e = new Date(+end);
      const star = new Date(s.setDate(s.getDate() + i*7))
      const newEnd = new Date(e.setDate(e.getDate() + i*7))
      const newEvent = {id: events[events.length - 1].id + 1, title: "Available", allDay: false, start: star, end: newEnd}
      events.push(newEvent)
    }
    this.setState({ events: events, openedTime: false, reminder: true })
  }

  removeTimeslot () {
    const event = this.state.selectedEvent;
    const start = new Date(this.state.selectedEvent.start);
    const events = this.state.events
    let filtered = events.filter(function(el) { return el.id !== event.id });
    let recurring = true;
    let i = 1
    while (recurring) {
      let lenFiltered = filtered.length
      const s = new Date(+start);
      const star = new Date(s.setDate(s.getDate() + i*7))
      filtered = filtered.filter(function(el) { return el.start.getTime() !== star.getTime() });
      if (filtered.length === lenFiltered){
        recurring = false;
      } else{
        i += 1
      }
    }
    this.setState({events: filtered, reminder: true});
    this.handleClose();
  }
  	
  render() {
    let formats = {
      dayFormat: (date, culture, localizer) =>
        localizer.format(date, 'M/D', culture)
    }

		const actions = [
			<FlatButton
				label="Cancel"
				primary
				onClick={() => this.handleClose()}
			/>,
			<FlatButton
				label="Remove"
				primary
				onClick={() => this.removeTimeslot()}
			/>,
      <FlatButton
        label="Set Recurring (4 months)"
        primary
        onClick={() => this.setRecurring()}
      />,
		];

    const tAndC = [
      <FlatButton
        label="I Do Not Acccept"
        primary
        onClick={() => this.handleClose()}
      />,
      <FlatButton
        label="I Accept the Terms of Service"
        primary
        disabled={this.state.initialsErrorText !== null}
        onClick={() => this.accept()}
      />,
    ];

    return (
      <div id="calendarDiv">
      {this.state.waiting ? <CircularProgress />
      :
        (
          <div>
          {!this.state.tc ? 
            <div>
            <Snackbar
              open={this.state.snackOpen}
              message="You can't set past availability."
              autoHideDuration={4000}
              onRequestClose={this.handleRequestClose}
            />
            <Snackbar
              open={this.state.reminder}
              message="Make sure to click 'Submit Timeslots' at the bottom to save"
              autoHideDuration={3000}
              onRequestClose={this.handleRequestClose}
            />
            <Snackbar
              open={this.state.saved}
              message="Success.  Your times are saved."
              autoHideDuration={4000}
              onRequestClose={this.handleRequestClose}
            />
            <Paper style={{ marginTop: '10px', marginBotton: '20px' }} >
              <DragAndDropCalendar
                selectable
                events={this.state.events}
                onEventDrop={this.moveEvent}
                resizable
                onEventResize={this.resizeEvent}
                defaultView="week"
                defaultDate={new Date()}
                onSelectEvent={event => this.selectEvent(event)}
                onSelectSlot={slotInfo => this.addEvent(slotInfo.start, slotInfo.end)}
                formats={formats}
              />
              
              {this.state.saving ? <div style={{ paddingLeft: '50%' }}>
                <CircularProgress />
              </div> :
              <RaisedButton label="Submit Timeslots" fullWidth={true} primary={true}onClick={() => this.submit()}/>
              }
            </Paper>
            <Dialog
            title="Remove? Or set timeslot to reoccur?"
              actions={actions}
              modal={false}
              open={this.state.openedTime}
              // onRequestClose={this.handleRequestClose}
            /> 
            </div>
            :        
            <Dialog
              title="Terms and Conditions"
              actions={tAndC}
              modal={false}
              open={this.state.tc}
              onRequestClose={this.handleCloseTC}
              autoScrollBodyContent={true}
            >
              <Markdown>
                {agreement}
              </Markdown>
              <TextField
                floatingLabelText="Initials"
                type="initials"
                value={this.state.initials}
                errorText={this.state.initialsErrorText}
                onChange={e => this.changeValue(e, 'initials')}
              /> 
            </Dialog>
          }
          </div>
        )
      }
      </div>
    )
  }
}

export default Calendar;