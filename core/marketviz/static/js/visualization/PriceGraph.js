/**
 * Created by eric on 4/7/17.
 */
import * as d3 from 'd3';

class PriceGraph {
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

        this.minValue = d3.min(this.sales, function (d) {
            return d.last;
        });
        this.maxValue = d3.max(this.sales, function (d) {
            return d.last;
        });

        // Track the horizontal layover lines being used for re-rendering on adjustY
        this.horizontalLines = {};

        this.svg = d3.select('svg');
        this.margin = {top: 20, right: 20, bottom: 30, left: 50};
        this.width = +this.svg.attr("width") - this.margin.left - this.margin.right;
        this.height = +this.svg.attr("height") - this.margin.top - this.margin.bottom;

        this.parseTime = d3.timeParse("%Y-%m-%dT%H:%M:%S%Z"); //datetime: 2017-04-07T13:30:00Z
        this.bisectDate = d3.bisector(function (d) {
            return this.parseTime(d.datetime);
        }.bind(this)).left;

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

        // methods
        this.drawHorizontalLine = this.drawHorizontalLine.bind(this);
        this.adjustY = this.adjustY.bind(this);
        this.toggleHorizontalLine = this.toggleHorizontalLine.bind(this);
        this.mousemove = this.mousemove.bind(this);
        this.refresh = this.refresh.bind(this);
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
        this.horizontalLines[attrs.name] = [yValue, lineText, attrs];

        var new_g = this.g.append('g');
        new_g.append('path')
            .datum(datapoints)
            .attr("d", d3.line()
                .y(function (d) {
                    return this.y(d[1])
                }.bind(this))
            );

        for (var key in attrs) {
            new_g.attr(key, attrs[key]);
        }

        if (lineText) {
            new_g.append('text')
                .attr('fill', '#dddddd')
                .attr('x', 10)
                .attr('y', Number(this.y(yValue)) + 16)
                .text(lineText);
        }
        return new_g;
    }

    adjustY(yValue, insert) {
        // Adjust graph domain to include y point
        if (yValue) {
            if (yValue < this.minValue || yValue > this.maxValue) {
                var new_min = this.minValue;
                var new_max = this.maxValue;
                if (insert) {
                    if (yValue < (this.new_min ? this.new_min : this.minValue)) {
                        this.new_min = yValue;
                    }
                    else if (yValue > (this.new_max ? this.new_max : this.maxValue)) {
                        this.new_max = yValue;
                    }
                }
                else {
                    // TODO: readjust axes to next possible new_min/new_max
                    if (this.new_min && yValue == this.new_min) {
                        delete this.new_min;
                    }
                    else if (this.new_max && yValue == this.new_max) {
                        delete this.new_max;
                    }
                }
                this.y.domain([
                    (this.new_min ? this.new_min : this.minValue) * (1 - this.ybuffer),
                    (this.new_max ? this.new_max : this.maxValue) * (1 + this.ybuffer)
                ]);
                $('svg').empty();
                this.refresh();
            }
        }
    }

    refresh() {
        this.render();
        for (var key in this.horizontalLines) {
            this.drawHorizontalLine.apply(this, this.horizontalLines[key]);
            var quotecell = $('.quote-cell[data-name="' + key + '"]');
            if (! quotecell.hasClass('active')) {
                quotecell.addClass('active');
            }
        }
    }

    toggleHorizontalLine(yValue, lineText, attributes) {
        var line_name = (attributes && attributes.name) ? attributes.name : lineText.toLowerCase().replace(' ', '_');
        var line_g = $('g[name="' + line_name + '"]');

        if (line_g.length > 0) {
            line_g.remove();
            delete this.horizontalLines[line_name];
            this.adjustY(yValue, false)
        }
        else {
            this.adjustY(yValue, true);
            return this.drawHorizontalLine(yValue, lineText, attributes);
        }
    }

    render() {
        this.g = this.svg.append("g").attr("transform", "translate(" + this.margin.left + "," + this.margin.top + ")");

        var line = d3.line()
            .x(function (d) {
                return this.x(this.parseTime(d.datetime));
            }.bind(this))
            .y(function (d) {
                return this.y(d.last);
            }.bind(this))
            .curve(d3.curveCardinal.tension(0.5));
        this.g.append('g').call(d3.axisLeft(this.y)).attr('id', 'yaxis');

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

        this.svg.append('text')
            .text('Price')
            .attr('transform', 'translate(60, 20)')
            .attr('font-size', '16')
            .style('fill', 'grey');

        this.focus = this.svg.append("g")
            .attr("class", "focus")
            .style("display", "none");

        this.focus.append("circle")
            .attr("r", 4.5);

        this.focus.append("text")
            .attr("x", 9)
            .attr("dy", ".35em");

        var hover_rect = this.svg.append("rect")
            .attr("width", this.width - 10)
            .attr("height", this.height)
            .attr("transform", "translate(" + this.margin.left + ", " + this.margin.top + ")")
            .style("fill", "none")
            .style("pointer-events", "all")
            .on("mouseover", function () {
                this.focus.style("display", null);
            }.bind(this))
            .on("mouseout", function () {
                this.focus.style("display", "none");
            }.bind(this))
            .on("mousemove", function () {
                this.mousemove(hover_rect.node());
            }.bind(this));

    }

    mousemove(container) {
        var x0 = this.x.invert(d3.mouse(container)[0]),
            i = this.bisectDate(this.sales, x0, 1),
            d0 = this.sales[i - 1],
            d1 = this.sales[i],
            d = x0 - d0.datetime > d1.datetime - x0 ? d1 : d0;
        this.focus.attr("transform", "translate(" + (this.x(this.parseTime(d.datetime)) + this.margin.left) + "," + (this.y(d.last) + this.margin.top) + ")");
        this.focus.select("text").text(d.last);
    };
}

export default PriceGraph;
