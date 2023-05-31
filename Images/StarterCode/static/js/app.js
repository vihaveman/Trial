// Read Data and set Values
let option = "";
let dataSet;

let init = async () => {
  dataSet = await d3.json("samples.json");
  console.log(dataSet);

  displayData(940);

  let optionMenu = d3.select("#selDataset");
  optionMenu
    .selectAll("option")
    .data(dataSet.names)
    .enter()
    .append("option")
    .text(name => name);
};

//Dashboard Display
let optionChanged = value => {
  option = value;
  displayData(option);
};

let displayData = option => {
  displayMetaData(option);
  displayHBarChart(option, dataSet); 
  displayBubbleChart(option, dataSet); 
};

// Plot Bar Chart
function displayHBarChart(option, dataSet) {
  let barData = dataSet.samples.find(sample => sample.id == option);
  console.log(barData);

  let y = barData.otu_ids.map(id => `OTU ${id}`);
  let x = barData.sample_values.slice(0, 10);
  let text = barData.otu_labels.slice(0, 10);

  let trace = {
    x,
    y,
    text,
    type: "bar",
    orientation: "h"
  };

  let data = [trace];

  let layout = {
    title: "Top 10 Individual OTUs",
    yaxis: {
      autorange: "reversed"
    }
  };

  Plotly.newPlot("bar", data, layout);
}

// Plot Bubble Chart
function displayBubbleChart(option, dataSet) {
  var barData = dataSet.samples.find(sample => sample.id == option);
  console.log(barData);

  var trace1 = {
    x: barData.otu_ids,
    y: barData.sample_values,
    text: barData.otu_labels,
    mode: "markers",
    marker: {
      color: barData.otu_ids,
      size: barData.sample_values.map(value => value * .6),
      colorscale: "Earth"
    }
  };

  var data = [trace1];

  var layout = {
    title: "OTU Bubble Chart",
    xaxis: {
      title: "OTU ID"
    }
  };

  Plotly.newPlot("bubble", data, layout);
}

// Meta Data and Guage Display
let displayMetaData = option => {
  let mtdata = dataSet.metadata.find(row => row.id == option);
  d3.select("#sample-metadata").html(displayObject(mtdata));
};

let displayObject = obj => {
  let str = "";
  Object.entries(obj).forEach(([key, value]) => {
    str += `<br>${key}:${value}</br>`;
    if (key === "wfreq") {
      buildGauge(value);
      console.log("gauge value is: " + value);
    }
  });
  return str;
};

init();