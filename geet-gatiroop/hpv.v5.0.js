class cChar {
    /* MEMBER VARIABLES
    mainChar
    vowelChar
    consonantNumber
    vowelNumber*/
    constructor(mainChar, mainCharCode) {
		this.mainChar = mainChar;
		this.mainCharCode = mainCharCode;
		this.vowelChar = "";
		this.vowelNumber = 0;
		this.index = 0;
		this.maatraa = 0;
		this.maatraaCumulative = 0;

		// space / comma OR whole vowel 
        if (((mainCharCode == 32)||(mainCharCode == 44)) || ((mainCharCode >= 2309) && (mainCharCode <= 2324)))
          this.vowel = mainChar;
        
        // consonant OR consonant with dot at bottom
        if (((mainCharCode >= 2325) && (mainCharCode <= 2361)) || ((mainCharCode >= 2392) && (mainCharCode <= 2399)))
          this.vowel = "अ";

        // anusvaar (the bindi on top) which sometimes is short-cut for half letter
        if (mainCharCode == 2306) 
          this.vowel = "्";
    }
    set vowel(vowelChar) {
		this.vowelChar = vowelChar;
		// set Vowel Number
		switch(vowelChar)
		{
			case "्":
				this.vowelNumber = -1;
				break;
			case "अ": 
				this.vowelNumber = 1;
				break;
			case "आ": case "ा":
				this.vowelNumber = 2;
				break;
			case "इ": case "ि":
				this.vowelNumber = 3;
				break;
			case "ई": case "ी":
				this.vowelNumber = 4;
				break;
			case "उ": case "ु":
				this.vowelNumber = 5;
				break;
			case "ऊ": case "ू":
				this.vowelNumber = 6;
				break;
			case "ए": case "े":
				this.vowelNumber = 7;
				break;
			case "ऐ": case "ै":
				this.vowelNumber = 8;
				break;
			case "ओ": case "ो":
				this.vowelNumber = 9;
				break;
			case "औ": case "ौ":
				this.vowelNumber = 10;
				break;
			case "ृ":
				this.vowelNumber = 11;
				break;
			default:
				this.vowelNumber = -10;
		}
		// set char maatraa as per vowel
		switch (this.vowelNumber)
        {
			case 1: case 3: case 5: case 11:
				this.maatraa = 1;
				break;
            case 2: case 4: case 6: case 8: case 10: case 7: case 9: case 10:
				this.maatraa = 2;
				break;
			default:
				this.maatraa = 0;
				break;
		}
    }
    // determine if character is half letter
    isHalfLetter()
    {
    	return (this.vowelNumber == -1); 
    }
    isPureVowel()
    {
    	return (this.mainChar == this.vowelChar);
    }
    // check if this character is of laghu vowel
    isLaghu ()
    {
    	switch(this.vowelNumber)
    	{
    		case 1: case 3: case 5: case 11:
    			return true;
    			break;
    		default:
    			return false;
    			break;
    	}
    }
    isDeergha()
    {
    	switch(this.vowelNumber)
    	{
    		case 2: case 4: case 6: case 8: case 10: case 7: case 9: case 10:
    			return true;
    			break;
    		default:
    			return false;
    			break;
    	}
    }
    // determine when a half letter will have 0 or 1 maatraa
	// the logic for default handling - which the user can always override
	// p = previous letter (consonant+vowel array structure)
	// this = current letter (consonant+vowel array structure) - for which the len is to be 
	// determined
	// n = next letter (consonant+vowel array structure)	
	calculateHalfLetterLen(p=false,n=false)
	{
		if (!p)  // no previous letter, half maatraa is first letter of line
		{
      		this.maatraa = 0;
      		return this.maatraa;
		}
      	if (p.vowelNumber === -10) // no previous letter, half maatraa is first letter of word
      	{
      		this.maatraa = 0;
      		return this.maatraa;
      	}

      	// special combinations ----------------
	    if ((this.mainChar == "म") && (n.mainChar == "ह"))
	    {
	      this.maatraa = 0;
	      return this.maatraa;
	    }
	    if ((this.mainChar == "न") && (n.mainChar == "ह"))
	    {
	      this.maatraa = 0;
	      return this.maatraa;
	    }
	  	// end special combinations ------------

	  	if (p.isLaghu())
	  	{
	  		this.maatraa = 1;
	  		return this.maatraa;
	  	}
	  	if (n)
	  	{
	  		if (p.isDeergha() && n.isDeergha()) // both side deergha
		    {
		    	this.maatraa = 1;
		      	return this.maatraa;
		    }
	  	}
	  	return 0;		  	
	}
}


