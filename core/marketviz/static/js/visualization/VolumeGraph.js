/**
 * Created by eric on 4/9/17.
 */
import * as d3 from 'd3';

class VolumeGraph {
    constructor(quote, sales) {
        //https://bl.ocks.org/mbostock/3883245
        if ($('.chart svg').length == 0) {
            d3.select('.chart')
                .append('svg')
                .attr('width', 900)
                .attr('height', 400)
                .style('display', 'block')
                .style('margin', '0 auto');
        }

        this.quote = quote;
        this.sales = sales;

        this.minValue = d3.min(this.sales, function (d) {return (d.vl / 1000);});
        this.maxValue = d3.max(this.sales, function (d) {return (d.vl / 1000);});

        this.svg = d3.select('svg');
        this.margin = {top: 20, right: 20, bottom: 30, left: 50};
        this.width = +this.svg.attr("width") - this.margin.left - this.margin.right;
        this.height = +this.svg.attr("height") - this.margin.top - this.margin.bottom;

        this.parseTime = d3.timeParse("%Y-%m-%dT%H:%M:%S%Z"); //datetime: 2017-04-07T13:30:00Z
        this.ybuffer = Math.max(0.0025, (0.01 * Math.round(Number(this.quote.percent_change))) / 4);

        this.x = d3.scaleTime()
            .rangeRound([0, this.width]);

        this.y = d3.scaleLinear()
            .rangeRound([this.height, 0]);

        this.x.domain(d3.extent(this.sales, function (d) {
            return this.parseTime(d.datetime);
        }.bind(this)));
        this.y.domain([
            this.minValue * (1 - this.ybuffer),
            this.maxValue * (1 + this.ybuffer),
        ]);
    }

    render() {
        this.g = this.svg.append("g").attr("transform", "translate(" + this.margin.left + "," + this.margin.top + ")");

        var line = d3.line()
            .x(function (d) {
                return this.x(this.parseTime(d.datetime));
            }.bind(this))
            .y(function (d) {
                return this.y(d.vl / 1000);
            }.bind(this))
            .curve(d3.curveCardinal.tension(0.5));
        var yAxis = d3.axisLeft(this.y);
        yAxis.tickFormat(function(d) { return d + "k"; });
        this.g.append('g')
            .call(yAxis)
            .attr('id', 'yaxis');

        var xAxis = d3.axisBottom(this.x);
        xAxis.ticks(d3.timeHour.every(1))
            .tickFormat(d3.timeFormat('%H:%M'));

        this.g.append('g')
            .attr("transform", "translate(0," + this.height + ")")
            .call(xAxis)
            .attr('id', 'xaxis');

        this.g.append('path')
            .datum(this.sales)
            .attr("fill", "none")
            .attr("stroke", "#ff7043")
            .attr("stroke-linejoin", "round")
            .attr("stroke-linecap", "round")
            .attr("stroke-width", 2.5)
            .attr("d", line)
            .attr("id", "graphline");
    }
}

export default VolumeGraph;