function create_box_and_whiskers_plot(data, html_id) {
  var chart = nv.models.boxPlotChart()
    .x(function(d) { return d.label })
    .y(function(d) { return d.values.Q3 })
    .staggerLabels(true)
    .maxBoxWidth(75) // prevent boxes from being incredibly wide
    .yDomain([0, 500])
    ;

  d3.select(html_id)
    .datum(data)
    .call(chart);
  nv.utils.windowResize(chart.update);
  return chart;
}

function create_donut_chart(data, html_id) {
  var height = 350;
  var width = 350;

  var chart;
  nv.addGraph(function() {
    var chart = nv.models.pieChart()
      .x(function(d) { return d.key })
      .y(function(d) { return d.y })
      .donut(true)
      .width(width)
      .height(height)
      .padAngle(.02)
      .cornerRadius(5)
      .id('donut') // allow custom CSS for this one svg
      .showLegend(false)
      .title(data[0]["y"] + "%")

    chart.pie
      .donutLabelsOutside(true)
      .startAngle(function(d) { return d.startAngle/2 -Math.PI/2 })
      .endAngle(function(d) { return d.endAngle/2 -Math.PI/2 });

    d3.select(html_id)
      .datum(data)
      .transition().duration(1200)
      .call(chart);
    return chart;
  });
}

function create_horizontal_bar_chart(data, html_id) {
  nv.addGraph(function() {
    var chart = nv.models.multiBarHorizontalChart()
      .x(function(d) { return d.label })
      .y(function(d) { return d.value })
      .margin({top: 30, right: 20, bottom: 50, left: 175})
      .showValues(true)           //Show bar value next to each bar.
      .tooltips(true)             //Show tooltips on hover.
      .showControls(false)        //Allow user to switch between "Grouped" and "Stacked" mode.
      .showLegend(false);

    chart.yAxis
      .tickFormat(d3.format(',.2f'));

    d3.select(html_id)
      .datum(data)
      .call(chart);

    nv.utils.windowResize(chart.update);
    return chart;
  });
}

function create_line_graph(data, html_id) {
  var chart;
  nv.addGraph(function() {
    chart = nv.models.lineChart()
      .margin({left: 100})  //Adjust chart margins to give the x-axis some breathing room.
      .useInteractiveGuideline(true)  //We want nice looking tooltips and a guideline!
      .showLegend(true)       //Show the legend, allowing users to turn on/off line series.
      .showYAxis(true)        //Show the y-axis
      .showXAxis(true);       //Show the x-axis

    chart.xAxis     //Chart x-axis settings
        .axisLabel('Scan')
        .tickFormat(d3.format(',r'));

    chart.yAxis     //Chart y-axis settings
        .axisLabel('Result')
        .tickFormat(d3.format('.02f'));

    d3.select(html_id).datum(data).call(chart);

    //Update the chart when window resizes.
    nv.utils.windowResize(function() { chart.update() });
    return chart;
  });
}

function load_line_graph(html_id, data_series, json_files) {
  json_files = json_files || ['datafile_1.json', 'datafile_2.json']; // Default parameters

  var my_queue = queue();
  json_files.forEach(function(filename) { // Set up all JSON to be loaded in a Queue
    my_queue.defer(d3.json, filename);
  });

  my_queue.awaitAll(function(error, results) { // Wait until all files are loaded before continuing
    if (error) { throw error; }
    multiple_series = [];
    results.forEach(function(data) {
      multiple_series.push(data[data_series][0]);
    });
    create_line_graph(multiple_series, html_id);
  });
}
