/**
 * Created by eric on 4/5/17.
 */
'use strict';

import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
import QuoteTable from './quotetable'

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {search: ''};
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentDidMount() {
        const expectedRows = ['rank', 'symbol', 'name', 'last', 'percent_change'];
        $.get('api/index', function(data) {
            $('.loader').remove();
            const tables = (<div>
                <div className="col-sm-12">
                    <h2>Most Active Quotes</h2>
                    <div className="index-tables table-responsive">
                        <QuoteTable columns={expectedRows} quotes={data['top_active']} key="top_active"/>
                    </div>
                </div>
                <div className="col-sm-6">
                    <h2>Winners</h2>
                    <div className="index-tables table-responsive">
                        <QuoteTable columns={expectedRows} quotes={data['top_gain']} key="top_gain" />
                    </div>
                </div>
                <div className="col-sm-6 index-tables table-responsive">
                    <h2>Losers</h2>
                    <div className="index-tables table-responsive">
                        <QuoteTable columns={expectedRows} quotes={data['top_lose']} key="top_lose"/>
                    </div>
                </div>
            </div>);

            ReactDOM.render(
                tables,
                document.getElementById('pagecontent')
            );
        });
    }

    handleInputChange(e) {
        this.setState({'search': e.target.value});
    }

    handleSubmit(e) {
        e.preventDefault();
        // console.log("SUBMIT: ", this.state);
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
                <div className="col-sm-12 page" id="pagecontent">
                    <div className="loader"></div>
                </div>
                </div>
            </Router>
        );
    }
}
export default App;