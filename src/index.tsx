import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import {LineJoints} from './LineJoints';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <LineJoints />
  </React.StrictMode>
);
