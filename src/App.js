import React, {
    Component
} from 'react';
import './App.css';

import Movies from './Movies';

class App extends Component {
    render() {
        return (
          <div className="App">
            <nav className="navbar navbar-default">
              <div className="container-fluid">
                <div className="navbar-header">
                  <a className="navbar-brand" href="/" >
                    Simility
                  </a>
                </div>
              </div>
            </nav>
            <Movies></Movies>
          </div>
        );
    }
}

export default App;
