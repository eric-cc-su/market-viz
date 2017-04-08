/**
 * Created by eric on 4/6/17.
 */
import * as d3 from 'd3';
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import QuoteCell from './quotecell'
import {capitalizePhrase} from './utils'

class Quote extends Component {
    constructor(props) {
        super(props);
        this.state = {quote: {}, timesales: []};
        this.symbol = props.match.params.symbol;
        this.mountRender = this.mountRender.bind(this);
        this.cellClickHandler = this.cellClickHandler.bind(this);
        this.renderPriceChart = this.renderPriceChart.bind(this);
    }

    componentDidMount() {
        $.get('/api/quote', {symbol: this.symbol}, function(data) {
            this.setState({quote: data.quote, timesales: data.timesales});
            this.mountRender();
        }.bind(this));
    }

    cellClickHandler(e) {
        e.preventDefault();
        console.log("cell click!");
    }

    mountRender() {
        $('.loader').remove();
        var direction = this.state.quote['change_sign'] == 'u' ? 1 : -1;
        direction = this.state.quote['change_sign'] == 'e' ? 0 : direction;
        var quote_attrs = [
            ['Open', 'open'],
            ['Low', 'low'],
            ['High', 'high'],
            ['Volume', 'volume'],
            ['Previous Close', 'previous_close'],
            ['52 Week High', '52wk_high'],
            ['52 Week Low', '52wk_low'],
            ['P/E Ratio', 'price_earnings'],
            ['Earnings per Share', 'earnings_per_share'],
            ['Annual Dividend', 'annual_dividend'],
            ['Dividend Yield', 'dividend_yield', '%'],
            ['Volatility', 'volatility'],
        ];
        var quote_cells = [];
        quote_attrs.map((attrs, index) => {
            quote_cells.push(
                <QuoteCell title={attrs[0]}
                           data_value={this.state.quote[attrs[1]]}
                           unit={attrs.length > 2 ? attrs[2] : null}
                           onClick={this.cellClickHandler}
                           key={'qcell_'.concat(index)}
                />
            )
        });

        var render_data = (
            <div>
                <div className="col-sm-12">
                    <h1 style={{marginBottom: 0}}>{capitalizePhrase(this.state.quote.name)}</h1>
                    <h2 style={{marginTop: 0}}><small>{this.symbol.toUpperCase()} - {this.state.quote.exchange_desc}</small></h2>
                    <h2 className="quote-price">{this.state.quote.last_trade_price}</h2>
                    <h3 className={"quote-change" + (direction ? (direction == 1 ? " change-up" : " change-down") : '')}>{
                            (direction) ?
                                (<i className={"fa fa-arrow-" + (direction == 1 ? "up" : "down")} aria-hidden="true"></i>) :
                                null
                        } {this.state.quote.change} ({this.state.quote.percent_change}%)</h3>
                </div>
                <div className="col-sm-12 chart">
                </div>
                <div>
                    {quote_cells}
                </div>
            </div>
        );
        ReactDOM.render(render_data, document.getElementById('pagecontent'));
        this.renderPriceChart();
    }

    render() {
        return (
            <div className="col-sm-12 page" id="pagecontent">
                <div className="loader"></div>
            </div>
        );
    }

    renderPriceChart() {
        //https://bl.ocks.org/mbostock/3883245
        d3.select('.chart')
            .append('svg')
            .attr('width', 900)
            .attr('height', 400)
            .style('display', 'block')
            .style('margin', '0 auto')
            .style('border', '1px solid #e9e9e9');
        var svg = d3.select('svg'),
            margin = {top: 20, right: 20, bottom: 30, left: 50},
            width = +svg.attr("width") - margin.left - margin.right,
            height = +svg.attr("height") - margin.top - margin.bottom,
            g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");
        var parseTime = d3.timeParse("%Y-%m-%dT%H:%M:%S%Z"); //datetime: 2017-04-07T13:30:00Z
        var x = d3.scaleTime()
            .rangeRound([0, width]);

        var y = d3.scaleLinear()
            .rangeRound([height, 0]);


        x.domain(d3.extent(this.state.timesales, function(d) { return parseTime(d.datetime); }));
        var buffer = Math.max(0.005, (0.01 * Math.round(Number(this.state.quote.percent_change))) / 2);
        y.domain([
            d3.min(this.state.timesales, function(d) {return d.last;}) * (1 - buffer),
            d3.max(this.state.timesales, function(d) {return d.last;}) * (1 + buffer),
        ]);

        var line = d3.line()
            .x(function(d) { return x(parseTime(d.datetime)); })
            .y(function(d) {
                return y(d.last);
            })
            .curve(d3.curveCardinal.tension(0.5));

        g.append('g').call(d3.axisLeft(y));
        var xAxis = d3.axisBottom(x);
        xAxis.ticks(d3.timeHour.every(1))
            .tickFormat(d3.timeFormat('%H:%M'));
        g.append('g')
            .attr("transform", "translate(0," + height + ")")
            .call(xAxis);

        var last_close_data = [
            [0, this.state.quote.previous_close],
            [width, this.state.quote.previous_close]
        ];
        var previous_close_g = g.append('g');
        previous_close_g.append('path')
            .datum(last_close_data)
            .attr("stroke", "#dddddd")
            .attr("stroke-dasharray", "10, 5")
            .attr("stroke-width", 1.5)
            .attr("d", d3.line()
                .y(function (d) {
                    return y(d[1])
                })
            );

        previous_close_g.append('text')
            .attr('fill', '#dddddd')
            .attr('x', 10)
            .attr('y', Number(y(this.state.quote.previous_close)) + 16)
            .text('Previous Close');

        g.append('path')
            .datum(this.state.timesales)
            .attr("fill", "none")
            .attr("stroke", "steelblue")
            .attr("stroke-linejoin", "round")
            .attr("stroke-linecap", "round")
            .attr("stroke-width", 2.5)
            .attr("d", line);

        var focus = svg.append("g")
          .attr("class", "focus")
          .style("display", "none");

        var bisectDate = d3.bisector(function(d) { return parseTime(d.datetime); }).left;

        focus.append("circle")
            .attr("r", 4.5);

        focus.append("text")
            .attr("x", 9)
            .attr("dy", ".35em");

        svg.append("rect")
            .attr("width", width - 10)
            .attr("height", height)
            .attr("transform", "translate(" + margin.left + ", 0)")
            .style("fill", "none")
            .style("pointer-events", "all")
            .on("mouseover", function () {focus.style("display", null);})
            .on("mouseout", function () {focus.style("display", "none");})
            .on("mousemove", mousemove);

        var dataset = this.state.timesales;
        function mousemove() {
            var x0 = x.invert(d3.mouse(this)[0]),
                i = bisectDate(dataset, x0, 1),
                d0 = dataset[i - 1],
                d1 = dataset[i],
                d = x0 - d0.datetime > d1.datetime - x0 ? d1 : d0;
            // focus.attr("transform", "translate(" + (x(parseTime(d.datetime)) + margin.left) + "," + (y(d.last) + margin.top) + ")");
            focus.attr("transform", "translate(" + (x(parseTime(d.datetime)) + margin.left) + "," + (y(d.last) + margin.top) + ")");
            focus.select("text").text(d.last);
        };
    }
}

export default Quote;