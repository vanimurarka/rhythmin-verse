class cChar {
    /* MEMBER VARIABLES
    mainChar
    vowelChar
    consonantNumber
    vowelNumber*/
    constructor(mainChar) {
     this.mainChar = mainChar;
     // this.idx = 0;
     // setConsonantNumber();
    }
    set vowel(vowelChar) {
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
		  case "ृ":
		    this.vowelNumber = 11;
		    break;
		  default:
		    this.vowelNumber = -1;
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
    get vowel() {
    	return this.vowelChar;
    }
    set idx(n) {
    	this.index = n;
    }
    get idx() {
    	return this.index;
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
		newChar.idx = this.count;
		this.characters.push(newChar);
		this.count++;
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
	const oPoem = new cPoem(document.getElementById("pom").value);
    var lines = oPoem.text.split("\n");
    maxLineLen = lines.length;
    debugger;
    for (i = 0; i < maxLineLen; i++) // process each line - i = line index
    {
    	const oLine = new cLine();
        for (k=0;k<lines[i].length;k++) // process each char: k = char index
        {
        	charCode = lines[i].charCodeAt(k);
        	if ((charCode >= 2366) && (charCode <= 2381)) // maatraa
			{
				// new element not added to array
				// the vowel part of previous element 
				// modified to update maatraa
				oLine.last.vowel = lines[i].substring(k,k+1);
			}
			else // not maatraa - true new char
			{
				const oChar = new cChar(lines[i].substring(k,k+1));
				
				// space / comma OR vowel
	            if (((charCode == 32)||(charCode == 44)) || ((charCode >= 2309) && (charCode <= 2324)))
	              oChar.vowel = oChar.mainChar;
	            
	            // consonant OR consonant with dot at bottom
	            if (((charCode >= 2325) && (charCode <= 2361)) || ((charCode >= 2392) && (charCode <= 2399)))
	              oChar.vowel = "अ";

	            // anusvaar (the bindi on top) which sometimes is short-cut for half letter
	            if (charCode == 2306) 
	              oChar.vowel = "्";

	          	oLine.push(oChar);
			}
        }
        oPoem.pushLine(oLine);
    }
    console.log(oPoem);
}