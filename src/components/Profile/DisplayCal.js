import React from 'react';
import moment from 'moment';
import Paper from 'material-ui/Paper';
import Dialog from 'material-ui/Dialog';
import PropTypes from 'prop-types';
import Snackbar from 'material-ui/Snackbar';
import CircularProgress from 'material-ui/CircularProgress';
import { AwesomeButton } from 'react-awesome-button';
import TextField from 'material-ui/TextField';
import withDragAndDrop from 'react-big-calendar/lib/addons/dragAndDrop';
import BigCalendar from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import 'react-big-calendar/lib/addons/dragAndDrop/styles.less';
import './calendar.css';
import { agreement } from '../../utils/agreements';

BigCalendar.setLocalizer(BigCalendar.momentLocalizer(moment));
const Markdown = require('react-remarkable');

const DragAndDropCalendar = withDragAndDrop(BigCalendar);

const formats = {
  dayFormat: (date, culture, localizer) =>
    localizer.format(date, 'M/D', culture)
};

const DisplayCal = props => (
  <div id="calendarDiv">
    {props.waiting ? <CircularProgress /> : (
      <div>
        {!props.tc ?
          <div>
            <Snackbar
              open={props.snackOpen}
              message="You can't set past availability."
              autoHideDuration={4000}
              onRequestClose={this.handleRequestClose}
            />
            <Snackbar
              open={props.reminder}
              message="Make sure to click 'Submit Timeslots' at the bottom to save"
              autoHideDuration={3000}
              onRequestClose={this.handleRequestClose}
            />
            <Snackbar
              open={props.saved}
              message="Success.  Your times are saved."
              autoHideDuration={4000}
              onRequestClose={this.handleRequestClose}
            />
            <Paper style={{ marginTop: '30px', marginBotton: '20px' }} >
              <DragAndDropCalendar
                selectable
                events={props.events}
                onEventDrop={props.moveEvent}
                resizable
                onEventResize={props.resizeEvent}
                defaultView="week"
                defaultDate={new Date()}
                onSelectEvent={event => props.selectEvent(event)}
                onSelectSlot={slotInfo => props.addEvent(slotInfo.start, slotInfo.end)}
                formats={formats}
              />
            </Paper>
            {props.saving ?
              <div style={{ paddingLeft: '50%' }}>
                <CircularProgress />
              </div> :
              <AwesomeButton type="primary" style={{ width: '50%', fontSize: '20px', marginLeft: '25%', marginTop: '-2px' }} action={() => props.submit()}>Submit Timeslots</AwesomeButton>
            }
            <Dialog
              title="Remove? Or set timeslot to reoccur?"
              actions={props.actions}
              modal={false}
              open={props.openedTime}
            /> 
          </div>
          :        
          <Dialog
            title="Terms and Conditions"
            actions={props.tAndC}
            modal={false}
            open={props.tc}
            autoScrollBodyContent
          >
            <Markdown>
              {agreement}
            </Markdown>
            <TextField
              floatingLabelText="Initials"
              type="initials"
              value={props.initials}
              errorText={props.initialsErrorText}
              onChange={e => props.changeValue(e, 'initials')}
            />
          </Dialog>
        }
      </div>
    )}
  </div>
);

DisplayCal.propTypes = {
  tc: PropTypes.bool,
  changeValue: PropTypes.func,
  initials: PropTypes.string,
  initialsErrorText: PropTypes.string,
  tAndC: PropTypes.arrayOf(PropTypes.node),
  actions: PropTypes.arrayOf(PropTypes.node),
  openedTime: PropTypes.bool,
  saving: PropTypes.bool,
  addEvent: PropTypes.func,
  resizeEvent: PropTypes.func,
  moveEvent: PropTypes.func,
  events: PropTypes.arrayOf(PropTypes.shape),
  selectEvent: PropTypes.func,
  saved: PropTypes.bool,
  reminder: PropTypes.bool,
  snackOpen: PropTypes.bool,
  waiting: PropTypes.bool
};

DisplayCal.defaultProps = {
  changeValue: () => {},
  initials: '',
  initialsErrorText: '',
  tAndC: [<div />],
  actions: [<div />],
  openedTime: false,
  saving: false,
  tc: true,
  addEvent: () => {},
  resizeEvent: () => {},
  moveEvent: () => {},
  events: [{}],
  selectEvent: () => {},
  saved: false,
  reminder: false,
  snackOpen: false,
  waiting: false
};

export default DisplayCal;
