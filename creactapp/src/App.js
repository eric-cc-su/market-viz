import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import {TickerForm} from './components/TickerForm'

class App extends Component {
  state = {'results': null};

  handleFormSubmit(e) {
      e.preventDefault();
  }

  render() {
    return (
      <div className="App">
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h2>Welcome to React</h2>
        </div>
        <TickerForm />
      </div>
    );
  }
}

export default App;
