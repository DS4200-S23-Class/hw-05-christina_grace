// SCATTER PLOT
// sets frame1 up
const FRAME_HEIGHT = 500;
const FRAME_WIDTH = 500; 
const MARGINS = {left: 50, right: 50, top: 50, bottom: 50};

const FRAME1 = d3.select("#scatter") 
                  .append("svg") 
                    .attr("height", FRAME_HEIGHT)   
                    .attr("width", FRAME_WIDTH)
                    .attr("class", "frame");

// for scaling data
const VIS_HEIGHT = FRAME_HEIGHT - MARGINS.top - MARGINS.bottom;
const VIS_WIDTH = FRAME_WIDTH - MARGINS.left - MARGINS.right;

// scaling function for X coors
const X_SCALE = d3.scaleLinear() 
                    .domain([0, 10])
                    .range([0, VIS_WIDTH]); 
// scaling function for Y coors
const Y_SCALE = d3.scaleLinear() 
                    .domain([0, 10])
                    .range([VIS_HEIGHT, 0]); 

// builds scatter plot
function build_interactive_scatter() {
    // reads in data from file
    d3.csv("data/scatter-data.csv").then((data) => {

        // add our circles with styling 
        FRAME1.selectAll("point") 
            .data(data)
            .enter()  
            .append("circle")
                .attr("cx", (d) => { return (X_SCALE(d.x) + MARGINS.left); }) // scaled X
                .attr("cy", (d) => { return (Y_SCALE(d.y) + MARGINS.bottom); }) // scaled Y
                .attr("r", 10)
                .attr("fill", 'pink')
                .attr("class", "point")
                .on("mouseover", function(d) {
                    d3.select(this).style("fill", "rosybrown"); }) // mouse over function       
                .on("mouseout", function(d) {
                    d3.select(this).style("fill", "pink"); }) // mouse out function
                .on("click", function(d) {
                    d3.select(this).classed("border", !d3.select(this).classed("border")); // toggles border class
                    click(d3.select(this).attr('cx'),  d3.select(this).attr("cy")); // displays last pt clicked
            })

        // Add an X axis to the vis  
        FRAME1.append("g") 
            .attr("transform", "translate(" + MARGINS.left + 
                "," + (VIS_HEIGHT + MARGINS.top) + ")") 
            .call(d3.axisBottom(X_SCALE).ticks(10)) 
                .attr("font-size", '20px'); 

        // Add a Y axis to the vis  
        FRAME1.append("g") 
                .attr("transform", "translate(" + MARGINS.left + 
                    "," + (MARGINS.top) + ")") 
                .call(d3.axisLeft(Y_SCALE).ticks(10)) 
                    .attr("font-size", '20px');

  
    });
};

// completes actions when points are clicked
function click(x, y) {

    // reverse scaling
    X_ReverseScale = d3.scaleLinear() 
                        .domain([0, VIS_WIDTH])
                        .range([0, 10]);
    Y_ReverseScale = d3.scaleLinear() 
                        .domain([VIS_HEIGHT, 0])
                        .range([0, 10]);

    xScaled = X_ReverseScale(x - MARGINS.left)
    yScaled = Y_ReverseScale(y - MARGINS.bottom)

    // prints out text
    let newText = "The last point clicked was: (" + Math.round(xScaled) + ", " + Math.round(yScaled) + ")";
    let buttonDiv = document.getElementById("lastPt");
    buttonDiv.innerHTML = newText

};

