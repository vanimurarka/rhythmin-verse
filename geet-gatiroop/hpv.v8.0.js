// export to import as module
// inherited class for ghazal, mukt kavita
// vaarnik chhand


// Class: cChar
// A class for one character object. It may be only a vowel, a vowel-consonant combination, or any other character
class cChar {
	/* 
		Constructor: cChar
		Creates a new character object.

		Parameter:
			mainChar - 
			mainCharCode -
	*/
  constructor(mainChar, mainCharCode) {
  	// Variable: mainChar
		this.mainChar = mainChar;
		// Variable: mainCharCode
		this.mainCharCode = mainCharCode;
		// Variable: vowelChar
		this.vowelChar = "";
		// Variable: vowelNumber
		this.vowelNumber = 0;
		// Variable: index
		this.index = 0;
		// Variable: maatraa
		this.maatraa = 0;
		// Variable: systemMaatraa
		// Maatraa calculated by system. Maybe diff from maatraa if user adjusts it
		this.systemMaatraa = 0; 
		// Variable: maatraaCumulative
		this.maatraaCumulative = 0;
		// Variable: maapneeType
		// Does this character have to be colored as per 2 or 1 when displaying maapnee analysis? Normally will be 2 or 1 as per the character's maatraa but if there are 2 consecutive 1s and they match with a 2 in the maapnee pattern then maapneeType = 1.5 even when maatraa = 1 -- indicating like 2, but 1+1 2. 0 is for yati.
		this.maapneeType = -1;
		// Variable: isRadeef
		this.isRadeef = false;
		// Variable: isKaafiyaa
		this.isKaafiyaa = false;
		// Variable: isHindi
		this.isHindi = false;
		// Variable: rhymeLevel
		// 0 = no rhyme, 1 = vowel rhyme, 2 = full rhyme
		this.rhymeLevel = 0; 
		// Variable: rhymeGroup
		this.rhymeGroup = -1; // for coloring rhymed letters in diff colors based on diff rhyming lines
		// Variable: varna
		this.varnaGan = "";

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

		// chandrabindu
	  if (mainCharCode == 2305)
		this.vowel = "ँ";

      // anusvaar (the bindi on top) which sometimes is short-cut for half letter
      if (mainCharCode == 2306) 
        this.vowel = "्";
  }
  /* 
		Function: replaceMainChar
		When a consonant has a Nuqta or dot below like ड़, it is handled as one character in this s/w but the dot below is a separate character in Unicode. So the dot has to be merged with the existing character.

		Parameter:
			newMainChar
	*/
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

