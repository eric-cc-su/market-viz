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
        }
    }

    render() {
        const table_headers = this.state.columns.map((header, index) =>
            <th key={index}>{header}</th>
        );
        var theaders = this.state.columns;
        var table_rows = [];
        this.state.quotes.map(function(quote, qindex) {
            var cells = [];
            theaders.map(function (attr, cindex) {
                cells.push(<td key={cindex}>{quote[attr]}</td>);
            });
            table_rows.push(<tr key={qindex}>{cells}</tr>);
        });

        return (
            <table className="table table-striped">
                <thead>
                    <tr>{table_headers}</tr>
                </thead>
                <tbody>{table_rows}</tbody>
            </table>
        )
    }
}

export default QuoteTable;