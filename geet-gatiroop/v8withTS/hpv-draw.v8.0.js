let charW = 20; 
let charH = 20; 
let paddingLeft = 2;
let lineSpacing = 5;
let fShowText = true;
let fLineSpacing = true;
let fFreeVerse = false;
let fGhazal = false;
let fRhymingLines = false;

let lineRhythmTotal = 0;

function draw(oPoem)
{
	let chart = d3.select("#chart");
	let svg = chart.append("svg")
          .attr("width", function() {return 500;})
          .attr("height", function() {return 500;})
          .attr("style","border-bottom: solid 1px #ddd;background-color:white");

    let g = svg.selectAll("g")
		.data(oPoem.lines)
		.enter().append("svg:g")
		  .attr("transform", function(d,i) 
		    { return "translate(" + paddingLeft + "," + ((i*(charH))+(charH)) + ")" })
		  .attr("id", function(d,i) { return "gLine"+i});

	g.selectAll("text")               // char text
          .data(function(d) {return d.subUnits;} )  // d = line, subsequent d = characters
          .enter().append("svg:text")
            .attr("y", charH-2)
            .attr("x", function(d,i) {return drawCharTxtPos(d,i);})
            .attr("class", "graphText3")
            //.attr("dominant-baseline", "central")
            .attr("text-anchor", "middle")
            .text(function(d) {return d.text;});

	g.selectAll("path")
      .data(function(d) {return d.subUnits;} ) // d = line, subsequent d = subUnits
      .enter().append("path")
        .attr("id", function(d,i) {return "char"+i})
        .attr("style", "stroke:black; stroke-width: 1; stroke-opacity: 0.3;fill:white;fill-opacity:0.4")
        .attr("d", function(d,i) {return drawCharBlock(d,i);});
}

// Function: drawCharBlock
// Shapes of character blocks
function drawCharBlock(d,i)
{
	// console.log(d);
	if (i==0) lineRhythmTotal = 0;
	// console.log(lineRhythmTotal);
	let p = "";
	let x = ((lineRhythmTotal)*charW);  // where the drawing of this path has to start horizontally
	lineRhythmTotal += d.rhythmAmtCumulative;
	let w = charW*d.rhythmAmtCumulative;
	let h = charH;
	if ((d.vowelNumber == -1) && (d.rhythmAmtCumulative == 0)) // half letter of 0 width
	{
	  w = 4;  // small black box on top
	  h = 4;  // small black box on top
	  x = x-2;  
	  p = "M"+x+",0 L"+x+",-"+h + " L"+(x+w)+",-"+h+" L"+(x+w)+",0 z";
	}
	else
	{
	  // set all vowels to a to square or double width rectangle
	  p = "M"+x+",0 L"+x+","+h + " L"+(x+w)+","+h+" L"+(x+w)+",0 z";
	}
	return p;
}

// Function: drawCharTxtPos
// Helper for draw function to place text in correct position
function drawCharTxtPos(d,i)
{
	if (i==0) lineRhythmTotal = 0;
	let x = ((lineRhythmTotal)*charW);
	let w = charW*d.rhythmAmtCumulative;
	lineRhythmTotal += d.rhythmAmtCumulative;
	return x+(w/2);
}