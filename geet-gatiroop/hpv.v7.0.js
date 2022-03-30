// adding support for 1, १, 2, २ for easy मापनी



class cChar {
    constructor(mainChar, mainCharCode) {
		this.mainChar = mainChar;
		this.mainCharCode = mainCharCode;
		this.vowelChar = "";
		this.vowelNumber = 0;
		this.index = 0;
		this.maatraa = 0;
		this.systemMaatraa = 0; // maatraa calculated by system. maybe diff from maatraa if user adjusts it
		this.maatraaCumulative = 0;
		this.isRadeef = false;
		this.isKaafiyaa = false;
		this.isHindi = false;
		this.rhymeLevel = 0; // 0 = no rhyme, 1 = vowel rhyme, 2 = full rhyme
		this.rhymeGroup = -1; // for coloring rhymed letters in diff colors based on diff rhyming lines
		console.log(mainChar + " " + mainCharCode);
		// space / comma
        if ((mainCharCode == 32)||(mainCharCode == 44))
          this.vowel = mainChar;

        // whole vowel
        if ((mainCharCode >= 2309) && (mainCharCode <= 2324))
        	this.vowel = mainChar;

        // "1" or "2" or "१" or "२"
        if ((mainCharCode == 49)||(mainCharCode == 50)||(mainCharCode == 2407)||(mainCharCode == 2408))
        	this.vowel = mainChar;
        
        // consonant OR consonant with dot at bottom
        if (((mainCharCode >= 2325) && (mainCharCode <= 2361)) || ((mainCharCode >= 2392) && (mainCharCode <= 2399)))
          this.vowel = "अ";

        // anusvaar (the bindi on top) which sometimes is short-cut for half letter
        if (mainCharCode == 2306) 
          this.vowel = "्";
    }
    replaceMainChar(newMainChar)
    {
    	if (newMainChar == '़')	// nuqta
    	{
    		switch(this.mainChar)
				{
					case 'क':
						this.mainChar = 'क़';
						this.mainCharCode = 2392;
						break;
					case 'ख':
						this.mainChar = 'ख़';
						this.mainCharCode = 2393;
						break;
					case 'ग':
						this.mainChar = 'ग़';
						this.mainCharCode = 2394;
						break;
					case 'ज':
						this.mainChar = 'ज़';
						this.mainCharCode = 2395;
						break;
					case 'ड':
						this.mainChar = 'ड़';
						this.mainCharCode = 2396;
						break;
					case 'ढ':
						this.mainChar = 'ढ़';
						this.mainCharCode = 2397;
						break;
					case 'फ':
						this.mainChar = 'फ़';
						this.mainCharCode = 2398;
						break;
				}
    	} 
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
					this.maatraa = 1;
					this.systemMaatraa = 1;
					this.isHindi = true;
					break;
	            case 2: case 4: case 6: case 8: case 10: case 7: case 9: case 10: case 11: case 22:
					this.maatraa = 2;
					this.systemMaatraa = 2;
					this.isHindi = true;
					break;
				default:
					this.maatraa = 0;
					this.systemMaatraa = 0;
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
    		case 1: case 3: case 5: case 12:
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
	// p = previous letter 
	// this = current letter for which the len is to be determined
	// n = next letter (consonant+vowel array structure)	
	calculateHalfLetterLen(p=false,n=false)
	{
		// all this.maatraa = 0 not really required because its already set to zero,
		// but it is there for code readability
		// to know clearly how the half letter maatraa is calculated 
		if (!p)  // no previous letter, half maatraa is first letter of line
		{
      		this.maatraa = 0;
      		this.systemMaatraa = 0;
      		return this.maatraa;
		}
      	if (p.vowelNumber === -10) // no previous letter, half maatraa is first letter of word
      	{
      		this.maatraa = 0;
      		this.systemMaatraa = 0;
      		return this.maatraa;
      	}

      	// special combinations ----------------
	    if ((this.mainChar == "म") && (n.mainChar == "ह"))
	    {
	      this.maatraa = 0;
	      this.systemMaatraa = 0;
	      return this.maatraa;
	    }
	    if ((this.mainChar == "न") && (n.mainChar == "ह"))
	    {
	      this.maatraa = 0;
	      this.systemMaatraa = 0;
	      return this.maatraa;
	    }
	  	// end special combinations ------------

	  	if (p.isLaghu())
	  	{
	  		this.maatraa = 1;
	  		this.systemMaatraa = 1;
	  		return this.maatraa;
	  	}
	  	if (n)
	  	{
	  		if (p.isDeergha() && n.isDeergha()) // both side deergha
		    {
		    	this.maatraa = 1;
		    	this.systemMaatraa = 1;
		      	return this.maatraa;
		    }
	  	}
	  	return 0;		  	
	}
	// when the user adjusts the maatraa by clicking on the char
	adjustCharMaatraa()
	{
		// whole chars
		//    aa, ee, oo                        all other deergha
		if ((this.vowelNumber%2 == 0) || ((this.vowelNumber>6) && (this.vowelNumber<12)))
		{
		  if (this.maatraa == 1)
		    this.maatraa = 2;
		  else
		    this.maatraa = 1;
		}
		if (this.vowelNumber == -1) // half maatraa
		{
			if (this.maatraa == 0)
				this.maatraa = 1;
			else
				this.maatraa = 0;
		}
	}
	// return full text mainchar + vowelchar
	get text()
	{
		let txt = "";
		if ((this.vowelNumber != -10) && (this.vowelNumber != 0))  // hindi character
		{
		  if (this.isPureVowel()||(this.vowelNumber == 1))
		  {
		    txt = this.mainChar;
		  }
		  else
		  {
		    txt = this.mainChar+this.vowelChar;
		  }
		}
		return txt;
	}
	// this is different from get text in that it returns all chars, even non-hindi ones
	get joinedConsonantVowel() 
	{
		if (this.mainChar==this.vowelChar)
		  return this.vowelChar; // c is also a vowel - like आ आ
		if (this.vowelChar == 'अ')
		  return this.mainChar; // could be a case of न अ 
		return this.mainChar+this.vowelChar;
	}
	compare(cin)
	{
		if (this.text == cin.text)
			return "all";
		if ((this.vowelNumber == cin.vowelNumber) && (this.mainChar != cin.mainChar) && (this.isHindi) && (cin.isHindi))
			return "vowel";
		else
			return false;
	}
}


class cLine {
	constructor() {
		this.characters = new Array();
		this.count = 0;
		this.maatraa = 0;
		this.isComposite = false;
		this.rhymeFound = false;
		this.rhymeGroup = 0;
		this.rhymeLength = 0;
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
	// change the last char consonant 
	// probably because it is a nuqta
	changeLastCharConsonant(consonantString)
	{
		const lastChar = this.characters[this.count-1];
		lastChar.replaceMainChar(consonantString);
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
	// get the nth character from end
	charByReverseIndex(idx)
	{
		idx = this.count-1-idx;
		if (idx > 0)
			return this.characters[idx];
		else
			return false;
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
	// get last Character
	getLastChar()
	{
		if (this.count == 0)
			return false;
		else
			return this.characters[this.count-1];
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
				const nextChar = this.nextChar(thisHalfLetter);
				maatraa = thisHalfLetter.calculateHalfLetterLen(previousChar, nextChar);
			}
			// update cumulative maatraa of line
			if (maatraa>0)
			{
				this.maatraa += maatraa;
				thisHalfLetter.maatraaCumulative += maatraa;
				let j;
				// update maatraaCumulative for all subsequent chars in line
				for (j = thisHalfLetter.index+1; j < this.count; j++)
					this.characters[j].maatraaCumulative++;
			}
		};
	}
	adjustCharMaatraa(charIdx)
	{
		let thisChar = this.charByIndex(charIdx);
		let oldMaatraa = thisChar.maatraa;
		thisChar.adjustCharMaatraa();
		let diff = thisChar.maatraa - oldMaatraa;
		this.maatraa += diff;
		let i;
		for (i = charIdx; i < this.count; i++)
			this.charByIndex(i).maatraaCumulative += diff;

		return this.maatraa;
	}
	doesItRhyme(compareLine, rg)
	{
		let i = 0;
		let j = 0; // counters
		let rhymeChars1 = [];
		let rhymeChars2 = [];
		let loop = true;
		// first check if last valid chars are truly equal or not
		while (loop) {
			let lc1, lc2; // last chars of respective lines
			lc1 = this.charByReverseIndex(i);
			if (!lc1)
				return false;
			if (!lc1.isHindi) {
				i++;
				continue;
			}
			lc2 = compareLine.charByReverseIndex(j);
			if (!lc2)
				return false;
			if (!lc2.isHindi) {
				j++;
				continue;
			}

			let result = lc1.compare(lc2);
			if (result == "all") {
				rhymeChars1[rhymeChars1.length] = [i, 2];
				rhymeChars2[rhymeChars2.length] = [j, 2];
				i++;
				j++;
				break;
			}
			else
				return false;
        }
		
		let fm = 1; // number of full matching characters
		let pm = 0; // number of vowel matching characters
		let c1, c2;

		// check for remaining characters
		while(loop)
		{
			c1 = this.charByReverseIndex(i);
			if (!c1)
				break;
			if (!c1.isHindi)
			{
				i++;
				continue;
			}
			c2 = compareLine.charByReverseIndex(j);
			if (!c2)
				break;
			if (!c2.isHindi)
			{
				j++;
				continue;
			}
			let result = c1.compare(c2); 
			// is the full character matching and no vowel-match found till now
			if ((result == 'all') && (pm == 0))
			{ 
				rhymeChars1[rhymeChars1.length] = [i, 2];
				rhymeChars2[rhymeChars2.length] = [j, 2];
				i++; j++; fm++; 					
			}
			else if (result == 'vowel')
			{
				rhymeChars1[rhymeChars1.length] = [i, 1];
				rhymeChars2[rhymeChars2.length] = [j, 1];
				i++; j++; pm++; 
			}
			else
			{
				break;
			}
		}
		if ((fm+pm) > 1)
		{
			//console.log(fm);
			//console.log(pm);
			// if these rhyming lines are longer than previous rhyme lengths
			// mark the rhyming characters in both lines
			// mark the last character
			let rhymeLength = fm + pm;
			if (rhymeLength > this.rhymeLength)
			{
				// mark remaining rhyming characters
				for (i = 0; i < rhymeChars1.length; i++) {
					// rhymeChars1[i][0] = whicheth char
					// rhymeChars1[i][1] = rhymeLevel
					let c1 = this.charByReverseIndex(rhymeChars1[i][0]);
					c1.rhymeLevel = rhymeChars1[i][1];
					c1.rhymeGroup = rg;
				}
			}
			if (rhymeLength > compareLine.rhymeLength) {
				// mark remaining rhyming characters
				for (i = 0; i < rhymeChars2.length; i++) {
					// rhymeChars1[i][0] = whicheth char
					// rhymeChars1[i][1] = rhymeLevel
					let c1 = compareLine.charByReverseIndex(rhymeChars2[i][0]);
					c1.rhymeLevel = rhymeChars2[i][1];
					c1.rhymeGroup = rg;
				}
			}
			return rhymeLength;
			
		}
		else
			return false;
	}
}

class compositeLine
{
	constructor(originalLineIdx) {
		this.originalLineIdx = originalLineIdx;
		this.maatraa = 0;
		this.remainder = 0;
	}
}

class cPoem {
	constructor(originalText) {
		this.originalText = originalText;
		this.lines = new Array();
		this.lineCount = 0;
		this.maxLineLen = 0;
		this.compositeLines = [];
		this.baseCount = 1;
		this.radeefTruncated = 0;
		this.radeefArray = [];
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
	adjustCharMaatraa(lineIdx, charIdx)
	{
		let newMaatraaOfLine = this.lines[lineIdx].adjustCharMaatraa(charIdx);
		if (this.maxLineLen < newMaatraaOfLine)
			this.maxLineLen = newMaatraaOfLine;
	}
	setComposite(lineIdx)
	{
		this.lines[lineIdx].isComposite = !this.lines[lineIdx].isComposite;
		this.calculateCompositeMaatraa();
	}
	setBaseCount(baseCount)
	{
		this.baseCount = baseCount;
		this.calculateCompositeMaatraa();
	}
	calculateCompositeMaatraa()
	{
		let compositeInProgress = false;
		// reset composite lines array
		this.compositeLines.length = 0;
		if (this.lineCount > 1)
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
						this.compositeLines[len] = new compositeLine(i-1); // starting position in poem lines, line index is the *previous*
						this.compositeLines[len].maatraa = this.lines[i-1].maatraa;  // total maatraa count of prev (starting) line
						this.compositeLines[len].maatraa += this.lines[i].maatraa; // add total maatraa count of current line
					}
					else // in progress composite line
					{
						// just add to in progress composite line
						this.compositeLines[len-1].maatraa += this.lines[i].maatraa;
					}
					len = this.compositeLines.length;
					// set whether the composite maatraa is multiple of base count
					if ((this.compositeLines[len-1].maatraa % this.baseCount) == 0)
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
			let compositeMaatraa = this.compositeLines[compositeIdx].maatraa;
			let remainder = compositeMaatraa % this.baseCount;
			if (remainder != 0)
			{
				let result = compositeMaatraa/this.baseCount;
				let whole = parseInt(result);
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
	calculateRadeef()
	{
	    let radeef = '';
	    this.radeefArray = [];

	    let radeef1, radeef2;
	    let linelen1 = this.lines[0].count;
	    let linelen2 = this.lines[1].count;

	    let foundRadeefEnd = false;
	    let i = linelen1 - 1; // first line index
	    let j = linelen2 - 1; // second line index

	    while ((!foundRadeefEnd) && (i >= 0) && (j >= 0))
	    {
	      radeef1 = this.lines[0].characters[i].joinedConsonantVowel;
	      radeef2 = this.lines[1].characters[j].joinedConsonantVowel;

	      if (radeef1 == radeef2)
	      {
	        radeef = radeef1 + radeef;
	        this.radeefArray[this.radeefArray.length] = [];
	        this.radeefArray[this.radeefArray.length - 1][0] = this.lines[0].characters[i].mainChar;
	        this.radeefArray[this.radeefArray.length - 1][1] = this.lines[0].characters[i].vowelChar;
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
	    // console.log(radeef);

	    // truncate radeefArray too
	    // if clause implies a truncation did occur in the above substr code, and hence array has to be truncated 
	    if (radeef !== realRadeef) 
	    {
	      this.radeefTruncated = 1;
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
	      if ((i>1) && (i<(this.lines.length-1)) && (this.lines[i+1].characters.length==0)) supposedlyRelevantLine = true;
	      // last line
	      if (i==(this.lines.length-1)) supposedlyRelevantLine = true;
	      let linelen = this.lines[i].characters.length;
	      if ((supposedlyRelevantLine) && (linelen > radeefLen))
	      {
	        for (let j = 0; j < radeefLen; j++) {
	          if ((this.radeefArray[j][0] == this.lines[i].characters[linelen-1-j].mainChar) && (this.radeefArray[j][1] == this.lines[i].characters[linelen-1-j].vowelChar))
	            this.lines[i].characters[linelen-1-j].isRadeef = true;
	          else
	            break;
	        }
	      }
	    }
	}
	calculateKaafiyaa()
	{
		// debugger;
		let radeefLen = this.radeefArray.length;
		let foundKaafiyaaEnd = false;
		let kaafiyaa,kaafiyaa1, kaafiyaa2;
		let kaafiyaaArray = [];
		let linelen1 = this.lines[0].characters.length;
		let linelen2 = this.lines[1].characters.length;
		let i = linelen1 - 1 - radeefLen; // first line index
		let j = linelen2 - 1 - radeefLen; // second line index

		while ((!foundKaafiyaaEnd) && (i >= 0) && (j >= 0))
		{
		  kaafiyaa1 = this.lines[0].characters[i].vowelNumber;
		  kaafiyaa2 = this.lines[1].characters[j].vowelNumber;
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
		  if ((i>1) && (i<(this.lines.length-1)) && (this.lines[i+1].characters.length==0)) supposedlyRelevantLine = true;
	      // last line
	      if (i==(this.lines.length-1)) supposedlyRelevantLine = true;
		  let linelen = this.lines[i].characters.length;
		  if ((supposedlyRelevantLine) && (linelen > (radeefLen+kaafiyaaLen+this.radeefTruncated)))
		  {
		    for (j = 0; j < kaafiyaaLen; j++) {
		      if (kaafiyaaArray[j] == this.lines[i].characters[linelen-1-radeefLen-this.radeefTruncated-j].vowelNumber)
		        this.lines[i].characters[linelen-1-radeefLen-this.radeefTruncated-j].isKaafiyaa = true;
		      else
		        break;
		    }
		  }
		}
	}
	findRhymingLines()
	{
		
		if (this.lineCount < 2)
			return;

		let i = 0;
		let j = 1;
		let endReached = false;
		let rhymeGroup = 0;
		let rhymeFoundForRhymeGroup = false;
		for (i = 0; i < this.lineCount - 1; i++)
		{
			let line1 = this.lines[i];
			/*if (line1.rhymeFound)
				continue;*/

			// console.log("line "+i);

			endReached = false;
			j = i+1;
			if (this.lineCount <= j)
			{
				endReached = true;
			}

			while (!endReached)
			{
				let line2 = this.lines[j];
				// console.log("doesItRhyme with line "+j);
				/*if (!line2.rhymeFound)
				{*/

					let rhymeResult = line1.doesItRhyme(line2, rhymeGroup);
					if (rhymeResult)
					{
						if (line1.rhymeLength < rhymeResult) {
							line1.rhymeLength = rhymeResult;
							line1.rhymeFound = true;
							line1.rhymeGroup = rhymeGroup;
							rhymeFoundForRhymeGroup = true;
                        }
						if (line2.rhymeLength < rhymeResult) {
							line2.rhymeLength = rhymeResult;
							line2.rhymeFound = true;
							line2.rhymeGroup = rhymeGroup;
							rhymeFoundForRhymeGroup = true;
                        }
					}
				//}
				j++;
				if (this.lineCount <= j)
				{
					endReached = true;
					if (rhymeFoundForRhymeGroup)
					{
						rhymeFoundForRhymeGroup = false; // reset for next rhymeGroup
						rhymeGroup++; // increment rhymeGroup counter
					} 
				}
			}
		}		
	}
}

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

var oPoem;
var oPrevPoem;
var oVisual;
var rhymeColors = [
	"#046ffd", // blue "#aec7e8",
	"#ff8004", // orange "#ffbb78", 
	"rgb(0,255,0)", // green "#98df8a",
	"#fd4c48", // red as pink "#ff9896", 
	"#9203ff", // purple "#c5b0d5", 
	"#ff00a0", // magenta "#c49c94", 
	"#a4ff00", // lemon green
	//"#f7b6d2", 
	// "#dbdb8d", 
	//"#9edae5"
];


function visualize(poem, availableW, poemType=0, refresh=false)
{
	if (refresh) 
	{
		fGhazal = 0;
		fFreeVerse = 0; 
	}
	if (poemType == 1)	// ghazal
		fGhazal = true;
	if (poemType == 2)	// free-verse
		fFreeVerse = true;
	splitNprocessPoem(poem, refresh);
	if (fGhazal)
  {
    oPoem.calculateRadeef();
    oPoem.calculateKaafiyaa();
  }
  if (fFreeVerse)
  {
  	let baseC = parseInt(document.getElementById("baseCount").value);
  	oPoem.setBaseCount(baseC);
  }
  oVisual = new cVisual(availableW);
	draw();	
}

function redraw(availableW)
{
	oVisual = new cVisual(availableW)
	draw();
}


function splitNprocessPoem(poem, refresh)
{
    if (!refresh) oPrevPoem = oPoem;
		oPoem = new cPoem(poem);
    const lines = oPoem.text.split("\n");
    let oldLines = []
    if (typeof oPrevPoem !== 'undefined') oldLines = oPrevPoem.originalText.split("\n");
    const maxLineLen = lines.length;
    let iLine;
    for (iLine = 0; iLine < maxLineLen; iLine++) // process each line - i = line index
    {
    	
    	if ((iLine < oldLines.length) && (lines[iLine] == oldLines[iLine]))
    	{
    		oPoem.pushLine(oPrevPoem.lines[iLine]);
    	}
    	else
    	{
	    	const oLine = new cLine();
	    	 // except devnagari chars, 1, 2, and space, replace all others with space
	    	lines[iLine] = lines[iLine].replace(/[^\u0900-\u097F 12]/g, " ");
	    	lines[iLine] = lines[iLine].replace("।"," ");
	    	lines[iLine] = lines[iLine].replace(/\s+/g, " "); // remove extra spaces in-between words
	    	lines[iLine] = lines[iLine].trim(); // remove whitespace from both ends

        for (k=0;k<lines[iLine].length;k++) // process each char: k = char index
        {
        	charCode = lines[iLine].charCodeAt(k);
        	console.log(charCode);
        	if (charCode == 2364) // nuqta
        	{
        		oLine.changeLastCharConsonant(lines[iLine].substring(k,k+1));
        	}
        	else if ((charCode >= 2366) && (charCode <= 2381)) // maatraa
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
    }
    oPoem.findRhymingLines();
    // console.log(oPoem);
}

var charW = 20; 
var charH = 20; 
var paddingLeft = 2;
var lineSpacing = 5;
var fShowText = true;
var fLineSpacing = true;
var fFreeVerse = false;
var fGhazal = false;

function initSvgFixed(svgW, svgH)
{
	var chart = d3.select("#chart");
	var svg = chart.append("svg")
	          .attr("width", function() {return svgW;})
	          .attr("height", function() {return svgH;})
	          .attr("style","border-bottom: solid 1px #ddd;background-color:white");
	return svg;
}

function initSvgFlex(svgViewBox)
{
	var chart = d3.select("#chart");
	var svg = chart.append("svg")
	          .attr("viewBox",svgViewBox)
	          .attr("preserveAspectRatio","xMidYMid meet")
	          .attr("style","border-bottom: solid 1px #ddd;background-color:white");
	return svg;
}

// the D3 draw dance!
function draw()
{	
	// alert(oVisual.availableW);
	const maxLen = oPoem.maxLineLen;
	const lineCount = oPoem.lineCount;
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
          .data(function(d) {return d.characters;} )  // d = line, subsequent d = characters
          .enter().append("svg:text")
            .attr("y", charH-2)
            .attr("x", function(d) {return drawCharTxtPos(d);})
            .attr("class", "graphText3")
            //.attr("dominant-baseline", "central")
            .attr("text-anchor", "middle")
            .text(function(d) {return d.text;});
    }

    g.selectAll("path")
      .data(function(d) {return d.characters;} ) // d = line, subsequent d = characters
      .enter().append("path")
        .attr("id", function(d,i) {return "char"+i})
        .attr("style", function(d,i) {
          if (fGhazal)
            return drawStyleCharBlock(d,'ghazal');
          else
            return drawStyleCharBlock(d,'consonant');
        })
        .attr("d", function(d,i) {return drawVowPath(d,i);})
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

// helper for draw function to place text in correct position
function drawCharTxtPos(d)
{
	var x = ((d.maatraaCumulative-d.maatraa)*charW);
	var w = charW*d.maatraa;
	return x+(w/2);
}

// style of char blocks - including color
// c - the character to be styled
function drawStyleCharBlock(c,colorBy)
{

	if (c.vowelNumber === -10) // do not display space, comma
	  return "display: none";

	var color = "rgb(0,220,255)";
	var strokeOp = "0.3";
	var strokeW = 1;
	var fillOp = "0.2";
	var strokeColor = "black";

	// call conColor to determine color and opacity as per consonant
	if (colorBy == 'consonant')
	{
		if (c.maatraa == c.systemMaatraa)
		{
	  		// color = "rgb(0,220,255)"; // blue
	  		if (c.rhymeLevel > 0)
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

// shapes' shape determined by vowel
function drawVowPath(d,i)
{
	var p = "";
	var x = ((d.maatraaCumulative-d.maatraa)*charW);  // where the drawing of this path has to start horizontally
	var w = charW*d.maatraa;
	var h = charH;
	if ((d.vowelNumber == -1) && (d.maatraa == 0)) // half letter of 0 width
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

// toggle ShowText control
function fnShowText()
{
	fShowText = !fShowText;
	document.getElementById("chkShowText").checked = fShowText;
	draw();
}

// draw composite line markers if free verse is on
function drawFreeVerseDashStyle(i)
  {
      if (oPoem.lines[i].maatraa == 0)  // empty line
        return "display:none;";

      return "stroke:black;stroke-width:8;"
  }

// toggle Free Verse support
  function fnFreeVerseSupport()
  {
    fFreeVerse = !fFreeVerse;
    if (fFreeVerse)
    {
      document.getElementById("chkGhazal").disabled = true;
      document.getElementById("spanFreeVerse").style.display = "inline";
      let baseC = parseInt(document.getElementById("baseCount").value);
      oPoem.setBaseCount(baseC);
    }
    else
    {
      document.getElementById("chkGhazal").disabled = false;
      document.getElementById("spanFreeVerse").style.display = "none";
    }
    draw();
  }

function fnFit(chkbox)
{
	var checked = chkbox.checked;
	if (checked)
		oVisual.userMode = "flexible";
	else
		oVisual.userMode = "fixed";
	draw();
}

function drawCompositeLineMarker(drawWhat,i)
  {
  	const maxLen = oPoem.maxLineLen;
    if (drawWhat == "x1")
    {
      if (i==0)
        return charW*maxLen+(charW*2);
      if (oPoem.lines[i].isComposite)
        return charW*maxLen+(charW+12);        
      else
        return charW*maxLen+(charW*2);
    }
    if (drawWhat == "y1")
    {
      if (oPoem.lines[i].isComposite)
      {
        if (fLineSpacing)
          return -11;
        else
          return 0;
      }               
      else
        return charH-2;
    }
    if (drawWhat == "style")
    {
      if ((oPoem.lines[i].maatraa == 0) || (!oPoem.lines[i].isComposite))  // empty line || not composite
        return "display:none;";

      return "stroke:green;stroke-width:6;"
    }
  }

function drawCompositeNumbers()
{
	const maxLen = oPoem.maxLineLen;
	let chart = d3.select("#chart");
	let svg = chart.select("svg");
	
	let y = 0;
	if (fLineSpacing)
		y = charH + lineSpacing;
	else
		y = charH;

	let compositeLTotal = svg.selectAll(".compositeCountT")
	  .data(oPoem.compositeLines)
	  .enter().append("svg:text")
	  .attr("y", function(d) {return ((d.originalLineIdx*y)+y+charH);})
	  .attr("x", function(d) {return paddingLeft + (charW*maxLen)+(charW+20);})
	  .attr("class", "compositeCountT")
	  .attr("style", function(d) {return d.multipleOfBaseCount?"fill:black":"fill:red";})
	  // .attr("style", function(d) {return "fill:black";})
	  .text(function(d) {return d.maatraa;});

	let compositeLRemainder = svg.selectAll(".compositeCountR")
	  .data(oPoem.compositeLines)
	  .enter().append("svg:text")
	  .attr("y", function(d) {return ((d.originalLineIdx*y)+y+charH)+10;})
	  .attr("x", function(d) {return paddingLeft + (charW*maxLen)+(charW+20+10);})
	  .attr("class", "compositeCountR")
	  .attr("style", function(d) {return d.remainder!=0?"fill:red;font-size:80%":"display:none";})
	  .text(function(d) {return d.remainder>0?"+"+d.remainder:d.remainder;});
}

// toggle Line Spacing control
function fnLineSpacing()
{
	fLineSpacing = !fLineSpacing;
	draw();
}

// when user clicks char to adjust maatraa
function adjustCharLen()
{
	var iChr = parseInt(this.getAttribute("id").substring(4));
	var iLine = parseInt(this.parentNode.getAttribute("id").substring(5));
	var kk = 0;
	oPoem.adjustCharMaatraa(iLine,iChr);
	draw();
}

// when free verse suppport is on
// allows users to join multiple lines together for 
// getting total maatraa count of a set of lines
function markCompositeLine()
{
	// line clicked
	let i = parseInt(this.parentNode.getAttribute("id").substring(5));

	// if anything before last line
	// if not marked as composite
	if ((i < oPoem.lines.length-1) && (!oPoem.lines[i+1].isComposite))
	{
	  oPoem.setComposite(i+1); // why is the next line marked composite? but it works
	  draw();
	} 
}

function unmarkCompositeLine()
  {
    // line clicked
    var i = parseInt(this.parentNode.getAttribute("id").substring(5));
    // toggle composite line setting
    // if true, the line is composite with top
    if (i > 0)
    {
      oPoem.setComposite(i); 
      draw();
    } 
  }

function fnBaseCountChange()
  {
    let baseC = parseInt(document.getElementById("baseCount").value);
    if (baseC > 0)
    {
      if (baseC != oPoem.baseCount)
      {
        oPoem.setBaseCount(baseC);
        draw();
      }
    }
    else
    {
      document.getElementById("baseCount").value = prevBaseCount;
    }
  }

function fnGhazal()
  {
    fGhazal = !fGhazal;
    if (fGhazal)
    {
      document.getElementById("chkFreeVerse").disabled = true;
      oPoem.calculateRadeef();
      oPoem.calculateKaafiyaa();
    }
    else
    {
      document.getElementById("chkFreeVerse").disabled = false;
    }
    // console.log(oPoem);
    draw();
  }



// Download SVG as PNG on user's system
function saveSVG() {
	var chart = document.getElementById("chart");
	var svg = chart.querySelector('svg');
	var canvas = document.createElement("canvas");
  var data = new XMLSerializer().serializeToString(svg);
  //alert(data);
  // ADD geet-gatiroop.com to bottom of image
  if (data.search("viewBox") == -1) // not fitscreen
  {
  	var width = svg.getBoundingClientRect().width;
		var height = svg.getBoundingClientRect().height;
		canvas.width = width;
  	canvas.height = height+10;

	  var svgStart = '<svg xmlns="http://www.w3.org/2000/svg" width="'+width+'" height="';
	  data = data.substring(svgStart.length+height.toString().length);
	  // insert new height
	  data = svgStart + (height+10) + data;

	  // get svg string minus svg closing tag
	  data = data.substring(0,data.length-6);
	  // insert geet gatiroop text at bottom just before closing svg tag
	  data += '<text x="2" y="'+(height+10-4)+'">geet-gatiroop.com</text></svg>';
	}
	else // free size as per poem -- no viewbox
	{
		var box = svg.viewBox.baseVal;
		canvas.width = box.width;
  	canvas.height = box.height+10;

  	canvas.height += 10;

	  var svgStart = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 '+box.width+' ';
	  data = data.substring(svgStart.length+box.height.toString().length);

	  // insert new height
	  data = svgStart + (box.height+10) + data;

	  // get svg string minus svg closing tag
	  data = data.substring(0,data.length-6);
	  // insert geet gatiroop text at bottom just before closing svg tag
	  data += '<text x="2" y="'+(box.height+10-4)+'">geet-gatiroop.com</text></svg>';
	}

  var win = window.URL || window.webkitURL || window;
  var img = new Image();
  var blob = new Blob([data], { type: 'image/svg+xml' });
  var url = win.createObjectURL(blob);
  img.onload = function () 
  {
    canvas.getContext('2d').drawImage(img, 0, 0);
    win.revokeObjectURL(url);
    var uri = canvas.toDataURL('image/png').replace('image/png', 'octet/stream');
    var a = document.createElement('a');
    document.body.appendChild(a);
    a.style = 'display: none';
    a.href = uri
    a.download = "geetgatiroop-output.png";
    a.click();
    window.URL.revokeObjectURL(uri);
    document.body.removeChild(a);
  };

  img.src = url;

}

// used for minification
// https://javascript-minifier.com/