// executed when add point button clicked
function submitPoint() {
    // gets new coordinate points
    let xCoor = X_SCALE(document.getElementById("x-coor").value)
    let yCoor = Y_SCALE(document.getElementById("y-coor").value)

    // adds point to frame
    FRAME1.append('circle')
            .attr('cx', xCoor + MARGINS.left)
            .attr("cy", yCoor + MARGINS.bottom)
            .attr("r", 10)
            .attr("class", "point")
            .on("mouseover", function(d) {
                d3.select(this).style("fill", "rosybrown"); }) // mouse over function       
            .on("mouseout", function(d) {
                d3.select(this).style("fill", "pink"); }) // mouse out function
            .on("click", function(d) {
                d3.select(this).classed("border", !d3.select(this).classed("border")); // toggles border class
                click(d3.select(this).attr('cx'),  d3.select(this).attr("cy")); // displays last pt clicked
            });
};
build_interactive_scatter();
// adds event listener to add point button
document.getElementById('addPoint').addEventListener('click', submitPoint);


// BAR GRAPH
// sets frame2 up
const FRAME2 = d3.select("#bar") 
                  .append("svg") 
                    .attr("height", FRAME_HEIGHT)   
                    .attr("width", FRAME_WIDTH)
                    .attr("class", "frame");

// builds bar graph
function build_interactive_bar() {
    // reads in data from file
    d3.csv("data/bar-data.csv").then((data) => {
        // sets domains
        const X_SCALE2 = d3.scaleBand()
                            .domain(data.map(function (d) { return d.category; }))
                            .range([0, VIS_WIDTH]).padding(0.5);
        const Y_SCALE2 = d3.scaleLinear()
                            .domain([0, d3.max(data, function (d) { return d.amount; })])
                            .range([VIS_HEIGHT, 0]);

        // add bars
        FRAME2.selectAll("bar") 
            .data(data)
            .enter()  
            .append("rect")
                .attr("x", (d) => { return (X_SCALE2(d.category) + MARGINS.left)})
                .attr("y", (d) => { return (Y_SCALE2(d.amount) + MARGINS.top)}) 
                .attr("width", X_SCALE2.bandwidth())
                .attr("height", (d) => { return (VIS_HEIGHT - Y_SCALE2(d.amount)); })
                .attr("fill", 'pink')
                .attr("class", "bar");
                // .on("mouseover", function(d) {
                //     d3.select(this).style("fill", "rosybrown"); }) // mouse over function       
                // .on("mouseout", function(d) {
                //     d3.select(this).style("fill", "pink"); }); // mouse out function

        // Add an X axis to the vis  
        FRAME2.append("g") 
            .attr("transform", "translate(" + MARGINS.left + 
                "," + (VIS_HEIGHT + MARGINS.top) + ")") 
            .call(d3.axisBottom(X_SCALE2).ticks(10)) 
                .attr("font-size", '20px'); 

        // Add a Y axis to the vis  
        FRAME2.append("g") 
                .attr("transform", "translate(" + MARGINS.left + 
                    "," + (MARGINS.top) + ")") 
                .call(d3.axisLeft(Y_SCALE2).ticks(10)) 
                    .attr("font-size", '20px');
        
        // adds tooltip
        const TOOLTIP = d3.select('#bar')
                            .append("div")
                                .attr("class", "tooltip")
                                .style("opacity", 0);

         // event handler functions for tooltips
        function handleMouseover(event, d) {
            d3.select(this).style("fill", "rosybrown");
            TOOLTIP.style("opacity", 1); 
        
         }
  
        function handleMousemove(event, d) {
            // position the tooltip and fill in information 
            TOOLTIP.html("Category: " + d.category + "<br>Amount: " + d.amount)
                    .style("left", (event.pageX + 10) + "px") //add offset from mouse
                    .style("top", (event.pageY - 50) + "px"); 
        }
  
        function handleMouseleave(event, d) {
            d3.select(this).style("fill", "pink");
            // on mouseleave, make transparant again 
            TOOLTIP.style("opacity", 0); 
        } 
  
        // Add event listeners
        FRAME2.selectAll(".bar")
                .on("mouseover", handleMouseover) //add event listeners
                .on("mousemove", handleMousemove)
                .on("mouseleave", handleMouseleave);
    });
};
build_interactive_bar();
