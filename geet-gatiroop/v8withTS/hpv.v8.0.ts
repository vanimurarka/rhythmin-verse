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
	line = "line",
	varna = "varna"
}

enum poemType {
	generic = 0,
	ghazal = 1,
	freeverse = 2,
	vaarnik = 3
}

enum ganType {
	y = "122",
	m = "222",
	t = "221",
	r = "212",
	j = "121",
	b = "211",
	n = "111",
	s = "112",
	l = "1",
	g = "2",
	o = ""
}

class cRhythmUnit {
	chars : cChar[]; 	isHindi : boolean;	subUnits : cRhythmUnit[];	kind : unitType;	index : number;	rhythmAmt : number;	systemRhythmAmt : number; 	rhythmAmtCumulative : number;	rhythmPatternValue: number;	text : string;
	vowelChar : string; 	vowelNumber : number;	isHalfLetter : boolean;	isFirstLetterOfWord : boolean;
	constructor(mainChar: string, mainCharCode: number, firstLetter:boolean = false)
	{
		this.chars = [];
		this.subUnits = [];
		this.kind = unitType.unknown;
		this.index = 0;
		this.rhythmAmt = 0;
		this.systemRhythmAmt = 0;
		this.rhythmAmtCumulative = 0;

		this.chars[0] = new cChar(mainChar, mainCharCode);
		this.isHindi = this.chars[0].isHindi;
		this.vowelChar = "";
		this.vowelNumber = 0;
		this.isHalfLetter = false;
		this.isFirstLetterOfWord = firstLetter;

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
	_replaceFirstChar(newMainChar: string, newMainCharCode: number)
	{
		this.chars[0].char = newMainChar;
		this.chars[0].charCode = newMainCharCode;
	}
	replaceFirstChar(newMainChar: string, newMainCharCode: number)
	{
		if (newMainChar == '़')	// nuqta
		{
			switch(this.chars[0].char)
			{
				case 'क':
					this._replaceFirstChar('क़',2392);
					break;
				case 'ख':
					this._replaceFirstChar('ख़',2393);
					break;
				case 'ग':
					this._replaceFirstChar('ग़',2394);
					break;
				case 'ज':
					this._replaceFirstChar('ज़',2395);
					break;
				case 'ड':
					this._replaceFirstChar('ड़',2396);
					break;
				case 'ढ':
					this._replaceFirstChar('ढ़',2397);
					break;
				case 'फ':
					this._replaceFirstChar('फ़',2398);
					break;
			}
		}
	}
	setRhythmPatternVal(patternVal:number) {this.rhythmPatternValue = patternVal;}
	mainChar() { return this.chars[0].char; }
}

class cMaatraaUnit extends cRhythmUnit {
	
