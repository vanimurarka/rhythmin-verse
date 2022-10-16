"use strict";

class cChar {
	char : string;
	charCode : number;
	isHindi: boolean;
  constructor(mainChar: string, mainCharCode: number) {
		this.char = mainChar;
		this.charCode = mainCharCode;
		if ((mainCharCode >= 2304) && (mainCharCode <= 2431))
			this.isHindi = true;
		else
			this.isHindi = false;
	}
}

enum unitType {
	unknown = "unknown",
	maatraa = "maatraa",
	line = "line"
}

enum poemType {
	generic = 0,
	ghazal = 1,
	freeverse = 2
}

class cRhythmUnit {
	chars : cChar[];
	isHindi : boolean;
	subUnits : cRhythmUnit[];
	kind : unitType;
	index : number;
	rhythmAmt : number;
	systemRhythmAmt : number; 
	rhythmAmtCumulative : number;
	rhythmPatternValue: number;
	text : string;

	constructor(mainChar: string, mainCharCode: number); 
	constructor(subUnits:cRhythmUnit[], text:string, unitType:unitType );
	constructor(...argsArray : any[])
	{
		this.chars = [];
		this.subUnits = [];
		this.kind = unitType.unknown;
		this.index = 0;
		this.rhythmAmt = 0;
		this.systemRhythmAmt = 0;
		this.rhythmAmtCumulative = 0;
		this.text = '';
		if ((typeof argsArray[0] === 'string') && (typeof argsArray[1] === 'number'))
		{
			let mainChar = argsArray[0];
			let mainCharCode = argsArray[1];
			this.chars[0] = new cChar(mainChar, mainCharCode);
			this.isHindi = this.chars[0].isHindi;
		}
		else if ((argsArray.length == 3) && Array.isArray(argsArray[0]))
		{
			this.subUnits = argsArray[0];
			this.text = argsArray[1];
			let unitType = argsArray[2];
			this.kind = unitType;
		}
	}
	replaceFirstChar(newMainChar: string, newMainCharCode: number)
	{
		this.chars[0].char = newMainChar;
		this.chars[0].charCode = newMainCharCode;
	}
	adjustUnitRhythm(iUnit:number,pattern) {}
	setRhythmPatternVal(patternVal:number) {this.rhythmPatternValue = patternVal;}
}

