'use strict';

var React = require('react');
var d3 = require('d3');
var stats = require('../stats');

var ResultsTable = React.createClass({
  render: function() {
    var app = this.props.app;
    var results = app.results;
    var sampleNames = results.sampleNames;
    var reports = results.reports;

    if (reports.length === 0) {
      return (
          <div className="panel panel-default">
            <div className="panel-heading">Results</div>
            <div className="panel-body">Empty</div>
          </div>
      );
    }

    // TODO: add clear button
    var titles = reports.map(function(r) {
      return (<th key={r.name + '__' + r.version}>{r.name} <small>{r.version}</small></th>);
    });

    var rows = [];

    for (var i = 0; i < sampleNames.length; i++) {
      var sampleName = sampleNames[i];

      var cols = [(<td key="sampleName"><code>{sampleName}</code></td>)];

      var values = reports.map(function(r) {
        var samples = r.samples[sampleName];

        return {
          sampleCount: samples.length,
          median: d3.median(samples),
          mean: d3.mean(samples),
          stdev: stats.stdev(samples),
          min: d3.min(samples),
          max: d3.max(samples)
        };
      });

      var medianValues = values.map(function(v) { return v.median; });

      var scale = d3.scale.linear().domain([d3.min(medianValues), d3.max(medianValues)]);

      for (var j = 0; j < reports.length; j++) {
        var report = reports[j];
        var value = values[j];
        var style = {
          background: 'rgba(220, 100, 100, ' + (scale(value.median) * 0.5).toString() + ')'
        };

        var title = 'samples: ' + value.sampleCount.toString() + '\n';
        title += 'median: ' + Math.round(value.median * 1000).toString() + '\n';
        title += 'mean: ' + Math.round(value.mean * 1000).toString() + '\n';
        title += 'stdev: ' + Math.round(value.stdev * 1000).toString() + '\n';
        title += 'min: ' + Math.round(value.min * 1000).toString() + '\n';
        title += 'max: ' + Math.round(value.max * 1000).toString();

        cols.push((
            <td key={report.name + '__' + report.version} title={title} style={style}>
              {Math.round(value.median * 1000)}
            </td>
        ));
      }

      rows.push((<tr key={sampleName}>{cols}</tr>));
    }

    return (
      <div className="panel panel-default">
        <div className="panel-heading">Report</div>
        <div className="panel-body">
          <table className="table table-condensed">
            <thead>
              <tr><th key="empty"></th>{titles}</tr>
            </thead>
            <tbody>
              {rows}
            </tbody>
          </table>
        </div>
      </div>
    );
  }
});

module.exports = ResultsTable;