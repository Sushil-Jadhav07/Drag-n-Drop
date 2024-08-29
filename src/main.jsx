import React from 'react';
import { createRoot } from 'react-dom/client'; // Correct import
import App from './App';

const rootElement = document.getElementById('root');
const root = createRoot(rootElement); // Create the root

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