class cMaatraaUnit extends cRhythmUnit {
	vowelChar : string;
	vowelNumber : number;
	isHalfLetter : boolean;
	isFirstLetterOfWord : boolean;
	constructor(mainChar: string, mainCharCode: number, firstLetter:boolean = false)
	{
		super(mainChar, mainCharCode);
		this.vowelChar = "";
		this.vowelNumber = 0;
		this.isHalfLetter = false;
		this.isFirstLetterOfWord = firstLetter;
		this.kind = unitType.maatraa;
		this.text = mainChar;
		this.rhythmPatternValue = -1;

		// space / comma
      	if ((mainCharCode == 32)||(mainCharCode == 44))
        	this.setVowel(mainChar);

		// whole vowel
		if ((mainCharCode >= 2309) && (mainCharCode <= 2324))
			this.setVowel(mainChar);

		if ((mainCharCode == 49)||(mainCharCode == 50)||(mainCharCode == 2407)||(mainCharCode == 2408))
      		this.setVowel(mainChar);

		// consonant OR consonant with dot at bottom
		if (((mainCharCode >= 2325) && (mainCharCode <= 2361)) || ((mainCharCode >= 2392) && (mainCharCode <= 2399)))
			this.setVowel("अ");

		// chandrabindu
		if (mainCharCode == 2305)
			this.setVowel("ँ");

		// anusvaar (the bindi on top) which sometimes is short-cut for half letter
		if (mainCharCode == 2306) 
			this.setVowel("्");
	}
	setVowel(vowelChar:string, isNew = false) {
		if (isNew)
		{
			this.chars[this.chars.length] = new cChar(vowelChar, vowelChar.charCodeAt(0));
			this.text += vowelChar;
		}
		this.vowelChar = vowelChar;
		// set Vowel Number
		switch(vowelChar)
		{
			case "्":
				this.vowelNumber = -1;
				this.isHalfLetter = true;
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
			case "ऑ": case "ॉ":
				this.vowelNumber = 11;
				break;
			case "ऋ": case "ृ":
				this.vowelNumber = 12;
				break;
			case "1": case "१":
				this.vowelNumber = 21;
				break;
			case "2": case "२":
				this.vowelNumber = 22;
				break;
			default:
				this.vowelNumber = -10;
		}
		// set char maatraa as per vowel
		switch (this.vowelNumber)
    	{
			case 1: case 3: case 5: case 12: case 21:
				this.systemRhythmAmt = 1;
				break;
		    case 2: case 4: case 6: case 8: case 10: case 7: case 9: case 10: case 11: case 22:
				this.systemRhythmAmt = 2;
				break;
			default:
				this.systemRhythmAmt = 0;
				break;
		}
		this.rhythmAmtCumulative = this.rhythmAmt = this.systemRhythmAmt;
  	}
  	replaceFirstChar(newMainChar: string)
	{
		if (newMainChar == '़')	// nuqta
		{
			switch(this.chars[0].char)
			{
				case 'क':
					super.replaceFirstChar('क़',2392);
					break;
				case 'ख':
					super.replaceFirstChar('ख़',2393);
					break;
				case 'ग':
					super.replaceFirstChar('ग़',2394);
					break;
				case 'ज':
					super.replaceFirstChar('ज़',2395);
					break;
				case 'ड':
					super.replaceFirstChar('ड़',2396);
					break;
				case 'ढ':
					super.replaceFirstChar('ढ़',2397);
					break;
				case 'फ':
					super.replaceFirstChar('फ़',2398);
					break;
			}
		}
	}
	calculateHalfLetterMaatraa(p?:cMaatraaUnit, n?:cMaatraaUnit) : number
	{
		// debugger;
		if (this.isFirstLetterOfWord && this.isHalfLetter)
			return 0;

		if (typeof n !== 'undefined')
		{
			if ((this.chars[0].char == "म") && (n.chars[0].char == "ह"))
				return 0;
			if ((this.chars[0].char == "न") && (n.chars[0].char == "ह"))
				return 0;
		}

		if (p.systemRhythmAmt == 1 && (!p.isHalfLetter))
		{
			this.rhythmAmt = this.systemRhythmAmt = 1;
			return 1;
		}

		if (typeof n !== 'undefined')
		{
			if ((p.systemRhythmAmt == 2) && (n.systemRhythmAmt == 2))
			{
				this.rhythmAmt = this.systemRhythmAmt = 1;
				return 1;
			}
		}

		return 0;
	}
	mainChar() { return this.chars[0].char; }
}

class cGhazalUnit extends cMaatraaUnit {
	isRadeef : boolean = false;
	isKaafiyaa : boolean = false;
}

class cLine extends cRhythmUnit {
	constructor(subUnits:cRhythmUnit[], lineText: string)
	{
		super(subUnits, lineText, unitType.line);
	}
}

