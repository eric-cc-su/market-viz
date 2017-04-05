import React, {Component} from 'react';
import {YahooFinance} from '../utils/YahooFinance'

class TickerForm extends Component {
    state = {ticker: ''}

    handleTextChange = (event) => {
        this.setState({value: event.target.value});
    }

    handleFormSubmit = (e) => {
        console.log(e);
    }

    render() {
        var yahoo = new YahooFinance();
        return (
            <form>
                <input type="text" name="ticker" placeholder="Ticker" value={this.state.ticker} onChange={this.handleTextChange}/>
                <input type="submit" value="Submit" />
            </form>
        )
    }
}

export {TickerForm};