	constructor(mainChar: string, mainCharCode: number, firstLetter:boolean = false)
	{
		super(mainChar, mainCharCode, firstLetter);
		this.kind = unitType.maatraa;
	}
	calculateHalfLetterRhythmAmt(p?:cMaatraaUnit, n?:cMaatraaUnit) : number
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
	
}

class cVarna extends cRhythmUnit {
	belongsToGan : ganType;
	constructor(mainChar: string, mainCharCode: number, firstLetter:boolean = false)
	{
		super(mainChar, mainCharCode, firstLetter);
		this.kind = unitType.varna;
		this.belongsToGan = ganType.o;
	}
	calculateHalfLetterRhythmAmt(p?:cVarna, n?:cVarna) : number
	{
		if (this.isFirstLetterOfWord && this.isHalfLetter)
			return 0;

		if (typeof n !== 'undefined')
		{
			if ((this.chars[0].char == "म") && (n.chars[0].char == "ह"))
				return 0;
			if ((this.chars[0].char == "न") && (n.chars[0].char == "ह"))
				return 0;
		}

		if ((p.systemRhythmAmt == 1) && (!p.isHalfLetter))
		{
			this.rhythmAmt = this.systemRhythmAmt = 1;
			return 1;
		}

		if (typeof n !== 'undefined')
		{
			if ((p.systemRhythmAmt == 2) && (n.systemRhythmAmt == 2))
			{
				this.rhythmAmtCumulative = this.rhythmAmt = this.systemRhythmAmt = 1;
				return 1;
			}
		}

		return 0;
	}
	setGan(sig : string)
	{
		switch (sig)
		{
			case ganType.y:
				this.belongsToGan = ganType.y;
				break;
			case ganType.m:
				this.belongsToGan = ganType.m;
				break;
			case ganType.t:
				this.belongsToGan = ganType.t;
				break;
			case ganType.r:
				this.belongsToGan = ganType.r;
				break;
			case ganType.j:
				this.belongsToGan = ganType.j;
				break;
			case ganType.b:
				this.belongsToGan = ganType.b;
				break;
			case ganType.n:
				this.belongsToGan = ganType.n;
				break;
			case ganType.s:
				this.belongsToGan = ganType.s;
				break;
			case ganType.l:
				this.belongsToGan = ganType.l;
				break;
			case ganType.g:
				this.belongsToGan = ganType.g;
				break;
			default:
				this.belongsToGan = ganType.o;
				break;
		}
	}
}

class cGhazalUnit extends cMaatraaUnit {
	isRadeef : boolean = false;
	isKaafiyaa : boolean = false;
}

class cLine {
	subUnits : cRhythmUnit[];	kind : unitType; rhythmAmtCumulative : number; text : string;
	constructor(subUnits:cRhythmUnit[], lineText: string)
	{
		this.subUnits = subUnits;
		this.text = lineText;
		this.kind = unitType.line;
	}
	adjustUnitRhythm(iUnit:number,pattern) { }	
}

class cMaatraaLine extends cLine {
	subUnits : cMaatraaUnit[];
	calculateHalfLetterRhythmAmt()
	{
		for (let i = 0; i < this.subUnits.length; i++)
		{
			if (this.subUnits[i].isHalfLetter)
			{
				let result = 0;
				if (i==0)
					result = this.subUnits[i].calculateHalfLetterRhythmAmt();
				else if (i == (this.subUnits.length - 1))
					result = this.subUnits[i].calculateHalfLetterRhythmAmt(this.subUnits[i-1]);
				else
					result = this.subUnits[i].calculateHalfLetterRhythmAmt(this.subUnits[i-1], this.subUnits[i+1]);
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

class cVaarnikLine extends cLine {
	subUnits : cVarna[];
	_findNextRealVarna(i : number = 0) : number
	{
		// debugger;
		while ((i >= 0) && (i < this.subUnits.length))
		{
			if (this.subUnits[i].rhythmAmtCumulative > 0)
			{
				return i;
			}
			else 
			{
				i++;
				while ((i < this.subUnits.length) && (this.subUnits[i].rhythmAmtCumulative == 0))
					i++;

				if (i < this.subUnits.length) return i; else return -1;
			}
		}
		return -1;
	} 
	_setGan()
	{
		let i = 0;
		let ganSig = "";
		let ganIs : number[];
		// debugger;
		while ((i >= 0) && (i < this.subUnits.length))
		{
			ganSig = "";
			ganIs = [];
			i = this._findNextRealVarna(i);
			if (i >= 0)
			{
				ganSig += this.subUnits[i].rhythmAmtCumulative;
				ganIs[ganIs.length] = i;
				i++;
			}
			i = this._findNextRealVarna(i);
			if (i >= 0)
			{
				ganSig += this.subUnits[i].rhythmAmtCumulative;
				ganIs[ganIs.length] = i;
				i++;
			}
			i = this._findNextRealVarna(i);
			if (i >= 0)
			{
				ganSig += this.subUnits[i].rhythmAmtCumulative;
				ganIs[ganIs.length] = i;
				i++;
			}
			if (ganSig.length == 3)
			{
				this.subUnits[ganIs[0]].setGan(ganSig);
				this.subUnits[ganIs[1]].setGan(ganSig);
				this.subUnits[ganIs[2]].setGan(ganSig);
			}
			else if (ganSig.length > 0)
			{
				for (let j = 0; j < ganIs.length; j++)
				{
					let individualGan = this.subUnits[ganIs[j]].rhythmAmtCumulative.toString();
					this.subUnits[ganIs[j]].setGan(individualGan);
				}
			}			
		}
	}
	_mergeSubUnit(c:cVarna, p:cVarna) : cVarna
	{
		// console.log(c);
		// console.log(p);
		let newVarna = new cVarna(p.mainChar(),p.chars[0].charCode,p.isFirstLetterOfWord);
		newVarna.chars = p.chars;
		newVarna.chars = newVarna.chars.concat(c.chars);
		newVarna.text = p.text + c.text;
		newVarna.rhythmAmt = p.rhythmAmt + c.rhythmAmt;
		newVarna.systemRhythmAmt = p.systemRhythmAmt + c.systemRhythmAmt;
		newVarna.rhythmAmtCumulative = p.rhythmAmtCumulative + c.rhythmAmt;
		newVarna.vowelChar = p.vowelChar;
		newVarna.vowelNumber = p.vowelNumber;
		// console.log(newVarna);

		return newVarna;

	}
	calculateHalfLetterRhythm()
	{
		debugger;
		for (let i = 0; i < this.subUnits.length; i++)
		{
			if (this.subUnits[i].isHalfLetter)
			{
				let result = 0;
				if (i==0)
					result = this.subUnits[i].calculateHalfLetterRhythmAmt();
				else if (i == (this.subUnits.length - 1))
					result = this.subUnits[i].calculateHalfLetterRhythmAmt(this.subUnits[i-1]);
				else
					result = this.subUnits[i].calculateHalfLetterRhythmAmt(this.subUnits[i-1], this.subUnits[i+1]);

				this.rhythmAmtCumulative = this.rhythmAmtCumulative + result;
			}
		}
		let tempUnits : cVarna[] = [];
		let j : number = 0;
		
		for (let i = 0; i < this.subUnits.length; i++)
		{
			if (this.subUnits[i].isHalfLetter)
			{
				if (this.subUnits[i].rhythmAmt == 1)
				{
					if (this.subUnits[i-1].rhythmAmt == 1)
					{
						tempUnits[j-1] = this._mergeSubUnit(this.subUnits[i],this.subUnits[i-1]);
						// j++;
					}
					else
					{
						tempUnits[j] = this.subUnits[i];
						j++;
					}
				}
			}
			else 
			{
				tempUnits[j] = this.subUnits[i];
				j++;
			}
		}
		this.subUnits = [];
		this.subUnits = tempUnits;
	}
	setGan()
	{
		console.log(this);
		this.calculateHalfLetterRhythm();
		// console.log(this);
		this._setGan();
		// console.log(this);
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
						if (withPattern)
							pi++;
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

class cFreeVerseLine extends cMaatraaLine {
	isComposite :boolean = false;
}

class cPoem {
	lines : cLine[];
	maxLineLen : number;
	firstLinePattern : boolean;
	rhythmPattern;
	type : poemType;
	constructor()
	{
		this.lines = [];
		this.maxLineLen = 0;
		this.firstLinePattern = false;
		this.rhythmPattern = [];
		this.type = poemType.generic;
	}
	giveNewUnit(char, charCode, firstLetter = true) : cMaatraaUnit
	{
		return new cMaatraaUnit(char,charCode,firstLetter);
	}
	giveNewLine(subUnits,lineText) : any
	{
		return new cMaatraaLine(subUnits, lineText);	
	}
	addLine(line : cLine)
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
	constructor()
	{
		super();
		this.type = poemType.ghazal;
	}
	giveNewUnit(char, charCode, firstLetter = true) : cGhazalUnit
	{
		return new cGhazalUnit(char,charCode,firstLetter);
	}
	giveNewLine(subUnits,lineText)
	{
		return new cMisraa(subUnits, lineText);	
	}
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

class cCompositeLine
{
	originalLineIdx : number;
	rhythmAmtCumulative : number;
	remainder : number;
	multipleOfBaseCount : boolean;
	constructor(originalLineIdx) {
		this.originalLineIdx = originalLineIdx;
		this.rhythmAmtCumulative = 0;
		this.remainder = 0;
		this.multipleOfBaseCount = true;
	}
}

class cFreeVerse extends cPoem {
	lines : cFreeVerseLine[];
	compositeLines : cCompositeLine[];
	baseCount : number;
	constructor()
	{
		super();
		this.type = poemType.freeverse;
		this.compositeLines = [];
		this.baseCount = 1;
	}
	giveNewLine(subUnits,lineText)
	{
		return new cFreeVerseLine(subUnits, lineText);	
	}
	setComposite(lineIdx)
	{
		this.lines[lineIdx].isComposite = !this.lines[lineIdx].isComposite;
		this.calculateCompositeRhythmAmt();
	}
	calculateCompositeRhythmAmt()
	{
		let compositeInProgress = false;
		// reset composite lines array
		this.compositeLines.length = 0;
		if (this.lines.length > 1)
		{
			let i = 0;
			for (i = 1; i < this.lines.length; i++)
			{
			if (this.lines[i].isComposite)  // is part of composite line
				{
					// debugger;
					let len = this.compositeLines.length;
					if (!compositeInProgress) // new composite line
					{
						compositeInProgress = true;
						this.compositeLines[len] = new cCompositeLine(i-1); // starting position in poem lines, line index is the *previous*
						this.compositeLines[len].rhythmAmtCumulative = this.lines[i-1].rhythmAmtCumulative;  // total maatraa count of prev (starting) line
						this.compositeLines[len].rhythmAmtCumulative += this.lines[i].rhythmAmtCumulative; // add total maatraa count of current line
					}
					else // in progress composite line
					{
						// just add to in progress composite line
						this.compositeLines[len-1].rhythmAmtCumulative += this.lines[i].rhythmAmtCumulative;
					}
					len = this.compositeLines.length;
					// set whether the composite maatraa is multiple of base count
					if ((this.compositeLines[len-1].rhythmAmtCumulative % this.baseCount) == 0)
					  this.compositeLines[len-1].multipleOfBaseCount = true;
					else
					  this.compositeLines[len-1].multipleOfBaseCount = false;
				}
				else  // not part of composite line
				{
				  if (compositeInProgress)
				  {
				    // stop in progress
				    compositeInProgress = false;
				  }
				}
			}
		}
		let i;
		for (i = 0; i< this.compositeLines.length; i++)
			this.calculateRemainder(i);
	}
	calculateRemainder(compositeIdx)
	{
		if (this.baseCount > 1)
		{
			let compositeMaatraa = this.compositeLines[compositeIdx].rhythmAmtCumulative;
			let remainder = compositeMaatraa % this.baseCount;
			if (remainder != 0)
			{
				let result = compositeMaatraa/this.baseCount;
				let whole = Math.trunc(result);
				let remainderInDecimal = result - whole;
				if (remainderInDecimal <= 0.5)
					this.compositeLines[compositeIdx].remainder = remainder;
				else
					this.compositeLines[compositeIdx].remainder = (((whole+1)*this.baseCount)-compositeMaatraa)*-1;
			}
		}
		else
			this.compositeLines[compositeIdx].remainder = 0;
	}
	setBaseCount(baseCount)
	{
		this.baseCount = baseCount;
		this.calculateCompositeRhythmAmt();
	}
}

class cVaarnikPoem extends cPoem {
	lines : cVaarnikLine[];
	giveNewUnit(char, charCode, firstLetter = true) : cVarna
	{
		return new cVarna(char,charCode,firstLetter);
	}
	giveNewLine(subUnits,lineText) : cVaarnikLine
	{
		return new cVaarnikLine(subUnits, lineText);	
	}
}

function initPoem(type : poemType = poemType.generic) : any
{
	switch (type)
	{
		case poemType.ghazal:
			return new cGhazal();
		case poemType.freeverse:
			return new cFreeVerse();
		case poemType.vaarnik:
			return new cVaarnikPoem();
		default:
			return new cPoem();
	}
}

let oPoem;
let oPrevPoem;

function processPoem(poem:string,thisPoemType:poemType = poemType.generic) : cPoem
{
	let lines = poem.split("\n");
	if (typeof oPoem === 'undefined')
		oPoem = initPoem(thisPoemType);
	else
	{
		oPrevPoem = oPoem;
		oPoem = initPoem(thisPoemType);
	}

	let maxLineLen = 0;
    for (let iLine = 0; iLine < lines.length; iLine++) // process each line - i = line index
    {
    	let lineLen = 0;
    	lines[iLine] = lines[iLine].replace(/[^\u0900-\u097F 12]/g, " ");
    	lines[iLine] = lines[iLine].replace("।"," ");
    	lines[iLine] = lines[iLine].replace(/\s+/g, " "); // remove extra spaces in-between words
    	lines[iLine] = lines[iLine].trim(); // remove whitespace from both ends

    	if ((typeof oPrevPoem !== 'undefined') && (iLine < oPrevPoem.lines.length) && (lines[iLine] == oPrevPoem.lines[iLine].text))
    	{ 
    		oPoem.addLine(oPrevPoem.lines[iLine]);
    		continue;
    	}

    	let words = lines[iLine].split(" ");
		let i = 0;
		let units = [];
		// debugger;
		for (let wc = 0; wc < words.length; wc++)
		{
			if (wc > 0)
			{
				units[i] = oPoem.giveNewUnit(' ',32,true);
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
						units[i] = oPoem.giveNewUnit(thisChar,charCode,true);
					else
						units[i] = oPoem.giveNewUnit(thisChar,charCode,false);
					lineLen += units[i].rhythmAmt;
					i++;
				}
			}
		}
		let processedLine = oPoem.giveNewLine(units, lines[iLine]);
		processedLine.rhythmAmtCumulative = lineLen;
		if (processedLine instanceof cMaatraaLine)
			processedLine.calculateHalfLetterRhythmAmt();
		if (processedLine instanceof cVaarnikLine)
			processedLine.setGan();
		if ((thisPoemType == poemType.vaarnik) && (oPoem.firstLinePattern))
			processedLine.matchRhythmPattern(oPoem.rhythmPattern);
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

