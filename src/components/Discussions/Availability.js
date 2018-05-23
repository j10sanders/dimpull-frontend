import React from 'react';
import axios from 'axios';
import HTML5Backend from 'react-dnd-html5-backend'
import { DragDropContext } from 'react-dnd'
import BigCalendar from 'react-big-calendar'
import withDragAndDrop from 'react-big-calendar/lib/addons/dragAndDrop'
import moment from 'moment'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import 'react-big-calendar/lib/addons/dragAndDrop/styles.less'
import Paper from 'material-ui/Paper';
import {RadioButton, RadioButtonGroup} from 'material-ui/RadioButton';
import FlatButton from 'material-ui/FlatButton';
import Dialog from 'material-ui/Dialog';
import CircularProgress from 'material-ui/CircularProgress';
import TextField from 'material-ui/TextField';
import Snackbar from 'material-ui/Snackbar';
import history from '../../history';
import '../../Profile/calendar.css'

BigCalendar.setLocalizer(BigCalendar.momentLocalizer(moment))
const DragAndDropCalendar = withDragAndDrop(BigCalendar)

class Availability extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      events: [],
      open: false,
      waiting: true,
      tooEarly: false,
      errorTitle: '',
      requestAvailability: false,
      email: '',
      message: '',
      requested: false,
      tc: false
    }
    this.moveEvent = this.moveEvent.bind(this)
  }

  componentDidMount () {
    this.getTimes();
  }

  async getTimes () {
    const response = await axios.get(`${process.env.REACT_APP_USERS_SERVICE_URL}${this.props.location.pathname}`)
    if (response.data === 'No availability') {
      this.setState({ noAvailability: true });
      return;
    }
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
    this.setState({events: events, waiting: false})
  }

  formatTime(time) {
    let NumTime = Number(time)
    if (NumTime < 10) {
      time = "0" + time
    }
    return time
  }

  handleOpen(evt) {
    this.setState({open: true, event: evt });
    let startHour = this.formatTime(evt.start.getHours().toString())
    let startMin = this.formatTime(evt.start.getMinutes().toString())
    let endHour = this.formatTime(evt.end.getHours().toString())
    let endMin = this.formatTime(evt.end.getMinutes().toString())
    this.setState({startTime: startHour + ':' + startMin + ":00"})
    this.setState({endTime: endHour + ':' + endMin + ":00"})
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
    alert(`${event.title} was dropped onto ${event.start}`)
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

  handleOpenError () {
    this.setState({ tooEarly: true })
  }

  handleCloseError () {
    this.setState({ tooEarly: false, open: false })
  }

  async bookTimeslot(){
    // TODO: terms and conditions.
    // this.state.event date with time this.state.checked is not in past -- then 
    let checked = this.state.checked
    let start = this.state.event.start
    let startTime = start
    if (!checked) {
      if ((start - new Date()) / 60000 < 120) {
        this.setState({ errorTitle: `Sorry, the timeslot must start at least two hours from now.`}, () => this.handleOpenError());
      }
    } else {
      startTime = (start).setHours(Number(checked.substring(0,2)), Number(checked.substring(3, checked.length)), 0)
    }
    if ((start - new Date()) / 60000 < 120) {
      this.setState({ errorTitle: `Sorry, the timeslot must start at least two hours from now.`}, () => this.handleOpenError());
    } else {
      const conversationID = this.props.location.pathname.split('/').pop().trim()
      const result = await axios.post(`${process.env.REACT_APP_USERS_SERVICE_URL}/holdtimeslot/${conversationID}`,
        {
          start_time: new Date(startTime),
        }
      );
      if (result.data === "added pending"){
        history.push({
          pathname: '/requestConversation',
          search: conversationID,
          state: { startTime: startTime, now: Date.now(), vip: this.props.location.state ? this.props.location.state.vip : false }
        })
      } else {
        this.setState({ errorTitle: `Sorry, someone else just booked that time!  It is no longer available.`}, () => this.handleOpenError());
      }
    }
  }

  handleRadio(evt){ console.log(evt.target.value, "EVT.TARGET")
    this.setState({checked: evt.target.value})
  }

  handleClose() {
    this.setState({open: false, tc: false});
  }

  getTimeDate(time) {
    var timeParts = time.split(':');
    var d = new Date();
    d.setHours(timeParts[0]);
    d.setMinutes(timeParts[1]);
    d.setSeconds(timeParts[2]);
    return d;
}

  getTimeSlots(startDate, endDate, interval) {
    var slots = [];

    var intervalMillis = interval * 60 * 1000;

    while (startDate < endDate) {
        // So that you get "00" if we're on the hour.
        var mins = (startDate.getMinutes() + '0').slice(0, 2);
        slots.push(startDate.getHours() + ':' + mins);
        startDate.setTime(startDate.getTime() + intervalMillis);
    }

    return slots;
  }

  changeEmail (e) {
    this.setState({ email: e.target.value });
  }

  changeMessage (e) {
    this.setState({ message: e.target.value });
  }



  requestAvailability () {
    console.log("Reuq")
    this.setState({ requestAvailability: true });
  }

  async submitEmail () {
    await axios.post(`${process.env.REACT_APP_USERS_SERVICE_URL}/requestavailability`, {
      email: this.state.email,
      message: this.state.message,
      host: this.props.location.state.host
    });
    this.setState({ requestAvailability: false, requested: true })
  }

  handleCloseAvailability () {
    this.setState({ requestAvailability: false })
  }

  acceptTerms () {
    this.setState({ tc: true });
  }

  render() {
    const submitEmail = [
       <FlatButton
        label="Cancel"
        primary={true}
        onClick={() => this.handleCloseAvailability()}
      />,
      <FlatButton
        label="Submit"
        primary={true}
        onClick={() => this.submitEmail()}
      />
    ]
    if (this.state.noAvailability) {
      return ( 
        <div style={{ textAlign: 'center', paddingTop: '50px' }}>
          <h2>{`Sorry, ${this.props.location.state.host} does not have any availability set.`}</h2>
          <FlatButton
            label={`Let ${this.props.location.state.host} know you want to talk`} 
            primary={true}
            onClick={() => this.requestAvailability()}
          />
          <Dialog
            title={`Let ${this.props.location.state.host} know you want to talk`}
            actions={submitEmail}
            modal={false}
            open={this.state.requestAvailability}
            onRequestClose={() => this.handleCloseAvailability.bind(this)}
          >
            <TextField
              floatingLabelText="Your email"
              type="email"
              value={this.state.email}
              fullWidth
              onChange={e => this.changeEmail(e)}
            />
            <TextField
              floatingLabelText="short message"
              type="message"
              value={this.state.message}
              fullWidth
              onChange={e => this.changeMessage(e)}
            />
          </Dialog>
          <Snackbar
            open={this.state.requested}
            message={`Thanks! We will let ${this.props.location.state.host} know.  You will hear back from us shortly...`}
            autoHideDuration={8000}
          />
        </div>
      )
    } 
    const settings = {
      timeSlotGap: 30,
      minTime: this.state.startTime,
      maxTime: this.state.endTime,
    };

    let slots = []
    if (this.state.startTime){
      slots = this.getTimeSlots(this.getTimeDate(settings.minTime), this.getTimeDate(settings.maxTime), settings.timeSlotGap);
    }

    const actions = [
      <FlatButton
        label="Cancel"
        primary={true}
        onClick={() => this.handleClose()}
      />,
      <FlatButton
        label="Book timeslot"
        primary={true}
        onClick={() => this.acceptTerms()}
      />,
    ];

    const tAndC = [
      <FlatButton
        label="I Do Not Acccept"
        primary={true}
        onClick={() => this.handleClose()}
      />,
      <FlatButton
        label="I Accept"
        primary={true}
        onClick={() => this.bookTimeslot()}
      />,
    ];

    const errActions = [
      <FlatButton
        label="Ok"
        primary={true}
        onClick={() => this.handleCloseError()}
      />,
    ];

    const radios = [];
    for (let i of slots) {
      let ampm = ''
      let hour = i.substring(0, 2);
      if (i.substring(0,1) !== '1' && i.substring(0,1) !=='2'){
        hour = i.substring(0,1)
      }
      if (Number(hour) < 12) {
        ampm = i + ' am'
      } else if (Number(hour) === 12) {
        ampm = i + ' pm'
      } else {
        ampm = Number(hour - 12).toString() + i.substring(2, i.length) + ' pm'
      }
      radios.push(
        <RadioButton
          key={i}
          value={i}
          label={ampm}
          onClick={(evt) => this.handleRadio(evt)}
        />
      );
    }

    let formats = {
      dayFormat: (date, culture, localizer) =>
        localizer.format(date, 'M/D', culture)
    }
    
    return (
      <div id="calendarDiv">
      {this.state.waiting ? <CircularProgress />
      :
        (
          <div>
            <Paper style={{marginTop: '10px'}}>
              <DragAndDropCalendar
                selectable
                events={this.state.events}
                onEventDrop={this.moveEvent}
                onSelectEvent={event => this.handleOpen(event)}
                resizable
                onEventResize={this.resizeEvent}
                defaultView="week"
                defaultDate={new Date()}
                formats={formats}
              />
            </Paper>
            <Dialog
              title="Confirm your start time for a 30 minute window"
              actions={actions}
              modal={false}
              open={this.state.open}
              onRequestClose={() => this.handleClose()}
            > 
            <RadioButtonGroup name="timeslots" defaultSelected={radios.length > 0 ? radios[0].props.value : ""}>
                {radios}
              </RadioButtonGroup>
            </Dialog>
            <Dialog
              title={this.state.errorTitle}
              actions={errActions}
              modal={false}
              open={this.state.tooEarly}
              onRequestClose={() => this.handleCloseError()}
            />
            <Dialog
              title="Terms and Conditions"
              actions={tAndC}
              modal={false}
              open={this.state.tc}
              onRequestClose={this.handleCloseTC}
              autoScrollBodyContent={true}
            >
              Do you accept Dimpull's <a href="https://sites.google.com/view/dimpull/home" target="_blank" rel="noopener noreferrer">Privacy Policy</a> and <a href="https://sites.google.com/view/dimpull-termsofservice/home" target="_blank" rel="noopener noreferrer">Terms of Service</a>?
            </Dialog>
          </div>
        )
      }
      </div>
    )
  }
}

export default DragDropContext(HTML5Backend)(Availability);