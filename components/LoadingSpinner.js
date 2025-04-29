// LoadingSpinner.js
import React from 'react';
import styles from './LoadingSpinner.module.css';
import './LoadingSpinner.module.css';

const LoadingSpinner = () => {
    return (
        <div className="loading-spinner">
            <div className="spinner"></div>
            <p>Loading...</p>
        </div>
    );
};

export default LoadingSpinner;