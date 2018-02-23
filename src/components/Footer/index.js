import React from 'react';
import {Link} from 'react-router-dom';

/* component styles */
import { styles } from './styles.css';

export const Footer = () =>
    <footer className={`${styles}`}>
        <div className="container">
            <div className="row">
                <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                    <p><a href="mailto:admin@dimpull.com">Contact Dimpull</a></p>

                </div>
            </div>
        </div>
    </footer>;

// <a href="mailto:admin@dimpull.com">Contact</a>