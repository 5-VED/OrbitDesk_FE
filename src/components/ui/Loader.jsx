import React from 'react';
import './Loader.css';

export const Loader = ({ size = 'medium', fullScreen = false }) => {
    const containerClass = fullScreen ? 'loader-container-fullscreen' : 'loader-container';
    const spinnerClass = `loader-spinner ${size}`;

    return (
        <div className={containerClass}>
            <div className={spinnerClass}></div>
        </div>
    );
};
