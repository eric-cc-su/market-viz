/**
 * Created by eric on 4/15/17.
 */
class EPSChart {
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

        for (var i = 0; i < Math.ceil(this.quote.earnings_per_share); i++) {
            var height = i < Math.ceil(this.quote.earnings_per_share) - 1 ? 15 : (this.quote.earnings_per_share % Math.floor(this.quote.earnings_per_share));

            this.g.append('rect')
                .attr('x', (15 * (i % 5)) + (i % 5))
                .attr('y', (Math.floor(i / 5) * 15) + (Math.floor(i / 5)))
                .attr('height', height)
                .attr('width', 15)
                .attr('fill', '#31a354');

            if (height != 15) {
                this.g.append('rect')
                    .attr('x', (15 * (i % 5)) + (i % 5) + height)
                    .attr('y', (Math.floor(i / 5) * 15) + (Math.floor(i / 5)))
                    .attr('height', 15 - height)
                    .attr('width', 15)
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
            .text('Earnings per Share')
            .attr('transform', 'translate(200, 20)')
            .attr('font-size', '16')
            .style('fill', 'grey');

    }
}

export default EPSChart;