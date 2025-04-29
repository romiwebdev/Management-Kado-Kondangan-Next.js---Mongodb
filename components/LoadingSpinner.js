// LoadingSpinner.js
import React from 'react';
import './LoadingSpinner.css'; // Pastikan untuk membuat file CSS untuk styling

const LoadingSpinner = () => {
    return (
        <div className="loading-spinner">
            <div className="spinner"></div>
            <p>Loading...</p>
        </div>
    );
};

export default LoadingSpinner;