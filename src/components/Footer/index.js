import React from 'react';
import './styles.css';

export const Footer = () =>
		<div>
		    <div className='footer'>
				<p style={{float:'left', position:'absolute', bottom:'0', fontSize: '13px'}}>
					<a style={{color: '#464545' }} href="https://sites.google.com/view/dimpull/home">Privacy Policy</a>
				</p>
		        <a href="mailto:admin@dimpull.com">
			        <img src='https://res.cloudinary.com/dtvc9q04c/image/upload/v1519823675/orangemagnet-48.png' 
			        style={{width: "40px",height: "auto"}} alt="logo" />
		        	<p>contact dimpull</p>
		        </a>
		    </div>
   		 </div>

// <a href="mailto:admin@dimpull.com">Contact</a>