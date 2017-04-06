/**
 * Created by eric on 4/6/17.
 */
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import QuoteCell from './quotecell'
import {capitalizePhrase} from './utils'

class Quote extends Component {
    constructor(props) {
        super(props);
        this.state = {quote: {}};
        this.symbol = props.match.params.symbol;
        this.mountRender = this.mountRender.bind(this);
        this.cellClickHandler = this.cellClickHandler.bind(this);
    }

    componentDidMount() {
        $.get('/api/quote', {symbol: this.symbol}, function(data) {
            this.setState({quote: data});
            this.mountRender();
        }.bind(this));
    }

    cellClickHandler(e) {
        e.preventDefault();
        console.log("cell click!");
    }

    mountRender() {
        $('.loader').remove();
        var direction = this.state.quote['change_sign'] == 'u' ? 1 : -1;
        direction = this.state.quote['change_sign'] == 'e' ? 0 : direction;
        var quote_attrs = [
            ['Open', 'open'],
            ['Low', 'low'],
            ['High', 'high'],
            ['Volume', 'volume'],
            ['Previous Close', 'previous_close'],
            ['52 Week High', '52wk_high'],
            ['52 Week Low', '52wk_low'],
            ['P/E Ratio', 'price_earnings'],
            ['Earnings per Share', 'earnings_per_share'],
            ['Annual Dividend', 'annual_dividend'],
            ['Dividend Yield', 'dividend_yield', '%'],
            ['Volatility', 'volatility'],
        ];
        var quote_cells = [];
        quote_attrs.map((attrs, index) => {
            quote_cells.push(
                <QuoteCell title={attrs[0]}
                           data_value={this.state.quote[attrs[1]]}
                           unit={attrs.length > 2 ? attrs[2] : null}
                           onClick={this.cellClickHandler}
                           key={'qcell_'.concat(index)}
                />
            )
        });

        var render_data = (
            <div>
                <div className="col-sm-12">
                    <h1>{this.symbol.toUpperCase()}</h1>
                    <h2 style={{marginTop: 0}}><small>{capitalizePhrase(this.state.quote.name)}</small></h2>
                    <h2 className="quote-price">{this.state.quote.last_trade_price}</h2>
                    <h3 className={"quote-change" + (direction ? (direction == 1 ? " change-up" : " change-down") : null)}>{
                            (direction) ?
                                (<i className={"fa fa-arrow-" + (direction == 1 ? "up" : "down")} aria-hidden="true"></i>) :
                                null
                        } {this.state.quote.change} ({this.state.quote.percent_change}%)</h3>
                </div>
                <div>
                    {quote_cells}
                </div>
            </div>
        );
        ReactDOM.render(render_data, document.getElementById('pagecontent'));
    }

    render() {
        return (
            <div className="col-sm-12 page" id="pagecontent">
                <div className="loader"></div>
            </div>
        );
    }
}

export default Quote;