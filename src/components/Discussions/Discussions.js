import React from 'react';
import {GridList, GridTile} from 'material-ui/GridList';
import IconButton from 'material-ui/IconButton';
import Subheader from 'material-ui/Subheader';
import StarBorder from 'material-ui/svg-icons/toggle/star-border';
import axios from 'axios';
// import { browserHistory } from 'react-router';
import {Link} from 'react-router-dom';

const styles = {
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
  },
  gridList: {
    width: 500,
    overflowY: 'hidden',
  },
};

class Discussions extends React.Component {
	constructor(props) {
    super(props);
    this.state = {dps: [{
        image: 'images/grid-list/hats-829509_640.jpg',
        host: 'Hats',
        description: 'Hans',
        id:0,
      },]
    };
  }

  componentDidMount(){
  	axios.get(`${process.env.REACT_APP_USERS_SERVICE_URL}/api/discussions`)
  	  .then((response) => 
  	    this.setState({dps: response.data}))
  	  .catch(function (error) {
  	    console.log(error)
  	  })
    };

    handleClick(id){
      // browserHistory.push({
      //   pathname: `/discussionProfile`,
      //   search: `?id=${id}`
      // });
    }

/**
 * A simple example of a scrollable `GridList` containing a [Subheader](/#/components/subheader).
 */
 render() {
    return (
	  <div style={styles.root}>
	    <GridList
	      cellHeight={180}
        id="GridlistID"
	      style={styles.gridList}
	    >
	      <Subheader>Discussion Profiles</Subheader>
	      {this.state.dps.map((dp) => (
          <Link to={`/discussionProfile?id=${dp.id}`} key={dp.id}>
	        <GridTile
	          key={dp.id}
	          title={dp.description}
	          subtitle={<span>by <b>{dp.host}</b></span>}
	          actionIcon={<IconButton><StarBorder color="white" /></IconButton>}
            onClick={() => this.handleClick(dp.id)}
	        >
	          <img src={dp.image} alt={dp.id} />
	        </GridTile>
          </Link>
	      ))}
	    </GridList>
	  </div>
);
}
}

export default Discussions;