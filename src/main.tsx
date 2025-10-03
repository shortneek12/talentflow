// src/main.tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Import the MirageJS server factory
import { makeServer } from './api/server';

// // Start the server in development mode
// if (process.env.NODE_ENV === 'development') {
//   makeServer();
// }
makeServer({ environment: 'production' });

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);