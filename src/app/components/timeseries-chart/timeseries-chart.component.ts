import {Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import { HttpClient } from '@angular/common/http';


import * as d3 from 'd3';

@Component({
  selector: 'app-timeseries-chart',
  templateUrl: './timeseries-chart.component.html',
  styleUrl: './timeseries-chart.component.scss'
})
export class TimeseriesChartComponent implements OnInit, OnDestroy {
  @ViewChild('timeseriesChart', {static: true}) timeseriesChart: ElementRef;
  url: string = '/assets/unemployment.json';
  unemploymentData: any;
  private svg?: d3.Selection<SVGElement, {}, HTMLDivElement, any>;
  public showVoronoi = false;


  constructor(private http: HttpClient) {
  }

  public ngOnInit(): void {
    this.http.get(this.url).subscribe(res => {
      this.unemploymentData = res;
      console.log('this.unemploymentData',this.unemploymentData);
      this.makeChartFromFile();
    });
  }

  public makeChartFromFile() {
    this.makeChart(d3, this.unemploymentData, this._voronoi);
  }

  public toggleVoronoi() {
    this.showVoronoi = !this.showVoronoi;
  }

  public _voronoi(Inputs){return(
      Inputs.toggle({label: "Show voronoi"})
  )}

  public makeChart(d3,unemployment,voronoi)
  {
    console.log('***** makeChart *****');
    console.log('d3', d3);
    console.log('unemployment', unemployment);
    console.log('voronoi', voronoi);

    if (this.svg) {
      d3.selectAll('#timeseries-chart > svg').remove();
      d3.selectAll('.tooltip').remove();
    }

    const element = document.getElementById("timeseriesChart");
    element.innerHTML = '';
    // Specify the chart’s dimensions.
    const width = 928;
    const height = 600;
    const marginTop = 20;
    const marginRight = 20;
    const marginBottom = 30;
    const marginLeft = 30;

    // Create the positional scales.
    const x = d3.scaleUtc()
        .domain(d3.extent(unemployment, d => new Date(d.date)))
        .range([marginLeft, width - marginRight]);

    const y = d3.scaleLinear()
        .domain([0, d3.max(unemployment, d => d.unemployment)]).nice()
        .range([height - marginBottom, marginTop]);

    // Create the SVG container.
    this.svg = d3.select("#timeseriesChart").append("svg")
        .attr("width", width)
        .attr("height", height)
        .attr("viewBox", [0, 0, width, height])
        .attr("style", "max-width: 100%; height: auto; overflow: visible; font: 10px sans-serif;");

    // Add the horizontal axis.
    this.svg.append("g")
        .attr("transform", `translate(0,${height - marginBottom})`)
        .call(d3.axisBottom(x).ticks(width / 80).tickSizeOuter(0));

    // Add the vertical axis.
    this.svg.append("g")
        .attr("transform", `translate(${marginLeft},0)`)
        .call(d3.axisLeft(y))
        .call(g => g.select(".domain").remove())
        .call(voronoi ? () => {} : g => g.selectAll(".tick line").clone()
            .attr("x2", width - marginLeft - marginRight)
            .attr("stroke-opacity", 0.1))
        .call(g => g.append("text")
            .attr("x", -marginLeft)
            .attr("y", 10)
            .attr("fill", "currentColor")
            .attr("text-anchor", "start")
            .text("↑ Unemployment (%)"));


    // Compute the points in pixel space as [x, y, z], where z is the name of the series.
    const points = unemployment.map((d) => [x(new Date(d.date)), y(d.unemployment), d.division]);

    // An optional Voronoi display (for fun).
    if (voronoi) this.svg.append("path")
        .attr("fill", "none")
        .attr("stroke", "#ccc")
        .attr("d", d3.Delaunay
            .from(points)
            .voronoi([0, 0, width, height])
            .render());

    // Group the points by series.
    const groups = d3.rollup(points, v => Object.assign(v, {z: v[0][2]}), d => d[2]);
    console.log('groups', groups);

    // Draw the lines.
    const line = d3.line();
    const path = this.svg.append("g")
        .attr("fill", "none")
        .attr("stroke", "steelblue")
        .attr("stroke-width", 1.5)
        .attr("stroke-linejoin", "round")
        .attr("stroke-linecap", "round")
        .selectAll("path")
        .data(groups.values())
        .join("path")
        .style("mix-blend-mode", "multiply")
        .attr("d", line);

    // Add an invisible layer for the interactive tip.
    const dot = this.svg.append("g")
        .attr("display", "none");

    dot.append("circle")
        .attr("r", 2.5);

    dot.append("text")
        .attr("text-anchor", "middle")
        .attr("y", -8);

    this.svg
        .on("pointerenter", pointerentered)
        .on("pointermove", pointermoved)
        .on("pointerleave", pointerleft)
        .on("touchstart", event => event.preventDefault());

    return this.svg.node();

    // When the pointer moves, find the closest point, update the interactive tip, and highlight
    // the corresponding line. Note: we don't actually use Voronoi here, since an exhaustive search
    // is fast enough.
    function pointermoved(event) {
      const [xm, ym] = d3.pointer(event);
      const i = d3.leastIndex(points, ([x, y]) => Math.hypot(x - xm, y - ym));
      const [x, y, k] = points[i];
      path.style("stroke", ({z}) => z === k ? null : "#ddd").filter(({z}) => z === k).raise();
      dot.attr("transform", `translate(${x},${y})`);
      dot.select("text").text(k);
      this.svg.property("value", unemployment[i]).dispatch("input", {bubbles: true});
    }

    function pointerentered() {
      path.style("mix-blend-mode", null).style("stroke", "#ddd");
      dot.attr("display", null);
    }

    function pointerleft() {
      path.style("mix-blend-mode", "multiply").style("stroke", null);
      dot.attr("display", "none");
      this.svg.node().value = null;
      this.svg.dispatch("input", {bubbles: true});
    }

  }

  ngOnDestroy() {
    // this.subs.unsubscribe();
  }
}
