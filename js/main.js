// Hint: This is a great place to declare your global variables
let selectedCountry = "Vietnam";

const width = 1100;
const height = 700;
const marginTop = 20;
const marginRight = 20;
const marginBottom = 50;
const marginLeft = 50;
const size = 16;
const keys = [
  { title: "Female Employment Rate", color: "#ff3b9f" },
  { title: "Male Employment Rate", color: "#219191" }
];
const countryDatas = [
  "Vietnam",
  "United States",
  "Argentina",
  "United Kingdom",
  "Canada"
];

// Create the SVG container.
const svg = d3.create("svg").attr("width", width).attr("height", height);

// Declare the x (horizontal position) scale.
const x = d3
  .scaleTime()
  .domain([new Date("1990"), new Date("2023")])
  .range([marginLeft, width - marginRight]);

// Declare the y (vertical position) scale.
const y = d3
  .scaleLinear()
  .domain([0, 0.8])
  .range([height - marginBottom, marginTop]);

// Add the x-axis.
const xAxis = svg
  .append("g")
  .attr("transform", `translate(0,${height - marginBottom})`)
  .call(d3.axisBottom(x));

// Add the y-axis.
const yAxis = svg
  .append("g")
  .attr("transform", `translate(${marginLeft},0)`)
  .call(d3.axisLeft(y));

// Add X axis label:
svg
  .append("text")
  .attr("text-anchor", "end")
  .attr("x", width / 2)
  .attr("y", height - marginTop + 10)
  .text("Year");

// Add Y axis label:
svg
  .append("text")
  .attr("text-anchor", "end")
  .attr("transform", "rotate(-90)")
  .attr("y", "12")
  .attr("x", -height / 2 + marginBottom + marginTop)
  .text("Employment Rate");

// Reset cache
svg.selectAll("line").remove();
svg.selectAll("circle").remove();

// create legends

svg
  .selectAll("mydots")
  .data(keys)
  .enter()
  .append("rect")
  .attr("x", 780)
  .attr("y", function (d, i) {
    return 60 + i * (size + 5);
  })
  .attr("width", size)
  .attr("height", size)
  .style("fill", (d) => d.color);

// Add one dot in the legend for each name.
svg
  .selectAll("mylabels")
  .data(keys)
  .enter()
  .append("text")
  .attr("x", 780 + size * 1.2)
  .attr("y", function (d, i) {
    return 60 + i * (size + 5) + size / 2;
  })
  .style("fill", "black")
  .text((d) => d.title)
  .attr("text-anchor", "left")
  .style("alignment-baseline", "middle");

// This function will be called once the HTML page is fully loaded by the browser
document.addEventListener("DOMContentLoaded", function () {
  // Hint: create or set your svg element inside this function
  // This will load your CSV files and store them into two arrays.

  Promise.all([
    d3.csv("data/females_data.csv"),
    d3.csv("data/males_data.csv")
  ]).then(function (values) {
    // Hint: This is a good spot for data wrangling
    female_data = convertStringDataToNumeric(values[0]);
    male_data = convertStringDataToNumeric(values[1]);
    drawLolliPopChart(selectedCountry);
  });
});
function drawChart() {}
// You can use this function to draw the lollipop chart.
function drawLolliPopChart(value) {
  selectedCountry = value;

  // Clear cache
  svg.selectAll("line").remove();
  svg.selectAll("circle").remove();

  x.domain([new Date("1990"), new Date("2023")]);
  xAxis.transition().duration(1000).call(d3.axisBottom(x));

  y.domain([0, 0.8]);
  yAxis.transition().duration(1000).call(d3.axisLeft(y));

  // Lines
  const female_line = svg.selectAll("line").data(female_data);
  const male_line = svg.selectAll("line").data(male_data);

  female_line
    .enter()
    .append("line")
    .attr("x1", (d) => x(d.Year) + 7)
    .attr("x2", (d) => x(d.Year) + 7)
    .attr("y1", y(0))
    .attr("y2", y(0))
    .attr("stroke", "#ff3b9f")
    .merge(female_line)
    .transition()
    .duration(1000)
    .attr("x1", (d) => x(d.Year) + 7)
    .attr("x2", (d) => x(d.Year) + 7)
    .attr("y2", y(0))
    .attr("y1", (d) => y(d[`${value}`]))
    .attr("stroke", "#ff3b9f");

  male_line
    .enter()
    .append("line")
    .attr("x1", (d) => x(d.Year) - 7)
    .attr("x2", (d) => x(d.Year) - 7)
    .attr("y1", y(0))
    .attr("y2", y(0))
    .attr("stroke", "#219191")
    .merge(male_line)
    .transition()
    .duration(1000)
    .attr("x1", (d) => x(d.Year) - 7)
    .attr("x2", (d) => x(d.Year) - 7)
    .attr("y2", y(0))
    .attr("y1", (d) => y(d[`${value}`]))
    .attr("stroke", "#219191");

  //   Circles
  const female_circle = svg.selectAll("mycircle").data(female_data);
  const male_circle = svg.selectAll("mycircle").data(male_data);

  female_circle
    .enter()
    .append("circle")
    .attr("cx", (d) => x(d.Year) + 7)
    .attr("cy", y(0))
    .attr("r", 4)
    .style("fill", "#ff1393")
    .merge(female_circle)
    .transition()
    .duration(1000)
    .attr("cx", (d) => x(d.Year) + 7)
    .attr("cy", (d) => y(d[`${value}`]))
    .attr("r", "4")
    .style("fill", "#ff1393")
    .attr("stroke", "#ff3b9f");

  male_circle
    .enter()
    .append("circle")
    .attr("cx", (d) => x(d.Year) - 7)
    .attr("cy", y(0))
    .attr("r", 4)
    .style("fill", "#038b8b")
    .merge(male_circle)
    .transition()
    .duration(1000)
    .attr("cx", (d) => x(d.Year) - 7)
    .attr("cy", (d) => y(d[`${value}`]))
    .attr("r", "4")
    .style("fill", "#038b8b")
    .attr("stroke", "#219191");

  // Append the SVG element.
  myDataVis.append(svg.node());
}

function convertStringDataToNumeric(data) {
  if (!data || data.length === 0) {
    return data;
  }

  return data.map((obj) => {
    const newObj = { ...obj };
    countryDatas.forEach((country) => {
      if (country in newObj) {
        newObj[country] = parseFloat(newObj[country]);
      }
    });
    newObj["Year"] = new Date(newObj["Year"]);

    return newObj;
  });
}
