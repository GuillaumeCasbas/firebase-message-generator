import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

const config = {
  firebaseServerKey: process.env.REACT_APP_FIREBASE_SERVER_KEY || '',
  defaultTitle: process.env.REACT_APP_DEFAULT_TITLE || '',
  defaultBody: process.env.REACT_APP_DEFAULT_BODY || '',
}
ReactDOM.render(
  <React.StrictMode>
    <App config={config} />
  </React.StrictMode>,
  document.getElementById('root')
);
