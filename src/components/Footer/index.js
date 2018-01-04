import React from 'react';

/* component styles */
import { styles } from './styles.css';

export const Footer = () =>
    <footer className={`${styles}`}>
        <div className="container">
            <div className="row">
                <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                    <p>© Dimpull 2018</p>
                </div>
            </div>
        </div>
    </footer>;
