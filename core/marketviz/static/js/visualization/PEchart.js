/**
 * Created by eric on 4/15/17.
 */
class PEChart {
    constructor(quote) {
        if ($('.chart svg').length == 0) {
            d3.select('.chart')
                .append('svg')
                .style('display', 'block')
                .style('margin', '0 auto');
        }
        this.quote = quote;
        this.svg = d3.select('svg');

        this.width = 600;
        this.height = 250;
        this.radius = Math.min(this.width, this.height) / 2;
        this.donutWidth = 50;
    }

    render() {
        this.svg.attr('width', this.width)
            .attr('height', this.height);
        this.g = this.svg.append("g").attr("transform", 'translate(220,' + (this.height / 4) + ')');

        var square_side = 15;


        for (var i = 0; i < Math.ceil(this.quote.price_earnings); i++) {
            var width = i < Math.ceil(this.quote.price_earnings) - 1 ? square_side : square_side * (this.quote.price_earnings % Math.floor(this.quote.price_earnings));

            this.g.append('rect')
                .attr('x', (square_side * (i % 5)) + (i % 5))
                .attr('y', (Math.floor(i / 5) * square_side) + (Math.floor(i / 5)))
                .attr('width', width)
                .attr('height', square_side)
                .attr('fill', '#31a354');

            if (width != square_side) {
                this.g.append('rect')
                    .attr('x', (square_side * (i % 5)) + (i % 5) + width)
                    .attr('y', (Math.floor(i / 5) * square_side) + (Math.floor(i / 5)))
                    .attr('width', square_side - width)
                    .attr('height', square_side)
                    .attr('fill', '#e7e7e7');
            }
        }

        var legend = this.svg.append('g').attr('transform', 'translate(240, 170)');
        legend.append('rect')
            .attr('height', 20)
            .attr('width', 20)
            .attr('fill', '#31a354');

        legend.append('text')
            .text('= $1')
            .attr('x', 25)
            .attr('y', 15)
            .style('font-size', '16px')
            .style('fill', 'grey');

        this.svg.append('text')
            .text('Price-Earnings Ratio')
            .attr('transform', 'translate(200, 20)')
            .attr('font-size', '16')
            .style('fill', 'grey');

    }
}

export default PEChart;