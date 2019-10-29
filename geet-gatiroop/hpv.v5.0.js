class classChar {
    // member variables
    // mainChar
    // vowelChar
    // consonantNumber
    // vowelNumber
    constructor(mainChar) {
     this.mainChar = mainChar;
     // setConsonantNumber();
    }
    set vowel(vowelChar) {
      this.vowelChar = vowelChar;
      // setVowelNumber;
    }
    get vowel() {
    	return this.vowelChar;
    }
}

class classLine {
	constructor() {
		this.characters = new Array();
		this.count = 0;
	}
	push(newChar)
	{
		this.characters.push(newChar);
		this.count++;
	}
	get last()
	{
		return this.characters[this.count-1];
	}
	set last(newChar)
	{
		this.characters[this.count-1] = newChar;
	}
}

function visualize()
{
	splitNprocessPoem();
}

function splitNprocessPoem()
{
	var pom = document.getElementById("pom").value;
    var lines = pom.split("\n");
    maxLineLen = lines.length;
    for (i = 0; i < maxLineLen; i++) // process each line - i = line index
    {
    	const oLine = new classLine();
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
				const oChar = new classChar(lines[i].substring(k,k+1));
				
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
        console.log(oLine);
    }

}