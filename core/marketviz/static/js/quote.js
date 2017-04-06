/**
 * Created by eric on 4/6/17.
 */
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import {capitalizePhrase} from './utils'

class Quote extends Component {
    constructor(props) {
        super(props);
        this.state = {quote: {}};
        this.symbol = props.match.params.symbol;
        this.mountRender = this.mountRender.bind(this)
    }

    componentDidMount() {
        $.get('/api/quote', {symbol: this.symbol}, function(data) {
            this.setState({quote: data});
            this.mountRender();
        }.bind(this));
    }

    mountRender() {
        $('.loader').remove();
        var direction = this.state.quote['change_sign'] == 'u' ? 1 : -1;
        direction = this.state.quote['change_sign'] == 'e' ? 0 : direction;
        var render_data = (
            <div>
                <h1>{this.symbol.toUpperCase()}</h1>
                <h2 style={{marginTop: 0}}><small>{capitalizePhrase(this.state.quote.name)}</small></h2>
                <h2 className="quote-price">{this.state.quote.last_trade_price}</h2>
                <h3 className={"quote-change" + (direction ? (direction == 1 ? " change-up" : " change-down") : null)}>{
                        (direction) ?
                            (<i className={"fa fa-arrow-" + (direction == 1 ? "up" : "down")} aria-hidden="true"></i>) :
                            null
                    } {this.state.quote.change} ({this.state.quote.percent_change}%)</h3>
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