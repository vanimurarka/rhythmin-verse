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
let oVisual;

// Class: cVisual
// Class for setting the visual display
class cVisual{
	constructor(availableW) {
		this.availableW = availableW;
		this.mode = 'fixed'; // possible values; flexible, fixed
		this.userMode = '';
		this.width = 0;
		this.ratio = 1;
	}
	setMode(mode, width, ratio)
	{
		this.mode = mode;
		this.width = width;
		this.ratio = ratio;
	}
}

// Function: initSvgFixed
function initSvgFixed(svgW, svgH)
{
	var chart = d3.select("#chart");
	var svg = chart.append("svg")
	          .attr("width", function() {return svgW;})
	          .attr("height", function() {return svgH;})
	          .attr("style","border-bottom: solid 1px #ddd;background-color:white");
	return svg;
}

// Function: initSvgFlex
function initSvgFlex(svgViewBox)
{
	var chart = d3.select("#chart");
	var svg = chart.append("svg")
	          .attr("viewBox",svgViewBox)
	          .attr("preserveAspectRatio","xMidYMid meet")
	          .attr("style","border-bottom: solid 1px #ddd;background-color:white");
	return svg;
}

function visualize(poem, availableW)
{
	oVisual = new cVisual(availableW);
	draw(poem);	
}

// Function: draw
// The D3 draw dance!
function draw(oPoem)
{	
	const maxLen = oPoem.maxLineLen;
	const lineCount = oPoem.lines.length;
	var chart = d3.select("#chart");
	chart.select("svg").remove();
	const svgW = fFreeVerse?(charW*maxLen)+70:(charW*maxLen)+30;
	const svgH = fLineSpacing?(lineCount*(charH+lineSpacing))+(charH*2):(lineCount*charH)+(charH*2);
	const svgViewBox = "0 0 "+svgW+" "+svgH;
	const ratio = oVisual.availableW / svgW;
	var svg;
	// debugger;
	if (oVisual.availableW <= 500) // in small screen width always make the vis autosized
	{
		oVisual.setMode("flexible",svgW,ratio);
	}
	else if ((ratio>=0.6)&&(ratio<=1)) // make vis autosized if ratio within a reasonable range (not too small or big) 
	{
		oVisual.setMode("flexible",svgW,ratio);
	}
	else // make vis fixed size
	{
		oVisual.setMode("fixed",svgW,ratio);
	}

	if (oVisual.userMode == '') // if user has no pref, do as per optimum calculation above
	{
		if (oVisual.mode == 'fixed')
			svg = initSvgFixed(svgW, svgH);
	    else
	    	svg = initSvgFlex(svgViewBox);
	}
	else // user has set preference, follow that, despite optimum calculation above
	{
		if (oVisual.userMode == 'fixed')
			svg = initSvgFixed(svgW, svgH);
	    else
	    	svg = initSvgFlex(svgViewBox);
	}

	// create the "g"s (svg groups) for each line
	if (fLineSpacing)
	{
		var g = svg.selectAll("g")
		.data(oPoem.lines)
		.enter().append("svg:g")
		  .attr("transform", function(d,i) 
		    { 
		      return "translate(" + paddingLeft + "," + ((i*(charH+lineSpacing))+(charH+lineSpacing)) + ")"; 
		    })
		  .attr("id", function(d,i) { return "gLine"+i});
	}
	else
	{
		var g = svg.selectAll("g")
		.data(oPoem.lines)
		.enter().append("svg:g")
		  .attr("transform", function(d,i) 
		    { return "translate(" + paddingLeft + "," + ((i*(charH))+(charH)) + ")" })
		  .attr("id", function(d,i) { return "gLine"+i});
	}

	if (fShowText)
    {
        g.selectAll("text")               // char text
          .data(function(d) {return d.subUnits;} )  // d = line, subsequent d = characters
          .enter().append("svg:text")
            .attr("y", charH-2)
            .attr("x", function(d,i) {return drawCharTxtPos(d,i);})
            .attr("class", "graphText3")
            //.attr("dominant-baseline", "central")
            .attr("text-anchor", "middle")
            .text(function(d) {return d.text;});
    }

    g.selectAll("path")
      .data(function(d) {return d.subUnits;} ) // d = line, subsequent d = characters
      .enter().append("path")
        .attr("id", function(d,i) {return "char"+i})
        .attr("style", function(d,i) {
          if (fGhazal)
            return drawStyleCharBlock(d,'ghazal');
          else
            return drawStyleCharBlock(d,'consonant');
        })
        .attr("d", function(d,i) {return drawCharBlock(d,i);})
        .attr("title", function(d,i) {return d.mainChar+d.vowelChar;})
        .on("click",adjustCharLen);

    // line total maatraa
    if (fFreeVerse) // line maatraa count numbers are clickable
    {
      g.append("svg:text")            // line total maatraa
      .attr("y", charH)
      .attr("x", function(d) {return charW*maxLen+5;})
      .attr("class", "graphText3")
      .text(function(d) { return (d.maatraa > 0) ? d.maatraa : "";})
      .on("click",markCompositeLine);

      // small dash beside maatraa count
      g.append("svg:line")
        .attr("x1", function(d,i) {return charW*maxLen+(charW+5);})
        .attr("y1", function(d,i) {return charH-2;})
        .attr("x2", function(d) {return charW*maxLen+(charW+10);})
        .attr("y2", charH-2)
        .attr("style", function(d,i) {return drawFreeVerseDashStyle(i);})
        .on("click",markCompositeLine);

      // composite line marker
      g.append("svg:line")
        //.attr("x1", function(d) {return charW*maxLen+(charW);})
        .attr("x1", function(d,i) {return drawCompositeLineMarker("x1",i);})
        .attr("y1", function(d,i) {return drawCompositeLineMarker("y1",i);})
        .attr("x2", function(d) {return charW*maxLen+(charW+12);})
        .attr("y2", charH+2)
        .attr("style", function(d,i) {return drawCompositeLineMarker("style",i);})
        .on("click",unmarkCompositeLine);

      // composite line total maatraa
    	drawCompositeNumbers();
    }    
    else  // normal - numbers are not clickable
    {
      g.append("svg:text")            // line total maatraa, d = line
      .attr("y", charH)
      .attr("x", function(d) {return charW*maxLen+(5);})
      .attr("class", "graphText3")
      .text(function(d) { return (d.maatraa > 0) ? d.maatraa : "";});
    }
}

