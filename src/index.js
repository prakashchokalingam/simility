import React from 'react';
import ReactDOM from 'react-dom';
// ui
window.jQuery = window.$ = require('jquery');
require('bootstrap/dist/js/bootstrap.min.js');
require('bootstrap/dist/css/bootstrap.min.css');
import './index.css';

// router
import {
    Router,
    Route,
    browserHistory
} from 'react-router';

// components
import App from './App';
// routes

ReactDOM.render((
  <Router history={browserHistory}>
    <Route path="/" component={App}>
    </Route>
  </Router>
), document.getElementById('root'))
