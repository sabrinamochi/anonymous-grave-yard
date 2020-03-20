var width = document.querySelector("#chart").clientWidth;
var height = document.querySelector("#chart").clientHeight;

var smallScreen = window.innerWidth <= 500 ? true : false;


if (smallScreen) {
    height = window.innerHeight * 1.8;
}

var margin = {
    top: smallScreen ? 5 : 20,
    right: smallScreen ? 25 : 60,
    bottom: smallScreen ? 30 : 30,
    left: smallScreen ? 0 : 10
}

var xScale = d3.scaleLinear();
var yScale = d3.scaleLinear();

var boundedWidth = width - margin.right - margin.left;
var boundedHeight = height - margin.bottom - margin.top;

var xAccessor = d => +d.x;
var yAccessor = d => +d.y;
var colorAccessor = d => d.religion;

var svg = d3.select("#chart").append("svg")
    .attr("width", width)
    .attr("height", height)
    .attr('viewBox', [0, 0, width, height]);

var bounds = svg.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

var colorScale = d3.scaleOrdinal()
    .domain(["C", "P"])
    .range(["#998675", "#999999"]);

/* ADD A TOOLTIP TO THE RECT */
var tooltip = d3.select(".chart-container")
    .append("div")
    .attr("class", "tooltip");

d3.csv("./src/assets/gravemap.csv").then(function(data){{

    data = data.filter(d => d.x !== "");
    xScale.domain([0, d3.max(data, xAccessor)]);
    yScale.domain([0, d3.max(data, yAccessor)]);

    if (smallScreen) {

        xScale
            .range([0, boundedHeight]);
        yScale
            .range([0, boundedWidth]);


    } else {

        xScale
            .range([0, boundedWidth]);
        yScale
            .range([boundedHeight, 0]);
    }

    drawChart(data);

}})


function drawChart(data) {

        var rectWidth = smallScreen ? 15 : 38;
        var rectHeight =smallScreen ? 38 : 20;
        var padding = smallScreen ? 3 : 8;

        var rectsG = bounds.selectAll(".rectangleG")
            .data(data).enter()
            .append("g")
            .attr("class", "rectangleG");

        var rects = rectsG.append("rect")
            .attr("class", "rects")
            .attr("fill", d => colorScale(colorAccessor(d)))
            .attr("x", function(d){ 
                if (smallScreen){
                    return yScale(yAccessor(d)) - rectWidth / 2 + padding; 
                } else { 
                    return xScale(xAccessor(d)) - rectWidth / 2 + padding;  
                }
             })
            .attr("y", function(d){
                if (smallScreen) {
                    return xScale(xAccessor(d)) - rectHeight / 2 + padding;
                } else {
                    return yScale(yAccessor(d)) + rectHeight / 2 + padding;
                }
                
            })
            .attr("width", rectWidth)
            .attr("height",rectHeight);


        var rectsLabel = rectsG.append("text")
            .attr("class", "rectsLabels")
            .text(d => d["Burial Plot Number"].split("-").join(""))
            .attr("x", function(d){ 
                if (smallScreen){
                    return yScale(yAccessor(d)) + rectWidth / 2 + padding;
                } else { 
                    return xScale(xAccessor(d)) + padding;  
                }
             })
            .attr("y", function(d){
                if (smallScreen) {
                    return xScale(xAccessor(d)) - padding - rectWidth / 2;
                } else {
                    return yScale(yAccessor(d)) + rectHeight / 2 + padding;
                }
                
            })
            .attr("text-anchor", "middle")
            .attr("baseline-shift", "-100%")
            .style("pointer-events", "none")
            .attr("transform", function(d){
                 if (smallScreen) {
                    return `rotate(90, ${yScale(yAccessor(d)) + padding}, ${xScale(xAccessor(d)) - padding})`
                } 
            });


        rectsG.selectAll("rect").on("mouseover", function (d) {

            var x = xScale(xAccessor(d)) + rectWidth + 50;
            var y = yScale(yAccessor(d)) + rectHeight / 2 + 10;
            
            tooltip.style("visibility", "visible")
                .style("left", x + "px")
                .style("top", y + "px")
                .html(function () {

                    var description = "Name: " + d.Name + "</br>"
                    +"Birth Date: " + d["Birth Date"] + "</br/>"
                    +"Death Date: " + d["Death Date"]

                    return description;

                });


            d3.selectAll(".rects").attr("opacity", 0.2);

            d3.select(this)
            .attr("opacity", 1);

        }).on("mouseout", function () {
            tooltip.style("visibility", "hidden");
            d3.selectAll(".rects").attr("opacity", 1);
        });

        // // Draw background 
        // var background = svg.append("g")
        //     .attr("class", "backround-lines");
        
        // var lineLeft = background
        //     .append("line")
        //     .attr("x1", margin.left)
        //     .attr("y1", margin.top + boundedHeight + 10)
        //     .attr("x2", margin.left)
        //     .attr("y2", margin.top)
        //     .attr("stroke", "black");

        // var lineTop = background
        //     .append("line")
        //     .attr("x1", margin.left)
        //     .attr("y1", margin.top)
        //     .attr("x2", margin.left + boundedWidth + 20)
        //     .attr("y2", margin.top)
        //     .attr("stroke", "black");

        // var lineBottom = background
        //     .append("line")
        //     .attr("x1", margin.left)
        //     .attr("y1", margin.top + boundedHeight + 10)
        //     .attr("x2", margin.left + boundedWidth + 20)
        //     .attr("y2", margin.top + boundedHeight + 10)
        //     .attr("stroke", "black");


        // var lineRight = background
        //     .append("line")
        //     .attr("x1", margin.left + boundedWidth + 20)
        //     .attr("y1", margin.top)
        //     .attr("x2", margin.left + boundedWidth + 20)
        //     .attr("y2", margin.top + boundedHeight + 10)
        //     .attr("stroke", "black");


    };








