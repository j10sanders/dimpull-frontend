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
import history from '../history';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import Snackbar from 'material-ui/Snackbar';
import CircularProgress from 'material-ui/CircularProgress';
import TextField from 'material-ui/TextField';

const Markdown = require('react-remarkable');
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
        tc: false,
        initialsErrorText: 'Initialize form in order to accept'
	    }
    this.moveEvent = this.moveEvent.bind(this)
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
    this.fetchTimes()
  }

  async fetchTimes () {
    const { isAuthenticated } = this.props.auth;
    const { getAccessToken } = this.props.auth;
    let headers = {}
    if ( isAuthenticated()) {
      headers = { 'Authorization': `Bearer ${getAccessToken()}`}
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

	removeTimeslot (event) {
		let events = this.state.events
		var filtered = events.filter(function(el) { return el.id !== event.id });
		this.setState({events: filtered})
		this.setState({open: false})
	}

	submit () {
		axios.post(`${process.env.REACT_APP_USERS_SERVICE_URL}/api/savetimeslots`,
      {
        user_id: this.state.profile.sub,
        times: this.state.events,
    	})
    	history.replace('/experts');
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
  	
  render() {
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
        disabled={this.state.initialsErrorText}
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
            <Paper style={{ marginTop: '10px', marginBotton: '20px' }} >
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
            :        
            <Dialog
              title="Terms and Conditions"
              actions={tAndC}
              modal={false}
              open={this.state.tc}
              onRequestClose={this.handleCloseTC}
              autoScrollBodyContent={true}
            >
              <Markdown>{`
**DIMPULL INC.**
**EXPERT
AGREEMENT**

**THIS
EXPERT AGREEMENT**
(the “Agreement”) is made and entered into as of ________________
the date you submit your initial availability schedule (the
“Effective Date”) by and between Dimpull Inc., a [Delaware
corporation] with its principal place of business in New York
(“Dimpull” or the “Company”), and
______________________________, a individual with a residence at
____________________ (the
“Expert”) (herein referred to collectively as the “Parties”).
This Agreement incorporates by reference The Company Expert
Marketplace Legal Terms & Conditions, outlined below.

**Definition
of Services**

The
Company allows its users to pay to book consultations with experts in
Blockchain technology, including, but not limited to, Blockchain
asset technical review, ICO roadmapping, software code analysis (the
“Services”) and pay via Ethereum cryptoassets
via The Company’s website (currently located at www.[dimpull].com)
and any successor and affiliated websites (the “Website”).
Website includes profiles of Experts and user reviews to help users
select a Expert based on their needs. The Company is a third-party in
this transaction, connecting Company users with experts such as
Expert, who is operating independently as a contractor subject to our
limited rules and restrictions.

**Expert
Service Delivery**

Expert
will provide all Services booked via Company virtually to users
(e.g., phone) and will not meet Company users in person. In-person
meetings are strictly prohibited, void all warranty under this
Agreement as it relates to that client, and may result in the
immediate termination of this Agreement.

**Expert
Code of Conduct**

Professionalism
is at the heart of all we do at Company, and giving our users a
consistently great experience is really important to us. By working
with Company, Expert recognizes the following Code of Conduct:

- Expert
  will be respectful towards Company users, and will alert Company in
  writing if a user is acting with disrespect towards Expert.  
- Expert
  will hold and maintain in strict confidence all Company user
  information to which they are privy while performing the Services,
  except as may be required by a court or governmental authority. 
- Expert
  will reply to user requests within 2 business days and keep their
  availability up to date on Company Website to avoid over-booking.
  Canceling or over-booking users may lead to Expert being removed
  from Company Website and termination of this Agreement. 
- Experts
  will not conduct in person meeting with users. 
- Experts
  will reframe from providing any financial advice as more fully
  described in Section 4 of the Legal Terms & Conditions. 

**Pricing
and Payment Terms**

Company’s
Eethereum based smart contract will only pay Expert for Services
completed according to the Service Details and Pricing Plan (Exhibit
A), which is subject to change at any time, with notice to Expert.
Expert agrees to pay the gas prices for processing and mining the
ethereum smart contract onto the ethereum blockchain (defined in
Exhibit A).

Prices
on the Website may differ from Expert pricing on other platforms.

**Intellectual
Property **

Expert
will retain full copyright to original works owned by Expert and used
or created in the performance of the Services. Expert warrants and
represents that all intellectual property used in performance of
Services is owned wholly and exclusively by Expert and that it does
not infringe on any third party intellectual property rights or
publicity rights. 

Expert
grants Company the right to create a profile for Expert on the
Website to promote to Company audience, using Expert’s likeness as
submitted by Expert. This profile is subject to change at any time,
and Expert may suggest changes to Company. Expert shall provide such
materials, and otherwise cooperate, as may be reasonably requested by
Company.

**Promotional
Uses**

Company
may include Expert’s name and likeness in promotional materials,
including without limitation, for promotion of Expert and Company to
users on-site and off-site.

Expert
may use Company name and logo in their own promotion off-site,
subject to Company permission.

**Termination**

Both
Parties may terminate the Agreement at any time, for any reason. 
Company reserves the right to refuse Expert access to the Services at
any time for any reason. If Expert terminates the Agreement or
reduces the number of Services offered on Company, Expert is
responsible for completing any existing Services booked prior to
termination, at the discretion of Company. If Company terminates the
Agreement or reduces the number of Services that Expert may offer on
Company, Company will pay out any outstanding undisputed amounts due
for Services completed, and may allow for partially completed
Services to be fulfilled by Expert, at Company’s discretion. 

**Non-Solicitation
and Non-Competition **

Any
action by Expert to avoid transacting with Company users via Company
Website is considered fee avoidance, violating section [3] of the
Legal Terms & Conditions, and is strictly prohibited by Company.
This includes, for example, encouraging or allowing users to purchase
Services offered by Expert on Company through another venue. Expert
may only take Company users on as clients through another venue for
Services which Company does not allow Expert to list. Any
transactions, bookings, or services that are booked outside of
Company Website are not covered by this Agreement or any warranty,
term, provision contained herein. 

**Dispute
resolution**

In
the case of a dispute between Expert and user, Company will have sole
discretion in the resolution of the matter, and whether or not the
Services were completed and will be paid out. 

[]()[signatures
to follow]

**IN
WITNESS WHEREOF**, the
Parties hereto have executed this Expert Agreement as
of the Effective Date.

**EXPERT    Dimpull
Inc.**

By:   By: 

Name:
_________________________________   Name: Jonathan Sanders

      Title:
CEO

Address
for NoticeEmail Address for Notices:

**EXHIBIT
A**

**SERVICE
DETAILS AND PRICING PLAN**

Dimpull
Inc. (the “Company”) will pay Expert only for Services actually
completed according to the Service Details and Pricing Plan below:

Company’s
Eethereum based smart contract will distribute payment for Services
as follows:

1. 18%
  to Dimpull 
2. balance
  to the Expert, [less mining fees and gas]. 

**ONBOARDING
FORM**

**Expert
Information**

Name
of Expert as it will be publicly displayed on Dimpull Website: 

_________________________________________________________________________________

Primary
email (for Dimpull team correspondence):
______________________________________

Email
for Dimpull user correspondence (if different from
above):___________________________

Primary
phone number:
_____________________________________________________________

Skype
username (optional):
__________________________________________________________

**Ethereum
wallet public key Expert Payment**

[_________________________]

**DIMPULL
EXPERTING MARKETPLACE LEGAL TERMS**

_1.
Independent Contractor_

_Dimpull
Inc. (the “Company”) and Expert hereby agree that Expert be
engaged as an independent contractor, retaining control over and
responsibility for Expert’s own operations and personnel, if
applicable. Expert shall control the time, manner, and medium of
performance of the Agreement. Expert agrees to devote such effort and
time as is reasonably required to fulfill Expert’s duties in
connection with the Agreement hereunder. In addition, Expert shall
not use any sub-contractors to perform the Agreement without the
prior written approval of the Company. Expert will not be considered
an employee or agent of the Company as a result of this Agreement,
nor will Expert have the authority to contract in the name of or bind
the Company based on the consulting relationship established
hereunder. All fees payable to Expert hereunder shall be paid in
full, without any withholding, deduction, or offset of any federal,
state, or local income taxes, employment taxes, or other
withholdings. Expert acknowledges and agrees that Expert shall not
have any right to any compensation or benefits that the Company
grants its employees, including, without limitation, any salary,
pension, stock, bonus, profit sharing, insurance of any kind, health,
or other benefits. Expert agrees that Expert shall be solely
responsible for and shall pay all income taxes, payroll taxes, and
other withholdings (both employer and employee portions) with respect
to all fees paid by the Company hereunder, and agrees to indemnify
and hold the Company harmless from and against any and all loss,
liability, claim, cause of action, suit, fine, damage, judgment,
cost, or expense (including reasonable attorneys’ fees) arising out
of or in connection with any tax liability or other tax obligations
relating to payments made to Expert pursuant to this Agreement,
including, without limitation, any such taxes and withholdings
imposed as a result of any claim, or determination by any taxing
authority or otherwise, that Expert is not an independent contractor
with respect to the services performed hereunder. Expert may not hold
himself or herself as anything other than an “Expert” with
respect to his or her relationship with Dimpull._

_2.
Confidentiality_

_Each
party acknowledges that in connection with this Agreement it may
receive certain confidential or proprietary technical, business
and/or personal information and materials of the other party, and
customers, clients, vendors, and contacts of the Company
(“Confidential Information”). Each party, its agents, and
employees shall hold and maintain in strict confidence all
Confidential Information, shall not disclose Confidential Information
to any third party, and shall not use any Confidential Information
except as is necessary to perform the obligations described herein,
except as may be required by a court or governmental authority.
Notwithstanding the foregoing, Confidential Information shall not
include any information that is in the public domain or becomes
publicly known through no fault of the receiving party, or is
otherwise properly received from a third party without an obligation
of confidentiality._

_3.
Non-Circumvention_

_Except
as described in Expert’s Expert Agreement, Expert agrees not to in
any way whatsoever, directly or indirectly, in writing or orally,
circumvent the Company by soliciting, contacting, having discussions
with, dealing with, or contracting with any individuals, clients,
vendors, contacts, or employees revealed from the Company’s
Confidential Information, or through the course of engagement, and
for one (1) year thereafter. _

_4.
Waiver / Limitation of Liability  _

_EXCEPT
FOR THE EXPRESS REPRESENTATIONS AND WARRANTIES STATED IN THIS
AGREEMENT, NEITHER PARTY HERETO MAKES ANY WARRANTY WHATSOEVER. EACH
PARTY EXPLICITLY DISCLAIMS ANY OTHER WARRANTIES OF ANY KIND, EITHER
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO WARRANTIES OF
MERCHANTABILITY OR FITNESS FOR A PARTICULAR PURPOSE, LOST PROFITS,
INCREASED PROFITS, FAVORABLE OUTCOMES, IMPROVEMENTS, OR COMPLIANCE
WITH LAWS OR GOVERNMENT RULES OR REGULATIONS APPLICABLE TO THE
AGREEMENT. BREACH OF ANY OF THESE TERMS OR BUSINESS TERMS WILL
OTHERWISE VOID ANY REPRENTATIONS AND WARRANTIES PREVIOUSLY IN EFFECT._

_TO
THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, EXCEPT FOR EITHER
PARTY’S INDEMNIFICATION OBLIGATIONS, DAMAGES ARISING FROM A PARTY’S
WILLFUL MISCONDUCT, GROSS NEGLIGENCE, OR FRAUD (A) IN NO EVENT SHALL
EITHER PARTY BE LIABLE TO THE OTHER PARTY HEREUNDER FOR ANY LOST
PROFITS OR LOST BUSINESS, OR FOR ANY CONSEQUENTIAL, INCIDENTAL,
SPECIAL, OR INDIRECT DAMAGES OF ANY KIND, WHETHER ARISING IN
CONTRACT, TORT OR OTHERWISE, AND REGARDLESS OF WHETHER SUCH PARTY HAS
BEEN NOTIFIED OF THE POSSIBILITY OF SUCH DAMAGES; AND (B) EITHER
PARTY’S MAXIMUM AGGREGATE LIABILITY FOR ANY DAMAGES CLAIM RELATING
TO THIS AGREEMENT SHALL NOT EXCEED FIVE THOUSAND DOLLARS ($5,000)._

_4.
Representations & Warranties_

_Each
party represents and warrants to the other that such party is
authorized, empowered, and able to enter into and fully perform its
obligations under this Agreement; neither this Agreement nor the
fulfillment hereof infringes or will infringe the rights of any third
party; such factual representations made by such party to the other
are wholly truthful and verifiable; and any intellectual property
furnished by such party to the other is original and will infringe
upon the rights of any third-parties.  _

_Expert
represents and warrants that (i) Expert has read the [Coinbase
Securities GuidanceA Securities Law Framework for Blockchain Tokens
(https://www.coinbase.com/legal/securities-law-framework.pdf), (ii)
Expert understands that certain Blockchain assets may be considered
securities by the SEC; (iii) Expert understands that to give an
opinion about the relative price or financial performance of a
security or other investment is to give “financial advice” (iv)
Expert will not use the Company’s platform to give, solicit,
disseminate or provide “financial advice” to or from any user of
the Services; (v) giving or receiving financial advice will wholly
void and nullify this Agreement and any benefits or warranties._

_5.
Indemnification_

_Each
party agrees to indemnify and hold harmless the other and its
principals, shareholders, agents, officers, directors, consultants,
and employees form or against third-party claims, damages, payments,
deficiencies, fines, judgments, settlements, liabilities, losses,
costs, and expenses arising from or relating to any third-party
claim, suit, action or proceeding arising out of the breach of either
party’s representations and warranties contained herein. _

_6.
Miscellaneous_

_a.
Severability. The invalidity or unenforceability of any particular
provision of this Agreement shall not affect the other provisions
hereof and this Agreement shall be construed in all respects as if
such invalid or unenforceable provision were omitted._

_b.
Governing Law. This Agreement shall be governed by, and construed in
accordance with, the laws of the State of New York pertaining to
contracts made and to be wholly performed within such state, without
taking into account conflicts of laws principles. To the extent
Section 6(c) does not control, the parties agree that the courts
situated in New York, New York shall have exclusive jurisdiction
related to the claims arising out of or related to the Agreement._

_c.
Arbitration. To the extent not specifically prohibited by applicable
law, any dispute arising out of or relating to this Agreement, or any
transaction or relationship resulting from it that is not settled by
the parties themselves, will be resolved by binding arbitration in
New York, New York in accordance with (i) the U.S. Federal
Arbitration Act; (ii) the law governing this Agreement, to the extent
not inconsistent with the arbitral law; and (iii) the Commercial
Arbitration Rules of the American Arbitration Association (AAA) in
effect at the time of the demand for arbitration, to the extent not
inconsistent with this Agreement and items (i) and (ii) of this
section._

_d.
No Assignment by Expert. This Agreement may not be assigned, in whole
or in part, by Expert without the prior written consent of the
Company, and such consent may be withheld for any reason or no
reason._

_e.
Notices. Any notice or other communication required or permitted
under this Agreement shall be in writing and shall be deemed to have
been duly given if delivered via First Class Mail to each party at
their respective address above._

_f.
Non-Disparagement. Neither party will disparage the other or its
products or services to customers, potential customers, or the
public._
`}

</Markdown>
<TextField
  floatingLabelText="Initials"
  type="initials"
  value={this.state.initials}
  errorText={this.state.initialsErrorText}
  onChange={e => this.changeValue(e, 'initials')}
/> </Dialog>
          }

          </div>
        )
      }
      </div>
    )
  }
}

export default Calendar;