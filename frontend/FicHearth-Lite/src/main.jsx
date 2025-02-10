import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';  // Import your App component
import './style.css';  // Optional global styles

// Find the element where you want to render your app
const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

