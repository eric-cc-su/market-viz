/**
 * Created by eric on 4/6/17.
 */
import React, {Component} from 'react';
import {capitalizePhrase} from './utils'

class QuoteCell extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="quote-cell col-sm-3" onClick={this.props.onClick} data-title={this.props.title} data-name={this.props.name}>
                <h3 className="quote-cell-title"><small>{this.props.title}</small></h3>
                <h2>{(this.props.data_value && this.props.data_value != 'na') ? (this.props.data_value + (this.props.unit ? ' '.concat(this.props.unit) : '')) : 'N/A'}</h2>
            </div>
        )
    }
}

export default QuoteCell;