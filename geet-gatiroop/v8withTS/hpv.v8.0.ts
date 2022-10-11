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

class cRhythmUnit {
	chars : cChar[];
	subUnits : cRhythmUnit[];
	kind : unitType;
	index : number;
	rhythmAmt : number;
	systemRhythmAmt : number; 
	rhythmAmtCumulative : number;

	constructor(mainChar: string, mainCharCode: number); 
	constructor(subUnits:cRhythmUnit[], unitType:unitType );
	constructor(...argsArray : any[])
	{
		this.chars = [];
		this.subUnits = [];
		this.kind = unitType.unknown;
		this.index = 0;
		this.rhythmAmt = 0;
		this.systemRhythmAmt = 0;
		this.rhythmAmtCumulative = 0;
		if ((typeof argsArray[0] === 'string') && (typeof argsArray[1] === 'number'))
		{
			let mainChar = argsArray[0];
			let mainCharCode = argsArray[1];
			this.chars[0] = new cChar(mainChar, mainCharCode);
		}
		else if ((argsArray.length == 2) && Array.isArray(argsArray[0]))
		{
			this.subUnits = argsArray[0];
			let unitType = argsArray[1];
			this.kind = unitType;
			for (let i = 0; i < this.subUnits.length; i++)
				this.rhythmAmtCumulative += this.subUnits[i].rhythmAmtCumulative;
		}
	}
	replaceFirstChar(newMainChar: string, newMainCharCode: number)
	{
		this.chars[0].char = newMainChar;
		this.chars[0].charCode = newMainCharCode;
	}
}

class cMaatraaUnit extends cRhythmUnit {
	vowelChar : string;
	vowelNumber : number;
	constructor(mainChar: string, mainCharCode: number)
	{
		super(mainChar, mainCharCode);
		this.vowelChar = "";
		this.vowelNumber = 0;
		this.kind = unitType.maatraa;

		// space / comma
      	if ((mainCharCode == 32)||(mainCharCode == 44))
        	this.setVowel(mainChar);

		// whole vowel
		if ((mainCharCode >= 2309) && (mainCharCode <= 2324))
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
		}
		this.vowelChar = vowelChar;
		// set Vowel Number
		switch(vowelChar)
		{
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
}
