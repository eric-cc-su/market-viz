/**
 * Created by eric on 4/6/17.
 */
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import QuoteCell from './quotecell'
import {capitalizePhrase} from './utils'
import PriceGraph from './visualization/PriceGraph'
import VolumeGraph from './visualization/VolumeGraph'

class Quote extends Component {
    constructor(props) {
        super(props);
        this.state = {quote: {}, timesales: []};
        this.symbol = props.match.params.symbol;
        this.mountRender = this.mountRender.bind(this);
        this.cellClickHandler = this.cellClickHandler.bind(this);
        this.activeGraph = 'price';
    }

    componentDidMount() {
        $.get('/api/quote', {symbol: this.symbol}, function(data) {
            this.setState({quote: data.quote, timesales: data.timesales});
            this.mountRender();
        }.bind(this))
            .fail(function(jqxhr, status, error) {
                var error_element = (
                    <div>
                        <h1>{jqxhr.status} {jqxhr.statusText}</h1>
                        <h2>{jqxhr.responseText}</h2>
                    </div>
                );
                $('.loader').remove();
                ReactDOM.render(error_element, document.getElementById('pagecontent'));
            });
    }

    cellClickHandler(e) {
        e.preventDefault();
        var target = e.currentTarget;
        $(target).toggleClass('active');
        var price_handlers = ['open', 'low', 'high', 'previous_close', '52wk_high', '52wk_low'];

        // Attribute in priceGraph
        if (price_handlers.indexOf(target.dataset.name) > -1) {
            this.priceGraph.toggleHorizontalLine(this.state.quote[target.dataset.name], target.dataset.title);
        }
        else if (target.dataset.name == 'volume') {
            $('svg').empty();
            if ($(target).hasClass('active')) {
                if (!this.volumeGraph) {
                    this.volumeGraph = new VolumeGraph(this.state.quote, this.state.timesales);
                }
                this.volumeGraph.render();
            }
            else {
                this.priceGraph.refresh();
            }
        }
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
                           name={attrs[1]}
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
                    <h1 style={{margin: 0}}>{capitalizePhrase(this.state.quote.name)}</h1>
                    <h2 style={{marginTop: 0}}><small>{this.symbol.toUpperCase()} - {this.state.quote.exchange_desc}</small></h2>
                    <h2 className="quote-price">{this.state.quote.last_trade_price}</h2>
                    <h3 className={"quote-change" + (direction ? (direction == 1 ? " change-up" : " change-down") : '')}>{
                            (direction) ?
                                (<i className={"fa fa-arrow-" + (direction == 1 ? "up" : "down")} aria-hidden="true"></i>) :
                                null
                        } {this.state.quote.change} ({this.state.quote.percent_change}%)</h3>
                </div>
                <div className="col-sm-12 chart">
                </div>
                <div className="col-sm-12" style={{marginBottom: 20}}>
                    {quote_cells}
                </div>
            </div>
        );
        ReactDOM.render(render_data, document.getElementById('pagecontent'));
        $('.quote-cell[data-name="previous_close"]').toggleClass('active');
        this.priceGraph = new PriceGraph(this.state.quote, this.state.timesales);
        if (this.state.timesales) {
            this.priceGraph.render();
            this.priceGraph.drawHorizontalLine(this.state.quote.previous_close, 'Previous Close');
        }
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