  /*
  	Function: Setter vowel
  	Set the vowel character for this character block
  */
  set vowel(vowelChar) {
		this.vowelChar = vowelChar;
		// set Vowel Number
		switch(vowelChar)
		{
			case "ँ":
				this.isHindi = true;
				break;
			case "्":
				this.vowelNumber = -1;
				this.isHindi = true;
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
  /*
	  Function: isHalfLetter
	  Determine if character is half letter

	  Returns:
	  	True or False
	*/
  isHalfLetter()
  {
  	return (this.vowelNumber == -1); 
  }
  /*
	  Function: isPureVowel
	  Determine whether character is a pure vowel with no consonant

	  Returns:
	  	True or False
	*/
  isPureVowel()
  {
  	return (this.mainChar == this.vowelChar);
  }
  /*
	  Function: isLaghu
	  Checks if this character is of laghu vowel

	  Returns:
	  	True or False
	*/
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
  /*
	  Function: isDeergha
	  Checks if this character is of deergha vowel

	  Returns:
	  	True or False
	*/
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
  /*
	  Function: calculateHalfLetterLen
	  Determine when a half letter will have 0 or 1 maatraa. The logic for default handling - which the user can always override.

	  Parameters:
			p - previous letter 
			n - next letter
	*/  	
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
	// Function: adjustCharMaatraa
	// When the user adjusts the maatraa by clicking on the char, then adjust the maatraa
	adjustCharMaatraa()
	{
		// whole chars
		//    aa, ee, oo                        
		if (((this.vowelNumber <= 6) && (this.vowelNumber%2 == 0)) 
			//all other deergha
			|| ((this.vowelNumber>6) && (this.vowelNumber<12)))
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
	// Function: get text
	// Getter. Return full text of a character, i.e. mainchar + vowelchar
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
	// Function: get joinedConsonantVowel
	// Getter. Gets the mainchar+vowelchar. This is different from get text in that it returns all chars, even non-hindi ones.
	get joinedConsonantVowel() 
	{
		if (this.mainChar==this.vowelChar)
		  return this.vowelChar; // c is also a vowel - like आ आ
		if (this.vowelChar == 'अ')
		  return this.mainChar; // could be a case of न अ 
		return this.mainChar+this.vowelChar;
	}
	/* Function: compare
		Compares this character with a given cChar object.

		Return:
			- "all" for full match
			- true when vowel is the same
			- false when vowel is not the same (so consonant matching is irrelevant)
	*/
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

// Class: cLine
// A line of poetry
class cLine {
	/* Constructor
		Create a new line object using a given line of text

		Parameter:
			lineText - text of line from which line object is to be creater
	*/
	constructor(lineText) {
		// Variable: originalText
		this.originalText = lineText;
		// Variable: characters (cChar Array)
		this.characters = new Array();
		// Variable: count (int)
		this.count = 0;
		// Variable: maatraa
		// Probably total maatraa for line
		this.maatraa = 0;
		// Variable: isComposite (boolean)
		this.isComposite = false;
		// Variable: rhymeFound (boolean)
		this.rhymeFound = false;
		// Variable: rhymeGroup (integer)
		this.rhymeGroup = 0;
		// Variable: rhymeLength (integer)
		this.rhymeLength = 0;
	}
	// Function: get text
	// Getter. Gets the original text using which the line was created
	get text() 	{
		return this.originalText;
	}
	/* Function: lastCharVowel
		Change the vowel of the last character of the line and recalculate maatraas accordingly. Used when processing a line character by character, and the vowel character comes after the consonant.

		Parameters:
			- vowelString - vowel text
	*/
	lastCharVowel(vowelString)
	{
		const lastChar = this.characters[this.count-1];
		const oldMaatraa = lastChar.maatraa;
		lastChar.vowel = vowelString;
		this.maatraa += lastChar.maatraa - oldMaatraa;
		lastChar.maatraaCumulative += lastChar.maatraa - oldMaatraa;
	}
	/* Function: changeLastCharConsonant
		Change the consonant of the last char of line -- probably because it is a nuqta

		Parameters:
			consonantString - consonant text
	*/
	changeLastCharConsonant(consonantString)
	{
		const lastChar = this.characters[this.count-1];
		lastChar.replaceMainChar(consonantString);
	}
	/* Function: push
		Add a new character to line

		Parameters:
			- newChar - Type: cChar
	*/
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
	/* Function: charByIndex
		Get the nth character of a line

		Parameters:
			idx - index of character being asked for

		Returns:
			cChar
	*/
	charByIndex(idx)
	{
		return this.characters[idx];
	}
	/* Function: charByReverseIndex
		Get the nth character from the end of line

		Parameters:
			idx - index from end of line of character being asked for

		Returns:
			cChar 
	*/
	charByReverseIndex(idx)
	{
		idx = this.count-1-idx;
		if (idx > 0)
			return this.characters[idx];
		else
			return false;
	}
	/* Function: previousChar
		Get previous character w.r.t. given current character - as each cChar has an index private property too

		Parameters:
			c - current character (cChar)

		Returns:
			- previous cChar in line
			- or false if not found
	*/
	previousChar(c) // c = current character
	{
		if ((c.index != 0) && (this.count>1))
			return this.characters[c.index-1];
		else
			return false;
	}
	/* Function: nextChar
		Get next character w.r.t. given current character - as each cChar has an index private property too

		Parameters:
			c - current character (cChar)

		Returns:
			- next cChar in line
			- or false if not found
	*/
	nextChar(c) // c = current character
	{
		if ((this.count>1) && (c.index < this.count - 1))
			return this.characters[c.index+1];
		else
			return false;
	}
	/* Function: getLastChar
		Get last cChar in line

		Returns:
			- last cChar in line
			- or false line has no characters
	*/
	getLastChar()
	{
		if (this.count == 0)
			return false;
		else
			return this.characters[this.count-1];
	}
	/* Function: getHalfLetters
		Return an array of half letters in a line
	*/
	getHalfLetters()
	{
		const halfLetters = this.characters.filter(function (thisChar) {
			return thisChar.isHalfLetter();
		});
		return halfLetters;
	}
	/* Function: calculateHalfLettersMaatraa
		Calculate default maatraa for half letters in a line
	*/
	calculateHalfLettersMaatraa()
	{
		const halfLetters = this.getHalfLetters();
		let maatraa = 0;
		let i;
		for (i=0;i<halfLetters.length;i++)
		{
			const thisHalfLetter = halfLetters[i];
			maatraa = 0;
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
	/* Function: adjustCharMaatraa
		Adjust maatraa for the character of the given index. Update cumulative maatraas for other subsequent characters in line accordingly

		Parameters:
			charIdx - index of character whose maatraa is to be adjusted
			maapneePattern - if the poem has a maapnee, it will be used to set maapnee again
	*/
	adjustCharMaatraa(charIdx, maapneePattern)
	{
		let thisChar = this.charByIndex(charIdx);
		let oldMaatraa = thisChar.maatraa;
		thisChar.adjustCharMaatraa();
		let diff = thisChar.maatraa - oldMaatraa;
		this.maatraa += diff;
		let i;
		for (i = charIdx; i < this.count; i++)
			this.charByIndex(i).maatraaCumulative += diff;

		this.clearMaapnee();
		this.setMaapnee(maapneePattern);

		return this.maatraa;
	}
	/* Function: doesItRhyme

		Parameters:
			- compareLine
			- rg
	*/
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
	/* Function: setMaapnee
		Analyses current line as per Maapnee of poem.
	*/
	setMaapnee(pattern = [])
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

		for (i = 0; i < this.count; i++)
		{
			currentC = this.characters[i];
			currentPattern = pattern[pi];

			if (currentC.isHindi)
			{
				if (currentC.maapneeType != 1.5)
					currentC.maapneeType = currentC.maatraa;

				// increment pattern index if currentC was deergh
				if (withPattern && (currentC.maapneeType == 2)) 
				{
					pi++;
					continue;
				}

				if ((currentC.mainChar == "1") || (currentC.mainChar == "१"))
				{
					pi++;
					continue;
				}
				if ((i < this.count - 1) && (currentC.maatraa == 1) && (currentC.maapneeType != 1.5))
				{
					let nextChar = currentC;
					let nextCharFound = false;
					while (!nextCharFound)
					{
						nextChar = this.nextChar(nextChar);
						if (nextChar === false) // no more chars
							break;

						if (nextChar.isHindi && (nextChar.maatraa > 0))
							nextCharFound = true;
					}
					if ((nextChar.maatraa == 1) && (currentC.maatraa == 1))
					{
						if (!withPattern) // do defaut processing
						{
							nextChar.maapneeType = 1.5;
							currentC.maapneeType = 1.5;
						}
						else // with pattern so also take pattern into consideration
						{
							if (pattern[pi] == 1)
								pi++;
							else
							{
								nextChar.maapneeType = 1.5;
								currentC.maapneeType = 1.5;
								pi++;
							}
						}
					}
					else 
					{
						pi++;
					}
				}
				else if (currentC.maapneeType == 1)
				{
					pi++;
				}
			}
			else
			{
				if (withPattern && (currentPattern == 0))
				{
					currentC.maapneeType = 0;
					pi++;
				}
			}
		}

	}
	/* Function: clearMaapnee
	*/
	clearMaapnee()
	{
		let i = 0;
		for (i = 0; i < this.count; i++)
		{
			this.characters[i].maapneeType = -1; // default value
		}
	}
}

class cVaarnikLine extends cLine {
	constructor(lineText) {
		super(lineText);
		this.varna = 0;
	}
	setVarna()
	{
		/*
		laghu - 8bd3c7
		guru - b2e061
		yagan - shubh - 122 - blue 7eb0d5
		magan - shubh - २२२ - green b2e061
		tagan - अशुभ - २२१ - purple bd7ebe
		ragan - अशुभ - २१२ - red fd7f6f
		jagan - अशुभ - १२१ - orange ffb55a
		bhagan - शुभ - २११ - light purple beb9db
		nagan - शुभ - १११ - sea blue 8bd3c7
		sagan - अशुभ - ११२ - pink fdcce5
		*/
		if (this.count < 3)
			return;
		// debugger;
		let i = 0;
		for (i = 2; i < this.count; i++)
		{
			let c2 = this.characters[i - 2];
			while (c2.maatraa == 0) {
				i++;
				if (i >= this.count)
					break;
				c2 = this.characters[i - 2];
			}
			if (i >= this.count)
					break;
			let c1 = this.characters[i - 1];
			while (c1.maatraa == 0) {
				i++;
				if (i >= this.count)
					break;
				c1 = this.characters[i - 1];
			}
			if (i >= this.count)
					break;
			let c0 = this.characters[i];
			while (c0.maatraa == 0) {
				i++;
				if (i >= this.count)
					break;
				c0 = this.characters[i];
			}
			let pattern = c2.maatraa.toString() + c1.maatraa.toString() + c0.maatraa.toString();
			c2.varnaGan = c1.varnaGan = c0.varnaGan = pattern;
			this.varna += 3;
			i += 2;
		}
		console.log(this.count);
		console.log(i);
	}
}

// Class: cPoem
// Class for the full processed poem object.
class cPoem {
	/* Constructor
		Create a new poem object with given Text. Processing of text not being done here. Only initializing of private variables.

		Parameter:
			originalText
	*/
	constructor(originalText) {
		// Variable: originalText
		this.originalText = originalText;
		// Variable: lines (cLine Array)
		this.lines = new Array();
		// Variable: lineCount (int)
		this.lineCount = 0;
		// Variable: maxLineLen (int)
		this.maxLineLen = 0;
		// Variable: firstLineMaapnee (boolean)
		this.firstLineMaapnee = false;
		// Variable: maapneePattern (Array)
		this.maapneePattern = [];
	}
	/* Function: push
		Add new cLine

		Parameter:
			newLine - new cLine
	*/
	pushLine(newLine)
	{
		this.lines.push(newLine)
		this.lineCount++;
		if (this.maxLineLen < newLine.maatraa)
			this.maxLineLen = newLine.maatraa;
		if (this.lineCount == 1)
		{
			this.detectFirstLineMaapnee();
			if (this.firstLineMaapnee)
				this.setMaapneePattern();
		}
	}
	/* Function: get text
		Getter. Gets original text with which this object was constructed
	*/
	get text() 	{
		return this.originalText;
	}
	/* Function: adjustCharMaatraa
		Adjust maatraa of character of given index, in line of given index. Update other requisite variables accordingly

		Parameters -
			- lineIdx - index of line where character exists whose maatraa has to be adjusted
			- charIdx - index of character in line whose maatraa has to be adjusted
	*/
	adjustCharMaatraa(lineIdx, charIdx)
	{
		let newMaatraaOfLine = this.lines[lineIdx].adjustCharMaatraa(charIdx,this.maapneePattern);
		if (this.maxLineLen < newMaatraaOfLine)
			this.maxLineLen = newMaatraaOfLine;
	}
	// Function: findRhymingLines
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
	// Function: detectFirstLineMaapnee
	// Detect if first line of poem text is a Maapnee (1,2 pattern)
	detectFirstLineMaapnee()
	{
		if (this.lineCount < 1) return;
		let line1 = this.lines[0];
		let pattern = /^[12१२\s]+$/;
		this.firstLineMaapnee = pattern.test(line1.text);
	}
	// Function: setMaapneePattern
	// Sets the Maapnee Pattern for the poem as per the first line so that subsequent lines can be assessed accordingly
	setMaapneePattern()
	{
		let lineMaapnee = this.lines[0];
		let i = 0;
		for (i=0;i<lineMaapnee.count;i++)
		{
			if ((lineMaapnee.characters[i].systemMaatraa == 1) || (lineMaapnee.characters[i].systemMaatraa == 2))
			{
				this.maapneePattern[this.maapneePattern.length] = lineMaapnee.characters[i].systemMaatraa;
			}
			else
			{
				this.maapneePattern[this.maapneePattern.length] = 0;
			}
		}
	}
}

class cGhazal extends cPoem {
	constructor(originalText) {
		super(originalText);

		// Variable: radeefTruncated
		this.radeefTruncated = 0;
		// Variable: radeefArray
		this.radeefArray = [];
	}
		// Function: calculateRadeef
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
	// Function: calculateKaafiyaa
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

	static fromPoem(poem) {
		let newGhazal = new cGhazal(poem.originalText);
		newGhazal.lines = poem.lines;
		newGhazal.lineCount = poem.lineCount;
		newGhazal.maxLineLen = poem.maxLineLen;
		return newGhazal;
	}
}

class cFreeVerse extends cPoem {
	constructor(originalText) {
		super(originalText);
		// Variable: compositeLines (Array)
		this.compositeLines = [];
		// Variable: baseCount (int)
		this.baseCount = 1;
	}
	/* Function: setComposite
		Toggle line of given index as composite line. For Free Verse.

		Parameters -
			- lineIdx - index of line whose composite flag is to be toggled
	*/
	setComposite(lineIdx)
	{
		this.lines[lineIdx].isComposite = !this.lines[lineIdx].isComposite;
		this.calculateCompositeMaatraa();
	}
	/* Function: setBaseCount
		Set base meter count for this poem, and update composite counts accordingly.

		Parameters -
			- baseCount - Base count integer
	*/
	setBaseCount(baseCount)
	{
		this.baseCount = baseCount;
		this.calculateCompositeMaatraa();
	}
	// Function: calculateCompositeMaatraa
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
	// Function: calculateRemainder
	// Calculate remainder for a given composite index
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

	static fromPoem(poem)
	{
		let newFreeVerse = new cFreeVerse(poem.originalText);
		newFreeVerse.lines = poem.lines;
		newFreeVerse.lineCount = poem.lineCount;
		newFreeVerse.maxLineLen = poem.maxLineLen;
		return newFreeVerse;
	}
}

class cVaarnikPoem extends cPoem {
	constructor(originalText) {
		super(originalText);
	}

	pushLine(newLine)
	{
		super.pushLine(newLine);
	}

}

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

// Section: Global

var oPoem;
var oPrevPoem;
var oVisual;
var rhymeColors = [
	//"#046ffd", // blue "#aec7e8",
	"#ff8004", // orange "#ffbb78", 
	//"rgb(0,255,0)", // green "#98df8a",
	"#fd4c48", // red as pink "#ff9896", 
	"#9203ff", // purple "#c5b0d5", 
	"#ff00a0", // magenta "#c49c94", 
	"#a4ff00", // lemon green
];
let varnaGanColorMap = new Map([
		["122","#7eb0d5"],
		["222","#b2e061"],
		["221","#bd7ebe"],
		["212","#fd7f6f"],
		["121","#ffb55a"],
		["211","#beb9db"],
		["111","#8bd3c7"],
		["112","#fdcce5"]
]);

/*
Function: visualize
The start. The function to be called from containing HTML Page. Parses passed poem, then, calls draw function

Parameters: 
	poem - The poem text
	availableW - Available Screen Width
	poemType - 0=Normal poem, 1=Ghazal, 2=Mukt Kavita, 3=Vaarnik
*/
function visualize(poem, availableW, poemType=0, refresh=false)
{
	poemType = 3;
	if (refresh) 
	{
		fGhazal = 0;
		fFreeVerse = 0; 
	}
	if (poemType == 1)	// ghazal
		fGhazal = true;
	if (poemType == 2)	// free-verse
		fFreeVerse = true;

  if (!refresh) oPrevPoem = oPoem;
	
	if (poemType == 1)
		oPoem = new cGhazal(poem);
	else if (poemType == 2)
		oPoem = new cFreeVerse(poem);
	else if (poemType == 3)
		oPoem = new cVaarnikPoem(poem);
	else
		oPoem = new cPoem(poem);

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

// Function: redraw
// Don't know if this is being used
function redraw(availableW)
{
	oVisual = new cVisual(availableW)
	draw();
}

// Function: splitNprocessPoem
function splitNprocessPoem(poem, refresh)
{
	// debugger;
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
	    	// clean line
	    	 // except devnagari chars, 1, 2, and space, replace all others with space
	    	lines[iLine] = lines[iLine].replace(/[^\u0900-\u097F 12]/g, " ");
	    	lines[iLine] = lines[iLine].replace("।"," ");
	    	lines[iLine] = lines[iLine].replace(/\s+/g, " "); // remove extra spaces in-between words
	    	lines[iLine] = lines[iLine].trim(); // remove whitespace from both ends
	    	
	    	let oLine;
	    	if (oPoem instanceof cVaarnikPoem)
	    		oLine = new cVaarnikLine(lines[iLine]);
	    	else
	    		oLine = new cLine(lines[iLine]);

        for (k=0;k<lines[iLine].length;k++) // process each char: k = char index
        {
        	charCode = lines[iLine].charCodeAt(k);
        	let thisChar = lines[iLine].substring(k,k+1);
        	if (charCode == 2364) // nuqta
        	{
        		oLine.changeLastCharConsonant(thisChar);
        	}
        	else if ((charCode >= 2366) && (charCode <= 2381)) // maatraa
					{
						// new element not added to line array
						// the vowel part of previous element 
						// modified to update maatraa
						// NOTE: This also includes the halant character
						oLine.lastCharVowel(thisChar);
					}
					else // not maatraa - true new char
					{
						oChar = new cChar(thisChar,charCode);
						oLine.push(oChar);
					}
        }
				oLine.calculateHalfLettersMaatraa();
				// oLine.setMaapnee(oPoem.maapneePattern);
				oPoem.pushLine(oLine);
				if (oPoem instanceof cVaarnikPoem)
					oPoem.lines[oPoem.lineCount - 1].setVarna();
				else
					oPoem.lines[oPoem.lineCount - 1].setMaapnee(oPoem.maapneePattern);

	    }
    }
    
    console.log(oPoem);
}

var charW = 20; 
var charH = 20; 
var paddingLeft = 2;
var lineSpacing = 5;
var fShowText = true;
var fLineSpacing = true;
var fFreeVerse = false;
var fGhazal = false;
var fRhymingLines = false;

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

// Function: draw
// The D3 draw dance!
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

// Function: drawCharTxtPos
// Helper for draw function to place text in correct position
function drawCharTxtPos(d)
{
	var x = ((d.maatraaCumulative-d.maatraa)*charW);
	var w = charW*d.maatraa;
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
		if (c.maatraa == c.systemMaatraa)
		{
				if (c.systemMaatraa == 2)
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
	  		if (c.varnaGan.length > 0)
	  		{
	  			color = varnaGanColorMap.get(c.varnaGan);
	  			fillOp = "0.6";
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

// Function: drawVowPath
// Shapes of character blocks determined by vowel. This function is probably defunct.
function drawVowPath(d,i)
{
	// console.log(d);
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

// Function: fnShowText
// Toggle function to show or hide text in the visualization
function fnShowText()
{
	fShowText = !fShowText;
	draw();
}

// Function: fnRhymingLines
// Toggle function to calculate and show rhyming lines in the visualization
function fnRhymingLines()
{
	fRhymingLines = !fRhymingLines
	if (fRhymingLines && (!fGhazal))
		oPoem.findRhymingLines();
	draw();
}

// Function: drawFreeVerseDashStyle
// Draw composite line markers if free verse is on
function drawFreeVerseDashStyle(i)
  {
      if (oPoem.lines[i].maatraa == 0)  // empty line
        return "display:none;";

      return "stroke:black;stroke-width:8;"
  }

/* 
Function: fnFreeVerseSupport
Toggle Free Verse support

Parameter: 
	baseCount
*/
function fnFreeVerseSupport(baseCount = 1)
{
	debugger;
  fFreeVerse = !fFreeVerse;
  if (fFreeVerse)
  {
  	if (!(oPoem instanceof cFreeVerse))
  		oPoem = cFreeVerse.fromPoem(oPoem);

    oPoem.setBaseCount(baseCount);
  }
  draw();
}

// Function: fnFit
// Toggle Screen Fit
function fnFit(chkbox)
{
	var checked = chkbox.checked;
	if (checked)
		oVisual.userMode = "flexible";
	else
		oVisual.userMode = "fixed";
	draw();
}

// Function: drawCompositeLineMarker
// What is the difference between this function and drawFreeVerseDashStyle
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

// Function: drawCompositeNumbers
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

// Function: fnLineSpacing
// Toggle Line Spacing control
function fnLineSpacing()
{
	fLineSpacing = !fLineSpacing;
	draw();
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

/*
	Function: markCompositeLine
	Allows users to join multiple lines together for getting total maatraa count of a set of lines. When free verse suppport is on.
*/
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

/*
	Function: unmarkCompositeLine
*/
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

/*
Function: fnBaseCountChange

Parameter: 
	baseCount
*/
function fnBaseCountChange(baseCount = 1)
  {
    if ((baseCount > 0) && (baseCount != oPoem.baseCount))
    {
      oPoem.setBaseCount(baseCount);
      draw();
    }
  }

/*
	Function: fnGhazal
	Toggle function for Ghazal feature
*/
function fnGhazal()
  {
    fGhazal = !fGhazal;
    debugger;
    if (fGhazal)
    {
    	if (!(oPoem instanceof cGhazal))
    		oPoem = cGhazal.fromPoem(oPoem);

      oPoem.calculateRadeef();
      oPoem.calculateKaafiyaa();
    }
    draw();
  }


// Function: saveSVG
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