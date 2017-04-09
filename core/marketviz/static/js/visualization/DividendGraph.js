/**
 * Created by eric on 4/9/17.
 */
class DividendGraph {
    constructor(quote) {
        if ($('.chart svg').length == 0) {
            d3.select('.chart')
                .append('svg')
                .style('display', 'block')
                .style('margin', '0 auto');
        }
        this.quote = quote;
        this.dataset = [
            { label: 'Dividend', count: this.quote.dividend_yield},
            { label: '', count: 100 }
        ];
        this.svg = d3.select('svg');

        this.width = 360;
        this.height = 360;
        this.radius = Math.min(this.width, this.height) / 2;
        this.donutWidth = 50;                            // NEW
        this.color = d3.scaleOrdinal()
            .range(['#5254a3', '#bcbddc']);
    }

    render() {
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
            }.bind(this));
    }
}

export default DividendGraph;