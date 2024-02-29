import React from 'react';
import './spinner.css';

export default function Spinner() {
  return (
    <div className='w-screen'>
      <div className="loading-spinner-container">
        <div className="loading-spinner"></div>
      </div>
    </div>
  )
}