// Function: drawCharBlock
// Shapes of character blocks
function drawCharBlock(d,i)
{
	// debugger;
	// console.log(d);
	if (i==0) lineRhythmTotal = 0;
	// console.log(lineRhythmTotal);
	let p = "";
	let x = ((lineRhythmTotal)*charW);  // where the drawing of this path has to start horizontally
	lineRhythmTotal += d.rhythmAmt;
	let w = charW*d.rhythmAmt;
	let h = charH;
	if ((d.vowelNumber == -1) && (d.rhythmAmt == 0)) // half letter of 0 width
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
	let w = charW*d.rhythmAmt;
	lineRhythmTotal += d.rhythmAmt;
	return x+(w/2);
}

/*
	Function: drawStyleCharBlock
	Style of char blocks - including color
	Parameters:
		c - the character to be styled
		colorBy -
*/
function drawStyleCharBlock(c,colorBy)
{
	// debugger;
	// space, comma
	if (c.vowelNumber === -10)
	{
		if (c.maapneeType == 0) // yati
			return "stroke:rgb(0,118,255);stroke-width:3";
		else // do not display normal space, comma
			return "display: none";
	}

	var color = "rgb(0,220,255)";
	var strokeOp = "0.3";
	var strokeW = 1;
	var fillOp = "0.4";
	var strokeColor = "black";

	// call conColor to determine color and opacity as per consonant
	if (colorBy == 'consonant')
	{
		if (c.rhythmAmt == c.systemRhythmAmt)
		{
				if (c.systemRhythmAmt == 2)
				{
					color = "rgb(0,255,0)"; // green
					fillOp = "0.4";
				}
				// c.maapneeType = 1.5 means 1+1 2 type deergh
				if (c.maapneeType == 1.5)
				{
					color = "rgb(0,255,0)"; // green
					fillOp = "0.2";
				}
	  		// color = "rgb(0,220,255)"; // blue
	  		if ((c.rhymeLevel > 0) && (fRhymingLines))
	  		{
	  			color = rhymeColors[c.rhymeGroup];
	  			fillOp = "0.4";
	  			if (color === undefined) // undo color assignment
	  			{
	  				color = "white";
	  				fillOp = "0.2";
	  			}
	  		}

		}
	  	else // user adjusted maatraa show in diff color
	  	{
	  		// color = "rgb(220,45,45)"; //
	  		color = "yellow";
	  		fillOp = "0.5";
	  	}

	}
	if (colorBy == 'ghazal')
    {
  		if (c.maatraa == c.systemMaatraa)
  	{
	    if (c.isRadeef) // is a radeef char
	    {
	      color = "rgb(0,220,255)"; // blue
	      fillOp = "0.5";
	    }
	    if (c.isKaafiyaa) // is a kaafiyaa char
	    {
	      color = "rgb(0,255,0)"; // green
	      fillOp = "0.5";
	    }
		}
		else
		{
			// color = "rgb(220,45,45)"; //
			color = "yellow";
			fillOp = "0.5";
		}

  }

	// unknown vowel, individual length unknown/0
	// what are some examples when this occurs? 
	// 1 eg. ऋ as in rishi, half maatraas
	// any other examples? 
	if ((c.vowelNumber == -1) && (c.maatraa == 0))
	{

	  color = "black";
	  fillOp = "0.6";    
	  if (c.maatraa  !== c.systemMaatraa)
	  {
	  	color = "yellow";
	  	fillOp = "1";
	  	strokeColor = "orange";
	  	strokeOp = "1";
	  }
	  	
	}

	return "fill: "+color+"; fill-opacity: " + fillOp + ";stroke:"+strokeColor+"; stroke-width: "+strokeW+"; stroke-opacity: "+strokeOp;
}

// Function: adjustCharLen
// When user clicks char to adjust maatraa
function adjustCharLen()
{
	// debugger;
	var iChr = parseInt(this.getAttribute("id").substring(4));
	var iLine = parseInt(this.parentNode.getAttribute("id").substring(5));
	var kk = 0;
	oPoem.adjustCharMaatraa(iLine,iChr);
	draw();
}