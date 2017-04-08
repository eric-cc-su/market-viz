/**
 * Created by eric on 4/6/17.
 */
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import QuoteTable from './quotetable'

class Home extends Component {
    constructor(props) {
        super(props);
        this.renderQuoteLists = this.renderQuoteLists.bind(this);
    }

    componentDidMount() {
        $.get('api/index', function(data) {
            $('.loader').remove();
            if (data.market_open) { this.renderQuoteLists() }
            else {
                ReactDOM.render(
                    (<h1>Markets closed. Top stocks unavailable</h1>),
                    document.getElementById('pagecontent')
                );
            }
        });
    }

    renderQuoteLists() {
        const expectedRows = ['rank', 'symbol', 'name', 'price', 'percent_change'];

        const tables = (<div>
            <div className="col-sm-12">
                <h2>Most Active</h2>
                <div className="index-tables table-responsive">
                    <QuoteTable columns={expectedRows} class="table-hover" name='top_active' quotes={data['top_active']}
                                key="top_active"/>
                </div>
            </div>
            <div className="col-sm-6">
                <h2>Winners</h2>
                <div className="index-tables table-responsive">
                    <QuoteTable columns={expectedRows} class="table-hover" name='top_gain' quotes={data['top_gain']}
                                key="top_gain"/>
                </div>
            </div>
            <div className="col-sm-6">
                <h2>Losers</h2>
                <div className="index-tables table-responsive">
                    <QuoteTable columns={expectedRows} class="table-hover" name='top_lose' quotes={data['top_lose']}
                                key="top_lose"/>
                </div>
            </div>
        </div>);

        ReactDOM.render(
            tables,
            document.getElementById('pagecontent')
        );

    }

    render() {
        return (
            <div className="col-sm-12 page" id="pagecontent">
                <div className="loader"></div>
            </div>
        );
    }
}

export default Home;