class cMaatraaLine extends cLine {
	subUnits : cMaatraaUnit[];
	calculateHalfLetterMaatraa()
	{
		for (let i = 0; i < this.subUnits.length; i++)
		{
			if (this.subUnits[i].isHalfLetter)
			{
				let result = 0;
				if (i==0)
					result = this.subUnits[i].calculateHalfLetterMaatraa();
				else if (i == (this.subUnits.length - 1))
					result = this.subUnits[i].calculateHalfLetterMaatraa(this.subUnits[i-1]);
				else
					result = this.subUnits[i].calculateHalfLetterMaatraa(this.subUnits[i-1], this.subUnits[i+1]);
				this.rhythmAmtCumulative += result;
			}
		}
	}
	adjustUnitRhythm(iUnit:number, pattern)
	{
		let unit = this.subUnits[iUnit];
		let newRhythmAmt = 0;
		if (unit.isHalfLetter)
		{
			newRhythmAmt = (unit.rhythmAmt == 1) ? 0 : 1;
		}
		else
		{
			newRhythmAmt = (unit.rhythmAmt == 1) ? 2 : 1;
		}
		let diff = newRhythmAmt - unit.rhythmAmt;
		this.subUnits[iUnit].rhythmAmt = newRhythmAmt;
		this.rhythmAmtCumulative += diff;

		this.clearPattern();
		this.matchRhythmPattern(pattern);
	}
	clearPattern()
	{
		let i = 0;
		for (i = 0; i < this.subUnits.length; i++)
		{
			this.subUnits[i].rhythmPatternValue = -1; // default value
		}
	}
	matchRhythmPattern(pattern = [])
	{
		//debugger;
		let i = 0;
		let pi = 0; // pattern index
		let withPattern = false;
		if (pattern.length > 0)
		{
			withPattern = true;
		}
		let currentC;
		let currentPattern;
		let subUnitsCount = this.subUnits.length;
		for (i = 0; i < subUnitsCount; i++)
		{
			currentC = this.subUnits[i];
			currentPattern = pattern[pi];

			if (currentC.isHindi)
			{
				// debugger;
				if (currentC.rhythmPatternValue != 1.5)
					currentC.rhythmPatternValue = currentC.rhythmAmt;

				// increment pattern index if currentC was deergh
				if (withPattern && (currentC.rhythmPatternValue == 2)) 
				{
					pi++;
					continue;
				}

				if ((currentC.mainChar == "1") || (currentC.mainChar == "१"))
				{
					pi++;
					continue;
				}
				if ((i < subUnitsCount - 1) && (currentC.rhythmAmt == 1) && (currentC.rhythmPatternValue != 1.5))
				{
					let nextChar = currentC;
					let nextCharFound = false;
					let j = i;
					while (!nextCharFound)
					{
						j++;
						nextChar = this.subUnits[j];
						if (typeof nextChar === 'undefined') // no more chars
							break;

						if (nextChar.rhythmAmt > 0)
							nextCharFound = true;
					}
					if ((nextChar.rhythmAmt == 1) && (currentC.rhythmAmt == 1))
					{
						if (!withPattern) // do defaut processing
						{
							nextChar.rhythmPatternValue = 1.5;
							currentC.rhythmPatternValue = 1.5;
						}
						else // with pattern so also take pattern into consideration
						{
							if (pattern[pi] == 1)
								pi++;
							else
							{
								nextChar.rhythmPatternValue = 1.5;
								currentC.rhythmPatternValue = 1.5;
								pi++;
							}
						}
					}
					else 
					{
						pi++;
					}
				}
				else if (currentC.rhythmPatternValue == 1)
				{
					pi++;
				}
			}
			else
			{
				if (withPattern && (currentPattern == 0))
				{
					currentC.rhythmPatternValue = 0;
					pi++;
				}
			}
		}
	}
}

// ghazal line
class cMisraa extends cMaatraaLine {
	subUnits : cGhazalUnit[];
}

class cPoem {
	lines : cLine[];
	maxLineLen : number;
	firstLinePattern : boolean;
	rhythmPattern;
	constructor()
	{
		this.lines = [];
		this.maxLineLen = 0;
		this.firstLinePattern = false;
		this.rhythmPattern = [];
	}
	addLine(line : cRhythmUnit)
	{
		this.lines[this.lines.length] = line;
		if (this.maxLineLen < line.rhythmAmtCumulative)
			this.maxLineLen = line.rhythmAmtCumulative;

		if (this.lines.length == 1)
		{
			this.isFirstLinePattern();
			if (this.firstLinePattern)
				this.setRhythmPattern();
		}
	}
	adjustUnitRhythm(iLine, iUnit)
	{
		if ((iLine == 0) && this.firstLinePattern) return;
		this.lines[iLine].adjustUnitRhythm(iUnit, this.rhythmPattern)
		if (this.lines[iLine].rhythmAmtCumulative > this.maxLineLen)
			this.maxLineLen = this.lines[iLine].rhythmAmtCumulative;
	}
	isFirstLinePattern()
	{
		if (this.lines.length < 1) return;
		let line1 = this.lines[0];
		let pattern = /^[12१२\s]+$/;
		this.firstLinePattern = pattern.test(line1.text);
	}
	setRhythmPattern()
	{
		let lineMaapnee = this.lines[0];
		let i = 0;
		for (i=0;i<lineMaapnee.subUnits.length;i++)
		{
			if ((lineMaapnee.subUnits[i].systemRhythmAmt == 1) || (lineMaapnee.subUnits[i].systemRhythmAmt == 2))
			{
				this.rhythmPattern[this.rhythmPattern.length] = lineMaapnee.subUnits[i].systemRhythmAmt;
			}
			else
			{
				this.rhythmPattern[this.rhythmPattern.length] = 0;
				this.lines[0].subUnits[i].setRhythmPatternVal(0);
			}
		}
	}
}

