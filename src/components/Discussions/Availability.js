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

const Markdown = require('react-remarkable');

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
      if ((start - new Date()) / 60000 < 60) {
        this.setState({ errorTitle: `Sorry, the timeslot must start at least one hour from now.`}, () => this.handleOpenError());
      }
    } else {
      startTime = (start).setHours(Number(checked.substring(0,2)), Number(checked.substring(3, checked.length)), 0)
    }
    if ((start - new Date()) / 60000 < 60) {
      this.setState({ errorTitle: `Sorry, the timeslot must start at least one hour from now.`}, () => this.handleOpenError());
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

  handleScroll(e) {
    console.log(e, "e")
    const bottom = e.target.scrollHeight - e.target.scrollTop === e.target.clientHeight;
    if (bottom) {this.setState({scrolled: true})}
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
        // onClick={() => this.bookTimeslot()}
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
        label="I Accept the Terms of Service"
        primary={true}
        disabled={this.state.scrolled}
        // onClick={() => this.bookTimeslot()}
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
              <Markdown onScroll={e => this.handleScroll(e)}>{`

**DIMPULL TERMS OF SERVICE**

**Introduction**

Welcome
to Dimpull, an online platform, owned by Dimpull Inc. a Delaware
corporation, whereby users seeking advice and information about
[Blockchain related projects] can connect with experts in the field.
These terms and conditions ("Agreement” or “Terms”) are
legally binding and govern your use of service. Throughout this
document, the words “Dimpull Inc,” “Dimpull,” “dimpull.com,”
“us,” “we,” “our,” “Platform” or “Services” refer
to us, Dimpull Inc. our website, dimpull.com [_______], or our
services made available at the same website. The words “you” and
“your” refer to you, the user of the Services or Platform.

We may update the Terms from
time to time without notice to you. Unless expressly stated
otherwise, any new features that augment, enhance or otherwise modify
the Platform shall be subject to these Terms. By accessing and using
this Platform, you agree to comply with and be legally bound by these
Terms and our Privacy Policy, which can be found at [insert website]
and are incorporated herein by reference.

**Definitions**

“Client” means a person
who schedules a Expert Session on Dimpull.

“Smart Contract” means our
Dimpull eEthereum based smart contract used for processing payments
and trasactionstransactions for the Platform.

“Expert” means a person
who maintains a profile and offers Expert Sessions on the Platform,
or otherwise agrees to perform the services on the Platform.

“Expert Content” means all
Content that a Expert posts, uploads, publishes, submits, or
transmits to be made available through the Platform including any
information or advice.

“Expert Session” means an
engagement, training program, consultation, or other Service between
a Expert and a Client.

 “Content” means text,
images, video, graphics, software, music, audio, information, or
other materials.

 “Platform” means
Dimpull’s website (currently located at 

[www.dimpull.com])
and any successor and affiliated websites.

“Service” or “Services”
includes Dimpull Expert Connect.

 “Tax” or “Taxes” mean
any sales taxes, value added taxes (VAT), goods and services taxes
(GST) and other similar municipal, state, and federal indirect or
other withholding, and personal or corporate income taxes.

**Dimpull Accounts**

To book Expert Sessions, you
may use a unique account on the Platform (a “Dimpull Account”).
You have the option to log in to your Dimpull Account via [LinkedIn,
Metamask or via email]Auth0
(using Linkedin, Facebook, Twitter, Github or via email). You may
never use another person’s Dimpull Account. When creating your
Dimpull Account, you must provide accurate and complete information.
You are solely responsible for the activity that occurs on your
Dimpull Account, and you must keep your Dimpull Account password
secure. You must notify us immediately of any breach of security or
unauthorized use of your Dimpull Account. Although we will not be
liable for any losses or damages caused by any unauthorized use of
your Dimpull Account, you may be liable for the losses to us, or
others due to such unauthorized use.

**THE DIMPULL EXPERT
PLATFORM TERMS**

These Terms will apply
specifically to usage of Dimpull Expert Platform.

#### How
the Site, Platform and Services Work

The
Site is a platform for Client to connect and schedule Expert Sessions
in order to exchange information with Expert. You may view expert as
an unregistered visitor to the website Platform and Services;
however, if you wish to use as an Expert, you must first register
with us.  If you are a Client you will have the option but not the
obligation to register with us.

Dimpull’s
role is solely to facilitate the availability of the website,
Platform and Services and to provide services related thereto, such
as Expert Session scheduling, call facilitation, call cycling, and
Smart Contract payment processing. Dimpull does not provide and is
not responsible for Expert Content or any information or advice
exchanged between Clients and Experts during Expert Sessions or
otherwise. Dimpull does not verify the credentials of any of its
Experts or Clients. You understand and acknowledge that Experts are
not employees or agents of Dimpull but are independent service
providers using the Site, Application and Services to market their
expertise to other individuals. You acknowledge that Dimpull will not
be liable for any loss or damage caused by your reliance on
information provided by Experts or information contained in Expert
Content.

PLEASE
NOTE THAT, AS STATED ABOVE, THE SITE, PLATFORM AND SERVICES ARE
INTENDED TO BE USED TO FACILITATE INTERACTION. DIMPULL CANNOT AND
DOES NOT CONTROL OR GUARANTEE THE CONTENT CONTAINED IN ANY LISTINGS
OR THE INFORMATION EXCHANGED BETWEEN USERS VIA THE SERVICES. YOU
UNDERSTAND AND ACKNOWLEDGE THAT DIMPULL IS NOT RESPONSIBLE FOR AND
DISCLAIMS ANY AND ALL LIABILITY RELATED TO ANY AND ALL LISTINGS AND
INFORMATION PROVIDED UNDER THE SERVICES. ACCORDINGLY, ALL USER USE
THE SITE, PLATFORM AND SERVICES AT THEIR OWN RISK.

**Expert Sessions and
Financial Terms for Clients**

Experts,
and not Dimpull, are solely responsible for honoring any confirmed
Expert Sessions and completing any Expert Sessions reserved through
the Platform. If we or a selected Expert cancel a booked Expert
Session, any amounts collected by us or our Smart Contract for the
corresponding Expert Session will be refunded to such Client, as
applicable. If Client cancels a booked Expert Session, no amounts
collected by us or our Smart Contract for the corresponding Expert
Session will be refunded to such Client.

If
you choose to enter into any agreement with an Expert outside the
Platform, we will not a party to such agreement and disclaims all
liability arising from or related to the same.

To establish an Expert
Session, we will collect the total fees for the same in accordance
with the pricing terms on the Platform.  You will be responsible for
paying the gas prices for processing such transaction. Please note
that we cannot control any fees or gas that may be charged to a
Client by the eEthereum network to process such payment, and Dimpull
disclaims all liability in this regard.

In connection with your
requested Expert Session, you will be asked to provide customary
billing information such as name, email address and metamask public
keyEthereum wallet address to us or its third party payment
processor. You agree to pay us for any Expert Sessions made on the
Pplatformplatform in accordance with these Terms by one of the
methods described on the Platform. You hereby authorize the
collection of such amounts by [__________],
either directly by us or indirectly, via a third party online payment
processor or by one of the payment methods described on the Platform.
If you are directed to Dimpull’s third party payment processor, you
may be subject to terms and conditions governing use of that third
party’s service and that third party’s personal information
collection practices. Please review such terms and conditions and
privacy policy before using the services. Once your Expert Session is
purchased you will receive a confirmation [transaction key]
summarizing confirming your transaction.

**Copyright Ownership**

The Content, Platform, and
Services are the property of Dimpull, and are protected by all
applicable copyright, trademark, and other laws of the United States
and foreign countries. You acknowledge and agree that the Content,
Platform, and Services, including all associated intellectual
property rights, is the exclusive property of Dimpull and its
licensors. You will not edit, remove, alter, or obscure any
copyright, trademark, service mark, or other proprietary rights
notices incorporated in or accompanying the Content, Platform, or
Services. Subject to your compliance with the terms and conditions of
these Terms, Dimpull grants you a limited, non-exclusive,
non-transferable license, to (i) access and view any  Content solely
for your personal and non-commercial purposes and (ii) access and
view any Expert Content to which you are permitted access, solely for
your personal and non-commercial purposes. You have no right to
sublicense the license rights granted in this section.

The Expert Content is the
property of the applicable Expert and is protected by all applicable
copyright, trademark, and other laws of the United States and foreign
countries.

You will not use, copy, adapt,
modify, prepare derivative works based upon, distribute, license,
sell, transfer, publicly display, publicly perform, transmit,
broadcast, or otherwise exploit the Content, Platform, Services,
except as expressly permitted in these Terms. No licenses or rights
are granted to you by implication or otherwise under any intellectual
property rights owned or controlled by Dimpull or its licensors,
except for the licenses and rights expressly granted in these Terms.

**Financial Advice**

You agree that you will not
use the Platform to seek, obtain, or solicit any financial advice
from any expert.  We define financial advice as any advice regarding
the relative price or performance of any security and we consider all
Blockchain based assets other than Bitcoin, Ether, Litecoin and
Bitcoin Cash to be securities until otherwise deemed not to be by the
relevant regulatory US regulatory bodies.  Experts have a similar
prohibition against giving financial advice on the Platform. 
Seeking, obtaining or soliciting financial advice will void, nullify
and vitiate any representations and/or warranties we might offer or
incorporate herein. 

**GENERAL TERMS OF USAGE**

**Eligibility**

The Content, Platform, and
Services are intended solely for persons who are 18 or older. Any
access to or use of the Content, Platform, or Services by anyone
under 18 is expressly prohibited. By accessing or using the Content,
Platform, or Services, you represent and warrant that you are 18 or
older.

**Trademarks**

“Dimpull” is a trademark
used by us, Dimpull Inc., to uniquely identify our website, business,
and service. You agree not to use this phrase anywhere without our
prior written consent. Additionally, you agree not to use our trade
dress, or copy the look and feel of our website or its design,
without our prior written consent. You agree that this paragraph goes
beyond the governing law on intellectual property law, and includes
prohibitions on any competition that violates the provisions of this
paragraph.

All trademarks, service marks,
logos, trade names, and any other proprietary designations of Dimpull
used herein are trademarks or registered trademarks of Dimpull. Any
other trademarks, service marks, logos, trade names, and any other
proprietary designations are the trademarks or registered trademarks
of their respective parties.

**Revocation of Consent**

Where Dimpull has given prior
written consent for your use of our protected material in accordance
with our above “Copyright” and “Trademarks” provisions, we
may revoke that consent at any time. If we so request, we may require
that you immediately take action to remove from circulation, display,
publication, or other dissemination, any of the marks, copyrighted
content, or other materials that we previously consented for you to
use.

**Code of Conduct**

You understand and agree that
you are solely responsible for compliance with any and all laws,
rules, regulations, and Tax obligations that may apply to your use of
the Platform or any of the Services. In connection with your use of
our Content, Platform, and Services, you may not and you agree that
you will not:

- violate any local, state,
  provincial, national, or other law or regulation, or any order of a
  court, including, without limitation, zoning restrictions, and Tax
  regulations; 
- hack, crack, phish, SQL
  inject, or otherwise interfere with the integrity of the computer
  systems of our Site, Service, or Users; 
- defame anyone; 
- defraud, mislead, or
  otherwise act dishonestly; 
- copy, store, or otherwise
  access any information contained on the Platform, or within any
  Content appearing therein, for purposes not expressly permitted by
  these Terms; 
- use the Platform or Services
  for any commercial or other purposes that are not expressly
  permitted by these Terms; 
- use our Platform to transmit,
  distribute, post or submit any information concerning any other
  person or entity, including without limitation, photographs of
  others without their permission, personal contact information or
  credit, debit, calling card, or account numbers; 
- stalk or harass any other
  user of our Platform or Services, or collect or store any personally
  identifiable information about any other user other than for
  purposes of transacting as a Client; 
- impersonate any person or
  entity, or falsify, or otherwise misrepresent yourself or your
  affiliation with any person or entity; 
- run any bots or other
  software to aggregate or browse our content, including but not
  limited to company or jobseeker profiles; 
- post fake information,
  whether it is about a job, company, or your own credentials as a job
  applicant; 
- infringe on anyone’s
  intellectual property rights; 
- otherwise act in a manner
  which, at Dimpull Inc.’s sole discretion, is objectionable, or
  which may bring Dimpull Inc. into disrepute. 

**Termination, Account
Cancellation, and Severability,**

We may at any time without
liability to you, with or without cause, with or without prior notice
and at any time: (a) terminate these Terms or your access to our
Content, Platform, and Services, and (b) deactivate or cancel your
Account. In the event we terminate these Terms, or your access to our
Content, Platform and Services, or deactivate or cancel your Account,
you will remain liable for all amounts due in connection with any
Exper Sessions or other Services you have purchased. You may cancel
your Account at any time by sending an email to
admin@dimpull.com[___________]. Please
note that if your Account is cancelled, we do not
have an obligation to delete or return to you any Content you have
posted to the Platform, including, but not limited to, any job
applications, reviews, or feedback.

In the event that a provision
of this Agreement is found to be unlawful, conflicting with another
provision of the Agreement, or otherwise unenforceable, the Agreement
will remain in force as though it had been entered into without that
unenforceable provision being included in it.

**Disclaimers; Limitation of
Liability**

IF YOU CHOOSE TO USE THE
PLATFORM AND/OR THE SERVICES, YOU DO SO AT YOUR OWN RISK. YOU
ACKNOWLEDGE AND AGREE THAT DIMPULL DOES NOT HAVE AN OBLIGATION TO
CONDUCT BACKGROUND CHECKS ON ANY EXPERT OR CLIENT.  NO ADVICE OR
INFORMATION, WHETHER ORAL OR WRITTEN, OBTAINED FROM DIMPULL, ITS
SUBSIDIARIES, OFFICERS, DIRECTORS, EMPLOYEES, AGENTS OR AFFILIATES,
OR THROUGH THE PLATFORM OR COLLECTIVE CONTENT WILL CREATE ANY
WARRANTY NOT EXPRESSLY MADE HEREIN.  YOU ARE SOLELY RESPONSIBLE FOR
ALL OF YOUR COMMUNICATIONS AND INTERACTIONS WITH OTHER USERS OF THE
PLATFORM OR SERVICES, AND WITH OTHER PERSONS WITH WHOM YOU
COMMUNICATE OR INTERACT AS A RESULT OF YOUR USE OF THE PLATFORM OR
SERVICES, INCLUDING, BUT NOT LIMITED TO, ANY EXPERTS OR CLIENTS. YOU
UNDERSTAND THAT DIMPULL DOES NOT MAKE ANY ATTEMPT TO VERIFY THE
STATEMENTS OF USERS OF THE PLATFORM OR SERVICES OR TO EVALUATE THE
QUALITY OF ANY EXPERT SESSIONS PRIOR TO THE TIME OF SALE.  DIMPULL
MAKES NO REPRESENTATIONS OR WARRANTIES AS TO THE CONDUCT OF USERS OF
THE PLATFORM OR SERVICES OR THEIR COMPATIBILITY WITH ANY CURRENT OR
FUTURE USERS OF THE PLATFORM OR SERVICES. YOU AGREE TO TAKE
REASONABLE PRECAUTIONS IN ALL COMMUNICATIONS AND INTERACTIONS WITH
OTHER USERS OF THE PLATFORM OR SERVICES AND WITH OTHER PERSONS WITH
WHOM YOU COMMUNICATE OR INTERACT AS A RESULT OF YOUR USE OF THE
PLATFORM OR SERVICES, INCLUDING, BUT NOT LIMITED TO, EXPERTS AND
CLIENTS, PARTICULARLY IF YOU DECIDE TO MEET OFFLINE OR IN PERSON
REGARDLESS OF WHETHER SUCH MEETINGS ARE ORGANIZED OR OTHERWISE
FACILITATED BY DIMPULL.  NEITHER DIMPULL, NOR ANY OF ITS
SUBSIDIARIES, OFFICERS, DIRECTORS, EMPLOYEES, AGENTS AND AFFILIATES,
MAKES ANY WARRANTY REGARDING THE QUALITY OF ANY EXPERTS, EXPERT
SESSIONS OR ANY OTHER SERVICES OR COLLECTIVE CONTENT, OR THE
ACCURACY, TIMELINESS, TRUTHFULNESS, COMPLETENESS OR RELIABILITY OF
ANY COLLECTIVE CONTENT OBTAINED THROUGH THE PLATFORM OR SERVICES.

DIMPULL TOGETHER WITH ITS
SUBSIDIARIES, OFFICERS, DIRECTORS, EMPLOYEES, AGENTS, AND AFFILIATES,
PROVIDE THE PLATFORM, SERVICES AND COLLECTIVE CONTENT “AS IS,”
WITHOUT WARRANTY OF ANY KIND, EITHER EXPRESS OR IMPLIED. WITHOUT
LIMITING THE FOREGOING, DIMPULL, ITS SUBSIDIARIES, OFFICERS,
DIRECTORS, EMPLOYEES, AGENTS AND AFFILIATES EXPLICITLY DISCLAIM ANY
WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE,
QUIET ENJOYMENT OR NON-INFRINGEMENT, AND ANY WARRANTIES ARISING OUT
OF COURSE OF DEALING OR USAGE OF TRADE. NEITHER DIMPULL, NOR ANY OF
ITS SUBSIDIARIES, OFFICERS, DIRECTORS, EMPLOYEES, AGENTS AND
AFFILIATES, MAKES ANY WARRANTY THAT THE PLATFORM, SERVICES, OR
COLLECTIVE CONTENT, INCLUDING, BUT NOT LIMITED TO, THE EXPERTS OR ANY
EXPERT SESSIONS INCLUDED THEREIN, WILL MEET YOUR REQUIREMENTS OR BE
AVAILABLE ON AN UNINTERRUPTED, SECURE, OR ERROR-FREE BASIS. 

NEITHER DIMPULL, NOR ANY OF
ITS SUBSIDIARIES, OFFICERS, DIRECTORS, EMPLOYEES, AGENTS AND
AFFILIATES, ASSUMES ANY LIABILITY OR RESPONSIBILITY FOR ANY (I) ANY
UNAUTHORIZED ACCESS TO OR USE OF OUR SECURE SERVERS AND/OR ANY AND
ALL PERSONAL INFORMATION AND/OR FINANCIAL INFORMATION STORED THEREIN,
(II) ANY INTERRUPTION OR CESSATION OF TRANSMISSION TO OR FROM OUR
SERVICES, (III) ANY BUGS, VIRUSES, TROJAN HORSES, OR THE LIKE WHICH
MAY BE TRANSMITTED TO OR THROUGH OUR SERVICES BY ANY THIRD PARTY,
AND/OR (V) ANY ERRORS OR OMISSIONS IN ANY CONTENT OR FOR ANY LOSS OR
DAMAGE OF ANY KIND INCURRED AS A RESULT OF THE USE OF ANY CONTENT
POSTED, EMAILED, TRANSMITTED, OR OTHERWISE MADE AVAILABLE VIA THE
PLATFORM OR DURING THE COURSE OF YOUR USE OF THE SERVICES.

TO
THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, EXCEPT FOR EITHER
PARTY’S INDEMNIFICATION OBLIGATIONS, DAMAGES ARISING FROM A PARTY’S
WILLFUL MISCONDUCT, GROSS NEGLIGENCE, OR FRAUD (A) IN NO EVENT SHALL
EITHER PARTY BE LIABLE TO THE OTHER PARTY HEREUNDER FOR ANY LOST
PROFITS OR LOST BUSINESS, OR FOR ANY CONSEQUENTIAL, INCIDENTAL,
SPECIAL, OR INDIRECT DAMAGES OF ANY KIND, WHETHER ARISING IN
CONTRACT, TORT OR OTHERWISE, AND REGARDLESS OF WHETHER SUCH PARTY HAS
BEEN NOTIFIED OF THE POSSIBILITY OF SUCH DAMAGES; AND (B) EITHER
PARTY’S MAXIMUM AGGREGATE LIABILITY FOR ANY DAMAGES CLAIM RELATING
TO THIS AGREEMENT SHALL NOT EXCEED FIVE THOUSAND DOLLARS ($5,000).

**DMCA Notices**

We take copyright infringement
very seriously, and we have registered a Copyright Agent with the
United States Copyright Office, which limits our liability under
the _Digital
Millennium Copyright Act_.
If you believe that your copyright has been infringed, please send us
a message which contains:

- your name; 
- the name of the party whose
  copyright has been infringed, if different from your name; 
- the name and description of
  the work that is being infringed; 
- the location on our website
  of the infringing copy; 
- a statement that you have a
  good faith belief that use of the copyrighted work described above
  is not authorisedauthorized by the copyright
  owner (or by a third party who is legally entitled to do so on
  behalf of the copyright owner) and is not otherwise permitted by
  law; 
- a statement that you swear,
  under penalty of perjury, that the information contained in this
  notification is accurate and that you are the copyright owner or
  have an exclusive right in law to bring infringement proceedings
  with respect to its use;  
  
 

You must sign this
notification and send it to our Copyright Agent at:  

Attn:
Dimpull Copyright Agent  

[_______]100 Bogart Street, Third
Floor  

Brooklyn, NY 11206[___________] 

[____________]  

[[email
address]](mailto:info@thedailymuse.com)[admin@dimpull.com](mailto:info@thedailymuse.com)

If sending the notification by
email, an electronic signature is acceptable.

Although no similar provisions
exist under U.S. law for trademark infringement, we recommend that
you submit similar information to us about any alleged trademark
infringement so that we can take appropriate action.

**Representations &
Warranties**

We make no representations or
warranties as to the merchantability of our Content, Platform, or
Services or fitness for any particular purpose. You agree that you
are releasing us from any liability that we may otherwise have to you
in relation to or arising from this Agreement or our products, for
reasons including, but not limited to, failure of our service, loss
of income, negligence, or any tort or other cause of action. To the
extent that applicable law restricts this release of liability, you
agree that we are only liable to you for the minimum amount of
damages that the law restricts our liability to, if such a minimum
exists.

You agree that we are not
responsible in any way for offers made by third parties through our
website.

We are not liable for any
failure of our service, including any failures or disruptions,
scheduled or unscheduled, intentional or unintentional, on our
website which prevent access to our website temporarily or
permanently.

You acknowledge and agree that
our website may become unavailable at any given time, temporarily or
permanently, with or without notice, and we will not be liable to you
for any loss therefrom.

The provision of our service
to you is contingent on your agreement with this and all other
sections of this Agreement. Nothing in the provisions of this
"Representations & Warranties" section shall be
construed to limit the generality of the first paragraph of this
section.

**Indemnification**

You agree to indemnify and
hold harmless Dimpull and its principals, shareholders, agents,
officers, directors, consultants, and employees form or against
third-party claims, damages, payments, deficiencies, fines,
judgments, settlements, liabilities, losses, costs, and expenses
arising from or relating to any third-party claim, suit, action or
proceeding arising out of the breach of your representations and
warranties contained herein.

**External Links**

We
may link to third-party websites from our own website including,
among other things, expert websites or third-party payment
processors. We have no control over, and are not responsible for,
these third-party websites or their use of your personal information.
We recommend that you review their privacy policies and other
agreements governing your use of their website.

**Notices**

You consent to receive
communications from us electronically. We will communicate with you
by email (using the email address you provide to us either during the
registration process or when you updated your email address) or by
posting notices on this Platform. You agree that all agreements,
notices, disclosures, and other communications that we provide to you
electronically satisfy any legal requirement that such communications
be in writing. In addition to, but not in limitation of the
foregoing, except as explicitly stated otherwise, any notices to us
shall be given by email. 

**Choice of Law**

This Agreement shall be
governed by the laws in force in the State of New York. The offer and
acceptance of this contract is deemed to have occurred in the State
of New York.

**Forum of Dispute**

You agree that any dispute
arising from or relating to this Agreement will be heard solely by a
court of competent jurisdiction in the State of New York.
Specifically, you agree that any disputes shall be heard, where
eligible, solely within the Civil Court of the City of New York—Small
Claims Part (“Small Claims Court”).

You agree that where the
amount you would otherwise claim exceeds the monetary jurisdiction of
the Small Claims Court, which at the time of the publication of this
Agreement is up to $5,000, you will waive your right to collect any
damages in excess of the monetary jurisdiction and instead only sue
us for the maximum amount of $5,000.

Likewise, if you have multiple
causes of action, you agree that if your claim would be eligible to
be heard by the Small Claims Court, except that one or more of the
causes of action or other rights to collect damages would not be
eligible for the Small Claims Court to hear, you will waive your
right to claim damages for any of the ineligible claims and instead
still bring the dispute in the Small Claims Court for only the claim
or claims over which the Small Claims Court has jurisdiction to hear.

Likewise, if you would
otherwise have any non-monetary remedies available to you outside of
the Small Claims Court, such as the right to an injunction, specific
performance, or other equitable relief, you agree that you will waive
your right to obtain such relief against us. If you bring a dispute
in a manner other than in accordance with this section, you agree
that we may move to have it dismissed, and that you will be
responsible for our reasonable attorneys' fees, court costs, and
disbursements in doing so.

You agree that the prevailing
party in any dispute will be entitled to claim from the unsuccessful
party the entire amount of the prevailing party's reasonable
attorneys’ fees, costs, and disbursements in relation to the
dispute.

**Assignment**

These Terms, and any rights
and licenses granted hereunder, may not be transferred or assigned by
you, but may be assigned by us without restriction.

This Agreement may not be
assigned, in whole or in part, by Expert or any other party without
the prior written consent of the Company, and such consent may be
withheld for any reason or no reason.

**Force Majeure**

You agree that we are not
responsible to you for anything that we may otherwise be responsible
for, if it is the result of events beyond our control, including, but
not limited to, acts of God, war, insurrection, riots, terrorism,
crime, labor shortages (including lawful and unlawful strikes),
embargoes, postal disruption, communication disruption, failure or
shortage of infrastructure, shortage of materials, or any other event
beyond our control.

**Miscellaneous**

These Terms, together with the
Privacy Policy, and any other legal notices published by us on the
Platform, shall constitute the entire agreement between you and
Dimpull concerning the Platform, your use of the Services and any
Content. If any provision of these Terms is deemed invalid by a court
of competent jurisdiction, the invalidity of such provision shall not
affect the validity of the remaining provisions of these Terms, which
shall remain in full force and effect. No waiver of any one provision
set forth in these Terms shall be deemed a further or continuing
waiver of such provision or any other provision, and Dimpull’s
failure to assert or enforce any right or provision under these Terms
shall not constitute a waiver of such right or provision. 

**Amendments**

We may amend these Terms from
time to time, and the amended version will be posted on our website
in place of the old version and it is your responsibility to check
these terms for any amendments. We will also include the date that
the currently displayed Terms took effect to help you determine
whether there have been any changes since you last used our website.
Like our Privacy Policy, you must visit this page each time you come
to our website and read and agree to it if the date it was last
modified is more recent than the last time you agreed to the Privacy
Policy. If you do not agree to the new Terms or Privacy Policy, you
must immediately cease using our Content, Platform, and Services.

**Contact**

Any
inquiries about your rights under these Terms, or any other matters
regarding your privacy, can be directed to:
admin@dimpull.com [________]

**Last
Modified: [May __, 2018].**
`}
              </Markdown>
            </Dialog>
          </div>
        )
      }
      </div>
    )
  }
}

export default DragDropContext(HTML5Backend)(Availability);