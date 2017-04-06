/**
 * Created by eric on 4/5/17.
 */
import React, {Component} from 'react';

class QuoteTable extends Component {
    constructor(props) {
        super(props);
        this.state = {
            'columns': props.columns ? props.columns : [],
            'quotes': props.quotes ? props.quotes : []
        };
        this.name = props.name;
        this.prepHeader = this.prepHeader.bind(this);
    }

    prepHeader(headerstring) {
        headerstring = headerstring.replace('_', ' ');
        var new_header = [];
        headerstring.split(' ').map((substring) =>
            new_header.push(substring.charAt(0).toUpperCase() + substring.slice(1))
        );
        return new_header.join(' ')
    }

    render() {
        const table_headers = this.state.columns.map((header, index) =>
            <th key={index}>{this.prepHeader(header)}</th>
        );
        var theaders = this.state.columns;
        var table_name = this.name;
        var table_rows = [];
        this.state.quotes.map(function(quote, qindex) {
            var cells = [];
            var direction = quote['chg_sign'] == 'u' ? 1 : -1;
            direction = quote['chg_sign'] == 'e' ? 0 : direction;
            theaders.map(function (attr, cindex) {
                cells.push(
                    <td key={table_name + '_d_' + cindex}>{quote[attr]}{attr == 'percent_change' ? '%' : null} {
                        (direction && attr == 'percent_change') ?
                            (<i className={"fa fa-arrow-" + (direction == 1 ? "up" : "down")} aria-hidden="true"></i>) :
                            null
                    }</td>
                );
            });
            table_rows.push(<tr key={table_name + '_r_' + qindex}>{cells}</tr>);
        });

        return (
            <table className={'table table-striped ' + (this.props.class ? this.props.class : '')}>
                <thead>
                    <tr>{table_headers}</tr>
                </thead>
                <tbody>{table_rows}</tbody>
            </table>
        )
    }
}

export default QuoteTable;