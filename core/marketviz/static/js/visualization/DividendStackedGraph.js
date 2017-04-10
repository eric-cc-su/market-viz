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
        this.dataset = {
            symbol: this.quote.symbol,
            dividend: this.quote[dataname],
            stock: (dataname == 'dividend_yield' ? 100 : Number(this.quote.last)) - Number(this.quote[dataname])
        };
        this.svg = d3.select('svg');

        this.width = 830;
        this.height = 350;
        this.color = d3.scaleOrdinal()
            .range(['#5254a3', '#dadaeb']);

        this.x = d3.scaleLinear()
            .range([0, this.width]);
    }

    render(graph_title) {
        this.svg.attr('width', this.width)
            .attr('height', this.height);
        this.g = this.svg.append("g").attr("transform", 'translate(0,' + (this.height / 4) + ')');


        this.x.domain([0, graph_title == 'Dividend Yield' ? 100 : this.quote.last_trade_price]);
        this.color.domain(['dividend', 'stock']);

        this.g.append('rect')
            .attr('height', 50)
            .attr('width', this.x(Number(this.dataset.dividend)))
            .attr('x', this.x(0))
            .attr('y', 50)
            .attr('fill', this.color('dividend'));

        this.g.append('rect')
            .attr('height', 50)
            .attr('width', this.x(this.dataset.stock - this.dataset.dividend))
            .attr('x', this.x(this.dataset.dividend))
            .attr('y', 50)
            .attr('fill', this.color('stock'));

    }
}

export default DividendStackedGraph;