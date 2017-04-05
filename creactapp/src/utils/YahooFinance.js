import $ from 'jquery';

export class YahooFinance {
    url = "https://query.yahooapis.com/v1/public/yql";

    fetch = (symbol) => {
        var query = 'select * from yahoo.finance.quotes where symbol in ("' + symbol  + '")';
        var jqxhr = $.ajax(this.url, {
            data: {
                q: query,
                format: 'json',
                env: 'store://datatables.org/alltableswithkeys'
            }
        });
        // console.log(this.url, jqxhr);
        return query;
    }
}