class cGhazal extends cPoem {
	lines : cMisraa[];
	radeefTruncated = 0;
	radeefArray = [];
	calculateRadeef()
	{
	    let radeef = '';
	    this.radeefArray = [];

	    let radeef1, radeef2;
	    let linelen1 = this.lines[0].subUnits.length;
	    let linelen2 = this.lines[1].subUnits.length;

	    let foundRadeefEnd = false;
	    let i = linelen1 - 1; // first line index
	    let j = linelen2 - 1; // second line index

	    // debugger;

	    while ((!foundRadeefEnd) && (i >= 0) && (j >= 0))
	    {
	      radeef1 = this.lines[0].subUnits[i].text;
	      radeef2 = this.lines[1].subUnits[j].text;

	      if (radeef1 == radeef2)
	      {
	        radeef = radeef1 + radeef;
	        this.radeefArray[this.radeefArray.length] = [];
	        this.radeefArray[this.radeefArray.length - 1][0] = this.lines[0].subUnits[i].mainChar();
	        this.radeefArray[this.radeefArray.length - 1][1] = this.lines[0].subUnits[i].vowelChar;
	        i--;
	        j--;
	      }
	      else
	      {
	        foundRadeefEnd = true;
	      }
	    }

	    // cut out the last part of calculated radeef if it has a space and an incomplete word.
	    // eg. for 
	    // कोई उम्मीद बर नहीं आती
	    // कोई सूरत नज़र नहीं आती
	    // sys will calculate radeef as as "र नहीं आती" because that is common between top and bottom line
	    // but radeef is "नहीं आती"
	    let realRadeef = radeef.substr(radeef.indexOf(' ')+1);

	    // truncate radeefArray too
	    // if clause implies a truncation did occur in the above substr code, and hence array has to be truncated 
	    if (radeef !== realRadeef) 
	    {
	      this.radeefTruncated = 1;
	      let i;
	      for (i = this.radeefArray.length - 1; i >= 0 ; i--) 
	      {
	        if (this.radeefArray[i][0] == " ") break;
	      }
	      this.radeefArray.length = i;
	      radeef = realRadeef;
	    }
	    // the characters in this radeefArray is in reverse order
	    let radeefLen = this.radeefArray.length;
	    // now mark radeef chars in all relevant lines
	    for (i = 0; i < this.lines.length; i++) {
	      let supposedlyRelevantLine = false;
	      // first 2 lines
	      if (i<=1) supposedlyRelevantLine = true;
	      // intermediate line followed by blank line
	      if ((i>1) && (i<(this.lines.length-1)) && (this.lines[i+1].subUnits.length==0)) supposedlyRelevantLine = true;
	      // last line
	      if (i==(this.lines.length-1)) supposedlyRelevantLine = true;
	      let linelen = this.lines[i].subUnits.length;
	      if ((supposedlyRelevantLine) && (linelen > radeefLen))
	      {
	        for (let j = 0; j < radeefLen; j++) {
	          if ((this.radeefArray[j][0] == this.lines[i].subUnits[linelen-1-j].mainChar()) && (this.radeefArray[j][1] == this.lines[i].subUnits[linelen-1-j].vowelChar))
	            this.lines[i].subUnits[linelen-1-j].isRadeef = true;
	          else
	            break;
	        }
	      }
	    }
	}
	// Function: calculateKaafiyaa
	calculateKaafiyaa()
	{
		// debugger;
		let radeefLen = this.radeefArray.length;
		let foundKaafiyaaEnd = false;
		let kaafiyaa,kaafiyaa1, kaafiyaa2;
		let kaafiyaaArray = [];
		let linelen1 = this.lines[0].subUnits.length;
		let linelen2 = this.lines[1].subUnits.length;
		let i = linelen1 - 1 - radeefLen; // first line index
		let j = linelen2 - 1 - radeefLen; // second line index

		while ((!foundKaafiyaaEnd) && (i >= 0) && (j >= 0))
		{
		  kaafiyaa1 = this.lines[0].subUnits[i].vowelNumber;
		  kaafiyaa2 = this.lines[1].subUnits[j].vowelNumber;
		  if (kaafiyaa1 == kaafiyaa2)
		  {
		    kaafiyaa = kaafiyaa1 + kaafiyaa;
		    kaafiyaaArray[kaafiyaaArray.length] = kaafiyaa1;
		    i--;
		    j--;
		  }
		  else
		  {
		    foundKaafiyaaEnd = true;
		  }
		}
		if (kaafiyaaArray[0]==-10) // space character kaa vowelNumber
		  kaafiyaaArray.splice(0,1);
		// console.log(kaafiyaaArray);

		let kaafiyaaLen = kaafiyaaArray.length;

		// now mark kaafiyaa chars in all relevant lines
		for (i = 0; i < this.lines.length; i++) {
		  let supposedlyRelevantLine = false;
		  // first 2 lines
		  if (i<=1) supposedlyRelevantLine = true;
		  // intermediate line followed by blank line
		  if ((i>1) && (i<(this.lines.length-1)) && (this.lines[i+1].subUnits.length==0)) supposedlyRelevantLine = true;
	      // last line
	      if (i==(this.lines.length-1)) supposedlyRelevantLine = true;
		  let linelen = this.lines[i].subUnits.length;
		  if ((supposedlyRelevantLine) && (linelen > (radeefLen+kaafiyaaLen+this.radeefTruncated)))
		  {
		    for (j = 0; j < kaafiyaaLen; j++) {
		      if (kaafiyaaArray[j] == this.lines[i].subUnits[linelen-1-radeefLen-this.radeefTruncated-j].vowelNumber)
		        this.lines[i].subUnits[linelen-1-radeefLen-this.radeefTruncated-j].isKaafiyaa = true;
		      else
		        break;
		    }
		  }
		}
	}
}

