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

BigCalendar.setLocalizer(BigCalendar.momentLocalizer(moment))
const DragAndDropCalendar = withDragAndDrop(BigCalendar)

class Availability extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      events: [],
    }

    this.moveEvent = this.moveEvent.bind(this)
  }

      componentDidMount(){
      axios.get(`${process.env.REACT_APP_USERS_SERVICE_URL}/api/gettimeslots${this.props.location.search}`)
        .then((response) => {
          console.log(response)
          let events = []
          let index = 0
          for (let e of response.data) {
            console.log(e, new Date(e.start))
            debugger;
            let event = {id: index, title: "Available to talk", allDay: false, start: new Date(e.start), end: new Date(e.end)}
            events.push(event)
            index += 1
          }
          console.log(events)
          this.setState({events: events})})
        .catch(function (error) {
          console.log(error)
        })
 
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

  render() {
    return (

      <div style={{height: '1000px'}}>
      <Paper style={{marginTop: '10px'}}>
      <DragAndDropCalendar
        selectable
        events={this.state.events}
        onEventDrop={this.moveEvent}
        resizable
        onEventResize={this.resizeEvent}
        defaultView="week"
        defaultDate={new Date()}
      />
      </Paper>
      </div>
    )
  }
}

export default DragDropContext(HTML5Backend)(Availability)