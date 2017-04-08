/**
 * Created by eric on 4/7/17.
 */
import * as d3 from 'd3';

class PriceGraph {
    constructor(quote, sales) {
        //https://bl.ocks.org/mbostock/3883245
        d3.select('.chart')
            .append('svg')
            .attr('width', 900)
            .attr('height', 400)
            .style('display', 'block')
            .style('margin', '0 auto');

        this.quote = quote;
        this.sales = sales;
        this.svg = d3.select('svg');
        this.margin = {top: 20, right: 20, bottom: 30, left: 50};
        this.width = +this.svg.attr("width") - this.margin.left - this.margin.right;
        this.height = +this.svg.attr("height") - this.margin.top - this.margin.bottom;
        this.g = this.svg.append("g").attr("transform", "translate(" + this.margin.left + "," + this.margin.top + ")");
        this.ybuffer = Math.max(0.0025, (0.01 * Math.round(Number(this.quote.percent_change))) / 4);
        this.drawHorizontalLine = this.drawHorizontalLine.bind(this);
        this.toggleHorizontalLine = this.toggleHorizontalLine.bind(this);
    }

    drawHorizontalLine(yValue, lineText, attributes) {
        var datapoints = [[0, yValue], [this.width, yValue]];
        var attrs = {
            "stroke": "#dddddd",
            "stroke-dasharray": "10, 5",
            "stroke-width": 1.5,
            "name": lineText.toLowerCase().replace(' ', '_')
        };
        for (var key in attributes) {
            attrs[key] = attributes[key];
        }

        var y = d3.scaleLinear()
            .rangeRound([this.height, 0]);

        y.domain([
            d3.min(this.sales, function (d) {
                return d.last;
            }) * (1 - this.ybuffer),
            d3.max(this.sales, function (d) {
                return d.last;
            }) * (1 + this.ybuffer),
        ]);

        var new_g = this.g.append('g');
        new_g.append('path')
            .datum(datapoints)
            .attr("d", d3.line()
                .y(function (d) {
                    return y(d[1])
                })
            );

        for (var key in attrs) {
            new_g.attr(key, attrs[key]);
        }

        if (lineText) {
            new_g.append('text')
                .attr('fill', '#dddddd')
                .attr('x', 10)
                .attr('y', Number(y(yValue)) + 16)
                .text(lineText);
        }
        return new_g;
    }

    toggleHorizontalLine(yValue, lineText, attributes) {
        var line_name = (attributes && attributes.name) ? attributes.name : lineText.toLowerCase().replace(' ', '_');
        var line_g = $('g[name="' + line_name + '"]');
        if (line_g.length > 0) {
            line_g.remove();
        }
        else {
            return this.drawHorizontalLine(yValue, lineText, attributes);
        }
    }

    render() {
        var parseTime = d3.timeParse("%Y-%m-%dT%H:%M:%S%Z"); //datetime: 2017-04-07T13:30:00Z
        var x = d3.scaleTime()
            .rangeRound([0, this.width]);

        var y = d3.scaleLinear()
            .rangeRound([this.height, 0]);

        x.domain(d3.extent(this.sales, function (d) {
            return parseTime(d.datetime);
        }));
        y.domain([
            d3.min(this.sales, function (d) {
                return d.last;
            }) * (1 - this.ybuffer),
            d3.max(this.sales, function (d) {
                return d.last;
            }) * (1 + this.ybuffer),
        ]);

        var line = d3.line()
            .x(function (d) {
                return x(parseTime(d.datetime));
            })
            .y(function (d) {
                return y(d.last);
            })
            .curve(d3.curveCardinal.tension(0.5));

        this.g.append('g').call(d3.axisLeft(y));
        var xAxis = d3.axisBottom(x);
        xAxis.ticks(d3.timeHour.every(1))
            .tickFormat(d3.timeFormat('%H:%M'));
        this.g.append('g')
            .attr("transform", "translate(0," + this.height + ")")
            .call(xAxis);

        var line_g = this.drawHorizontalLine(this.quote.previous_close, 'Previous Close');

        this.g.append('path')
            .datum(this.sales)
            .attr("fill", "none")
            .attr("stroke", "#ff7043")
            .attr("stroke-linejoin", "round")
            .attr("stroke-linecap", "round")
            .attr("stroke-width", 2.5)
            .attr("d", line);

        var focus = this.svg.append("g")
            .attr("class", "focus")
            .style("display", "none");

        var bisectDate = d3.bisector(function (d) {
            return parseTime(d.datetime);
        }).left;

        focus.append("circle")
            .attr("r", 4.5);

        focus.append("text")
            .attr("x", 9)
            .attr("dy", ".35em");

        this.svg.append("rect")
            .attr("width", this.width - 10)
            .attr("height", this.height)
            .attr("transform", "translate(" + this.margin.left + ", " + this.margin.top + ")")
            .style("fill", "none")
            .style("pointer-events", "all")
            .on("mouseover", function () {
                focus.style("display", null);
            })
            .on("mouseout", function () {
                focus.style("display", "none");
            })
            .on("mousemove", mousemove);

        var dataset = this.sales;
        var margins = this.margin;

        function mousemove() {
            var x0 = x.invert(d3.mouse(this)[0]),
                i = bisectDate(dataset, x0, 1),
                d0 = dataset[i - 1],
                d1 = dataset[i],
                d = x0 - d0.datetime > d1.datetime - x0 ? d1 : d0;
            focus.attr("transform", "translate(" + (x(parseTime(d.datetime)) + margins.left) + "," + (y(d.last) + margins.top) + ")");
            focus.select("text").text(d.last);
        };
    }
}

export default PriceGraph;