function initUnit(char, charCode, firstLetter = true, type : poemType = poemType.generic) : any
{
	if (type == poemType.ghazal)
		return new cGhazalUnit(char, charCode, firstLetter);
	else
		return new cMaatraaUnit(char,charCode,firstLetter);
}

function initLine(subUnits,lineText,type : poemType = poemType.generic) : any
{
	if (type == poemType.ghazal)
		return new cMisraa(subUnits,lineText);
	else
		return new cMaatraaLine(subUnits, lineText);
}

function processPoem(poem:string,thisPoemType:poemType = poemType.generic) : cPoem
{
	let lines = poem.split("\n");
	let oPoem;
	if (thisPoemType == poemType.ghazal) oPoem = new cGhazal();
	else oPoem = new cPoem();
	let maxLineLen = 0;
    for (let iLine = 0; iLine < lines.length; iLine++) // process each line - i = line index
    {
    	let lineLen = 0;
    	lines[iLine] = lines[iLine].replace(/[^\u0900-\u097F 12]/g, " ");
    	lines[iLine] = lines[iLine].replace("।"," ");
    	lines[iLine] = lines[iLine].replace(/\s+/g, " "); // remove extra spaces in-between words
    	lines[iLine] = lines[iLine].trim(); // remove whitespace from both ends

    	let words = lines[iLine].split(" ");
		let i = 0;
		let units = [];
		// debugger;
		for (let wc = 0; wc < words.length; wc++)
		{
			if (wc > 0)
			{
				units[i] = initUnit(' ',32,true,thisPoemType);
				i++;
			}
			for (let k = 0; k < words[wc].length; k++)
			{
				let charCode = words[wc].charCodeAt(k);
		    	let thisChar = words[wc][k];
		    	if (charCode == 2364) // nuqta
		    	{
		    		units[i-1].replaceFirstChar(thisChar);
		    	}
				else if ((charCode >= 2366) && (charCode <= 2381)) // maatraa
				{
					// new element not added to line array
					// the vowel part of previous element 
					// modified to update maatraa
					// NOTE: This also includes the halant character
					let earlierCharLen = units[i-1].rhythmAmt;
					units[i-1].setVowel(thisChar, true);
					if (earlierCharLen !== units[i-1].rhythmAmt)
					{
						let diff = units[i-1].rhythmAmt - earlierCharLen;
						lineLen += diff;
					}
				}
				else // not maatraa - true new char
				{
					if (k == 0)
						units[i] = initUnit(thisChar,charCode,true,thisPoemType);
					else
						units[i] = initUnit(thisChar,charCode,false,thisPoemType);
					lineLen += units[i].rhythmAmt;
					i++;
				}
			}
		}
		let processedLine = initLine(units, lines[iLine]);
		processedLine.rhythmAmtCumulative = lineLen;
		processedLine.calculateHalfLetterMaatraa();
		if (thisPoemType == poemType.generic) processedLine.matchRhythmPattern(oPoem.rhythmPattern);
		oPoem.addLine(processedLine);
	}
	if (thisPoemType == poemType.ghazal)
	{
		oPoem.calculateRadeef();
		oPoem.calculateKaafiyaa();
	}
	console.log(oPoem);
	return oPoem;	
}


