/**
 * Created by eric on 4/9/17.
 */
class DividendStackedGraph {
    constructor(quote, dataname) {
        if ($('.chart svg').length == 0) {
            d3.select('.chart')
                .append('svg')
                .style('display', 'block')
                .style('margin', '0 auto');
        }
        this.quote = quote;
        this.maxValue = dataname == 'dividend_yield' ? 100 : Number(this.quote.last_trade_price);

        this.dataset = {
            symbol: this.quote.symbol,
            dividend: this.quote[dataname]
        };
        this.svg = d3.select('svg');

        this.width = 900;
        this.height = 350;
        this.color = d3.scaleOrdinal()
            .range(['#5254a3', '#dadaeb']);

        this.x = d3.scaleLinear()
            .range([0, this.width - 70]);
    }

    render(data_param) {
        this.dataset.dividend = this.quote[data_param];
        this.maxValue = data_param == 'dividend_yield' ? 100 : Number(this.quote.last_trade_price);
        this.svg.attr('width', this.width)
            .attr('height', this.height);
        this.g = this.svg.append("g").attr("transform", 'translate(0,' + (this.height / 4) + ')');


        this.x.domain([0, this.maxValue]);
        this.color.domain(['dividend', 'stock']);

        // Dividend
        this.g.append('rect')
            .attr('height', 50)
            .attr('width', this.x(Number(this.dataset.dividend)))
            .attr('x', this.x(0))
            .attr('y', 50)
            .attr('fill', this.color('dividend'));

        // Stock
        this.g.append('rect')
            .attr('height', 50)
            .attr('width', this.x(this.maxValue - this.dataset.dividend))
            .attr('x', this.x(this.dataset.dividend))
            .attr('y', 50)
            .attr('fill', this.color('stock'));

        // 0 X line
        this.g.append('path')
            .datum([[0, 30], [0, 120]])
            .attr("d", d3.line()
                .x(function (d) {
                    return this.x(d[0])
                }.bind(this))
            )
            .attr('stroke', '#000')
            .attr('stroke-width', 2);

        this.g.append('text')
            .text('0')
            .attr('x', 0)
            .attr('y', 20);

        // Dividend X Line
        var datapoints = [[this.dataset.dividend, 30], [this.dataset.dividend, 120]];

        this.g.append('path')
            .datum(datapoints)
            .attr("d", d3.line()
                .x(function (d) {
                    return this.x(d[0])
                }.bind(this))
            )
            .attr('stroke', '#000')
            .attr('stroke-width', 2);

        this.g.append('text')
            .text((data_param == 'annual_dividend' ? '$' : '') + this.dataset.dividend + (data_param == 'dividend_yield' ? '%' : ''))
            .attr('x', this.x(this.dataset.dividend))
            .attr('y', 20);

        this.g.append('path')
            .datum([[this.maxValue, 30], [this.maxValue, 120]])
            .attr("d", d3.line()
                .x(function (d) {
                    return this.x(d[0])
                }.bind(this))
            )
            .attr('stroke', '#000')
            .attr('stroke-width', 2);

        this.g.append('text')
            .text(data_param == 'annual_dividend' ? '$' + this.quote.last_trade_price : '100%')
            .attr('x', this.x(this.maxValue))
            .attr('y', 20);

        this.svg.append('text')
            .text(data_param == 'annual_dividend' ?  'Annual Dividend' : 'Dividend Yield')
            .attr('transform', 'translate(375, 20)')
            .attr('font-size', '16')
            .style('fill', 'grey');
    }
}

export default DividendStackedGraph;