/**
 * Created by eric on 4/9/17.
 * http://zeroviscosity.com/d3-js-step-by-step/step-2-a-basic-donut-chart
 */
class DividendRoundGraph {
    constructor(quote, dataname) {
        if ($('.chart svg').length == 0) {
            d3.select('.chart')
                .append('svg')
                .style('display', 'block')
                .style('margin', '0 auto');
        }
        this.quote = quote;
        this.dataset = [
            {label: 'Dividend', count: this.quote[dataname]},
            {label: 'Stock', count: 100}
        ];
        this.svg = d3.select('svg');

        this.width = 360;
        this.height = 360;
        this.radius = Math.min(this.width, this.height) / 2;
        this.donutWidth = 50;
        this.color = d3.scaleOrdinal()
            .range(['#5254a3', '#dadaeb']);
    }

    render(graph_title) {
        this.svg.attr('width', 360)
            .attr('height', 400);
        this.g = this.svg.append("g").attr("transform", 'translate(' + (this.width / 2) +
            ',' + (this.height / 2) + ')');

        this.arc = d3.arc()
            .innerRadius(this.radius - this.donutWidth)
            .outerRadius(this.radius);

        this.pie = d3.pie()
            .value(function (d) {
                return d.count;
            })
            .sort(null);

        this.path = this.g.selectAll('path')
            .data(this.pie(this.dataset))
            .enter()
            .append('path')
            .attr('d', this.arc)
            .attr('fill', function (d, i) {
                return this.color(d.data.label);
            }.bind(this))
            .attr('transform', 'translate(0, 20)');

        this.svg.append('text')
            .text(graph_title)
            .attr('transform', 'translate(0, 20)')
            .attr('font-size', '16')
            .style('fill', 'grey');

        var legendRectSize = 18;
        var legendSpacing = 4;

        this.legend = this.svg.selectAll('.legend')
            .data(this.color.domain())
            .enter()
            .append('g')
            .attr('class', 'legend')
            .attr('transform', function (d, i) {
                var height = legendRectSize + legendSpacing;
                var offset = height * this.color.domain().length / 2;
                var horz = (this.width / 2) + (-2 * legendRectSize);
                var vert = (this.height / 2) + (i * height - offset);
                return 'translate(' + horz + ',' + vert + ')';
            }.bind(this));

        this.legend.append('rect')
            .attr('width', legendRectSize)
            .attr('height', legendRectSize)
            .style('fill', this.color)
            .style('stroke', this.color);

        this.legend.append('text')
            .attr('x', legendRectSize + legendSpacing)
            .attr('y', legendRectSize - legendSpacing)
            .text(function (d) {
                return d;
            });
    }
}

export default DividendRoundGraph;