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
      		return;
		}
      	if (p.vowelNumber === -10) // no previous letter, half maatraa is first letter of word
      	{
      		this.maatraa = 0;
      		return;
      	}

      	// special combinations ----------------
	    if ((this.mainChar == "म") && (n.mainChar == "ह"))
	    {
	      this.maatraa = 0;
	      return;
	    }
	    if ((this.mainChar == "न") && (n.mainChar == "ह"))
	    {
	      this.maatraa = 0;
	      return;
	    }
	  	// end special combinations ------------

	  	if (p.isLaghu())
	  	{
	  		this.maatraa = 1;
	  		return;
	  	}
	  	if (n)
	  	{
	  		if (p.isDeergha() && n.isDeergha()) // both side deergha
		    {
		    	this.maatraa = 1;
		      	return;
		    }
	  	}
	  	else	// no next letter meaning this is last letter
	  	{
	  		this.maatraa = 1;
	  		return;
	  	}

		  	
	}
}


class cLine {
	constructor() {
		this.characters = new Array();
		this.count = 0;
	}
	// get last character of line
	get last()	{
		return this.characters[this.count-1];
	}
	// change last character of line
	set last(newChar) 	{
		this.characters[this.count-1] = newChar;
	}
	// add a new character to line
	push(newChar)
	{
		newChar.index = this.count;
		this.characters.push(newChar);
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
		let halfLetters = this.characters.filter(function (thisChar) {
			return thisChar.isHalfLetter();
		});
		return halfLetters;
	}
	// calculate default maatraa for half letters in a line based
	calculateHalfLettersMaatraa()
	{
		let halfLetters = this.getHalfLetters();
		for (i=0;i<halfLetters.length;i++)
		{
			let thisHalfLetter = halfLetters[i];
			if (thisHalfLetter.index == 0) // first character, no previous, next not required
				thisHalfLetter.calculateHalfLetterLen();
			else
			{
				let previousChar = this.previousChar(thisHalfLetter);
				let nextChar = this.nextChar(thisHalfLetter.index+1);
				thisHalfLetter.calculateHalfLetterLen(previousChar, nextChar);
			}
			
		};
	}
}

class cPoem {
	constructor(originalText) {
		this.originalText = originalText;
		this.lines = new Array();
		this.lineCount = 0;
	}
	pushLine(newLine)
	{
		this.lines.push(newLine)
		this.lineCount++;
	}
	get text() 	{
		return this.originalText;
	}
}

function visualize()
{
	splitNprocessPoem();
}

function splitNprocessPoem()
{
	let oPoem = new cPoem(document.getElementById("pom").value);
    let lines = oPoem.text.split("\n");
    let maxLineLen = lines.length;
    for (i = 0; i < maxLineLen; i++) // process each line - i = line index
    {
    	let oLine = new cLine();
        for (k=0;k<lines[i].length;k++) // process each char: k = char index
        {
        	charCode = lines[i].charCodeAt(k);
        	if ((charCode >= 2366) && (charCode <= 2381)) // maatraa
			{
				// new element not added to line array
				// the vowel part of previous element 
				// modified to update maatraa
				oLine.last.vowel = lines[i].substring(k,k+1);
			}
			else // not maatraa - true new char
			{
				var thisChar = lines[i].substring(k,k+1);
				let oChar = new cChar(thisChar,charCode);
	          	oLine.push(oChar);
			}
        }
        // console.log(oLine.getHalfLetters());
        oLine.calculateHalfLettersMaatraa();
        oPoem.pushLine(oLine);
    }
    console.log(oPoem);
}