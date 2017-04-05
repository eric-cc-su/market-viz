/**
 * Created by eric on 4/5/17.
 */
'use strict';

import React from 'react'
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {search: ''};
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleInputChange(e) {
        this.setState({'search': e.target.value});
    }

    handleSubmit(e) {
        e.preventDefault();
        console.log("SUBMIT: ", this.state);
        this.setState({'search': ''});
    }

    render() {
        return (
            <Router>
                <div>
                <nav className="navbar navbar-default">
                  <div className="container-fluid">
                    <div className="navbar-header">
                      <button type="button" className="navbar-toggle collapsed" data-toggle="collapse" data-target="#bs-example-navbar-collapse-1" aria-expanded="false">
                        <span className="sr-only">Toggle navigation</span>
                        <span className="icon-bar"></span>
                        <span className="icon-bar"></span>
                        <span className="icon-bar"></span>
                      </button>
                      <a className="navbar-brand" href="#">Market Viz</a>
                    </div>

                    <div className="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
                      <ul className="nav navbar-nav">
                      </ul>
                      <form className="navbar-form navbar-right" onSubmit={this.handleSubmit}>
                        <div className="form-group">
                          <input type="text" className="form-control" placeholder="Search" onChange={this.handleInputChange} />
                        </div>
                        <button type="submit" className="btn btn-default">Submit</button>
                      </form>
                    </div>
                  </div>
                </nav>
                <div className="col-sm-12 page">

                </div>
                </div>
            </Router>
        );
    }
}
export default App;