import React from 'react';
// import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';
// import FlatButton from 'material-ui/FlatButton';
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
import history from '../../history';

BigCalendar.setLocalizer(BigCalendar.momentLocalizer(moment))
const DragAndDropCalendar = withDragAndDrop(BigCalendar)

class Availability extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      events: [],
      open: false,
    }

    this.moveEvent = this.moveEvent.bind(this)
  }

      componentDidMount(){
      axios.get(`
        ${process.env.REACT_APP_USERS_SERVICE_URL}/api/gettimeslots${this.props.location.search}`)
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
          this.setState({events: events})})
        .catch(function (error) {
          console.log(error)
        })
 
    }

    formatTime(time){
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

  bookTimeslot(){
    // this.state.event date with time this.state.checked is not in past -- then 
    let checked = this.state.checked
    let start = this.state.event.start
    let startTime = start
    if (!checked) {
      if (start < new Date()){
        console.log("TOO EARLY FOO")
        return
      }
    } else {
      startTime = (start).setHours(Number(checked.substring(0,2)), Number(checked.substring(3, checked.length)), 0)
    }
    if (startTime < new Date()){
      console.log("TOO EARLY FOO")
    } else{
      console.log(startTime, "STARTTIME")
      // save go to next step to save anon number and will need to associate with this time.
      history.push({
        pathname: '/requestConversation',
        search: this.props.location.search,
        state: { startTime: startTime }
      })
    }
  }

  handleRadio(evt){ console.log(evt.target.value, "EVT.TARGET")
    this.setState({checked: evt.target.value})
  }

  handleClose() {
    this.setState({open: false});
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

  render() {
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
        onClick={() => this.bookTimeslot()}
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
      <div style={{height: '1000px'}}>
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
              title="Pick your start time for a 30 minute window"
              actions={actions}
              modal={false}
              open={this.state.open}
              onRequestClose={() => this.handleClose.bind(this)}
            >   
            <RadioButtonGroup name="timeslots" defaultSelected={radios.length > 0 ? radios[0].props.value : ""}>
            {radios}
          </RadioButtonGroup>
      </Dialog>
      </div>
    )
  }
}

export default DragDropContext(HTML5Backend)(Availability)