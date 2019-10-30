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
    isHalfLetter()
    {
    	return (this.vowelNumber == -1); 
    }
}


class cLine {
	constructor() {
		this.characters = new Array();
		this.count = 0;
	}
	get last()
	{
		return this.characters[this.count-1];
	}
	set last(newChar)
	{
		this.characters[this.count-1] = newChar;
	}
	push(newChar)
	{
		newChar.index = this.count;
		this.characters.push(newChar);
		this.count++;
	}
	getHalfLetters()
	{
		let halfLetters = this.characters.filter(function (thisChar) {
			return thisChar.isHalfLetter();
		});
		return halfLetters;
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
	get text()
	{
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
        console.log(oLine.getHalfLetters());
        oPoem.pushLine(oLine);
    }
    console.log(oPoem);
}