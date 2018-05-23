import React from 'react';
import './styles.css';
import {Follow} from 'react-twitter-widgets';

export const Footer = () =>
  <div style={{marginTop: '143px'}}>
    <div className="footer" style={{ marginTop: '20px', height: '160px' }}>
      <p style={{ float: 'left', position: 'absolute', bottom: '0', fontSize: '14px' }}>
        <a style={{ color: '#464545' }} href="https://sites.google.com/view/dimpull/home">Privacy Policy</a>
      </p>
      <img src='https://res.cloudinary.com/dtvc9q04c/image/upload/v1519823675/orangemagnet-48.png' id="logo" alt="logo" />     
      <div id="links" >
        <div style={{ paddingBottom: '4px', paddingLeft: '19px'}}>
          <a href="mailto:admin@dimpull.com" >
            admin@dimpull.com
          </a>
        </div>
      <div style={{paddingBottom: "12px", paddingLeft: "19px"}}>
        <a href="https://medium.com/@dimpull" >
          <img src='https://res.cloudinary.com/dtvc9q04c/image/upload/c_scale,w_77/v1520797682/mediumcropped.png' alt="medium" />
        </a>
      </div>
      <div id="twitter">
        <Follow username='dimpull'  options={{ showCount: false, size: 'large' }} /> 
      </div>
      </div>
    </div>
    </div>

// <a href="mailto:admin@dimpull.com">Contact</a>