class cLine {
	constructor() {
		this.characters = new Array();
		this.count = 0;
		this.maatraa = 0;
	}
	// change the vowel of the last character
	lastCharVowel(vowelString)
	{
		const lastChar = this.characters[this.count-1];
		const oldMaatraa = lastChar.maatraa;
		lastChar.vowel = vowelString;
		this.maatraa += lastChar.maatraa - oldMaatraa;
		lastChar.maatraaCumulative += lastChar.maatraa - oldMaatraa;
	}
	// add a new character to line
	push(newChar)
	{
		newChar.index = this.count;
		// assign cumulative maatraa of char as per previous char
		if (newChar.index == 0)
			newChar.maatraaCumulative = newChar.maatraa;
		else
			newChar.maatraaCumulative = this.characters[this.count-1].maatraaCumulative + newChar.maatraa;

		this.characters.push(newChar);
		this.maatraa += newChar.maatraa;
		this.count++;
	}
	// get the nth character of a line
	charByIndex(idx)
	{
		return this.characters[idx];
	}
	// get previous character w.r.t. given current character
	previousChar(c) // c = current character
	{
		if ((c.index != 0) && (this.count>1))
			return this.characters[c.index-1];
		else
			return false;
	}
	// get next character w.r.t. given current character
	nextChar(c) // c = current character
	{
		if ((this.count>1) && (c.index < this.count - 1))
			return this.characters[c.index+1];
		else
			return false;
	}
	// return an array of half letters in a line
	getHalfLetters()
	{
		const halfLetters = this.characters.filter(function (thisChar) {
			return thisChar.isHalfLetter();
		});
		return halfLetters;
	}
	// calculate default maatraa for half letters in a line based
	calculateHalfLettersMaatraa()
	{
		const halfLetters = this.getHalfLetters();
		let maatraa = 0;
		let i;
		for (i=0;i<halfLetters.length;i++)
		{
			const thisHalfLetter = halfLetters[i];
			maatraa = 0;
			// debugger;
			if (thisHalfLetter.index == 0) // first character, no previous, next not required
				maatraa = thisHalfLetter.calculateHalfLetterLen();
			else
			{
				const previousChar = this.previousChar(thisHalfLetter);
				const nextChar = this.nextChar(thisHalfLetter.index+1);
				maatraa = thisHalfLetter.calculateHalfLetterLen(previousChar, nextChar);
			}
			// update cumulative maatraa of line
			if (maatraa>0)
			{
				this.maatraa += maatraa;
				thisHalfLetter.maatraaCumulative += maatraa;
				let j;
				// update maatraaCumulative for all subsequent chars in line
				for (j=thisHalfLetter.index+1;j<this.count;j++)
					this.characters[j].maatraaCumulative++;
			}
			
		};
	}
}

class cPoem {
	constructor(originalText) {
		this.originalText = originalText;
		this.lines = new Array();
		this.lineCount = 0;
		this.maxLineLen = 0;
	}
	pushLine(newLine)
	{
		this.lines.push(newLine)
		this.lineCount++;
		if (this.maxLineLen < newLine.maatraa)
			this.maxLineLen = newLine.maatraa;
	}
	get text() 	{
		return this.originalText;
	}
}

var oPoem;

function visualize()
{
	splitNprocessPoem();
	draw();
}

function splitNprocessPoem()
{
	oPoem = new cPoem(document.getElementById("pom").value);
    const lines = oPoem.text.split("\n");
    const maxLineLen = lines.length;
    let iLine;
    for (iLine = 0; iLine < maxLineLen; iLine++) // process each line - i = line index
    {
    	const oLine = new cLine();
    	// debugger;
        for (k=0;k<lines[iLine].length;k++) // process each char: k = char index
        {
        	charCode = lines[iLine].charCodeAt(k);
        	if ((charCode >= 2366) && (charCode <= 2381)) // maatraa
			{
				// new element not added to line array
				// the vowel part of previous element 
				// modified to update maatraa
				oLine.lastCharVowel(lines[iLine].substring(k,k+1));
			}
			else // not maatraa - true new char
			{
				var thisChar = lines[iLine].substring(k,k+1);
				const oChar = new cChar(thisChar,charCode);
	          	oLine.push(oChar);
			}
        }
        // console.log(oLine.getHalfLetters());
        oLine.calculateHalfLettersMaatraa();
        oPoem.pushLine(oLine);
    }
    console.log(oPoem);
}

var charW = 20; // decrease charW to 20 from 24 earlier
var charH = 20; // decrease charW to 20 from 24 earlier
var paddingLeft = 10;
var lineSpacing = 5;
var mode = "analyze";
var fShowText = true;
var prevText = "";
var prevBaseCount = 1;
var fLineSpacing = true;
var fFreeVerse = false;
var selWord = 1;
var compositeLinesMarkingA = [];
var fGhazal = false;
var radeef = '';
var radeefArray = [];
var radeefTruncated = 0;

// the D3 draw dance!
function draw()
{
	const maxLen = oPoem.maxLineLen;
	const lineCount = oPoem.lineCount;
	var chart = d3.select("#chart");
	chart.select("svg").remove();
	var svg = chart.append("svg")
	          .attr("width", function() {return (fFreeVerse?charW*maxLen+120:charW*maxLen+100);})
	          .attr("height", ((lineCount*(charW+lineSpacing))+(charW))+charW)
	          .attr("style","border-bottom: solid 1px #ddd;");

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
		.data(chars)
		.enter().append("svg:g")
		  .attr("transform", function(d,i) 
		    { return "translate(" + paddingLeft + "," + ((i*(charH))+(charH)) + ")" })
		  .attr("id", function(d,i) { return "gLine"+i});
	}

	if (fShowText)
    {
        g.selectAll("text")               // char text
          .data(function(d) {return d.characters;} )
          .enter().append("svg:text")
            .attr("y", charH-2)
            .attr("x", function(d) {return drawCharTxtPos(d);})
            .attr("class", "graphText3")
            //.attr("dominant-baseline", "central")
            .attr("text-anchor", "middle")
            .text(function(d) {return drawCharTxt(d);});
    }
}

// helper for draw function to place text in correct position
function drawCharTxtPos(d)
{
	var x = ((d.maatraaCumulative-d.maatraa)*charW);
	var w = charW*d.maatraa;
	return x+(w/2);
}

// helper for draw function to show text
function drawCharTxt(d)
{
	var txt = "";
	if ((d.vowelNumber != -10) && (d.vowelNumber != 0))  // hindi character
	{
	  if (d.isPureVowel()||(d.vowelNumber == 1))
	  {
	    txt = d.mainChar;
	  }
	  else
	  {
	    txt = d.mainChar+d.vowelChar;
	  }
	}
	return txt;
}