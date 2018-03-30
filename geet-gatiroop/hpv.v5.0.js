  var charW = 24;
  var charH = 24;
  var paddingLeft = 10;
  var lineSpacing = 7;
  var mode = "analyze";
  var showText = true;
  var prevText = "";
  var prevBaseCount = 1;
  var fLineSpacing = true;
  var fFreeVerse = false;
  var selWord = 1;
  var chars = [];
  var meterForm = [];
  var maxLen = 0;
  var maxLineLen = 0;
  var compositeLinesMarkingA = [];
  var fGhazal = false;
  var radeef = '';
  var radeefArray = [];
  var radeefTruncated = 0;
  var fMeterForm = false;

  function Alphabet(str)
  {
    this.str = str;
    this.charCode = str.charCodeAt(0);
    this.num = 0;
    this.isVowel = false;
    switch(str) // assign number and set vowel if vowel
    {
      case " ": case ",": case "ँ": case "-":
        this.num = -10;
        break;
      case "क": case "ख": case "ख़": case "ग": case "घ": case "ग़": case "ङ":
        this.num = 1;
        break;
      case "च": case "छ": case "ज": case "झ": case "ञ": case "ज़":
        this.num = 2;
        break;
      case "ट": case "ठ": case "ड": case "ढ": case "ण": case "ड़": case "ढ़":
        this.num = 3;
        break;
      case "त": case "थ": case "द": case "ध": case "न": case "ं":
        this.num = 4;
        break;
      case "प": case "फ": case "ब": case "भ": case "म": case "फ़":
        this.num = 5;
        break;
      case "य": case "र": case "ल": case "व":
        this.num = 6;
        break;
      case "श": case "ष": case "स": case "ह":
        this.num = 7;
        break;
      case "अ": 
        this.num = 1;
        this.isVowel = true;
        break;
      case "आ": case "ा":
        this.num = 2;
        this.isVowel = true;
        break;
      case "इ": case "ि":
        this.num = 3;
        this.isVowel = true;
        break;
      case "ई": case "ी":
        this.num = 4;
        this.isVowel = true;
        break;
      case "उ": case "ु":
        this.num = 5;
        this.isVowel = true;
        break;
      case "ऊ": case "ू":
        this.num = 6;
        this.isVowel = true;
        break;
      case "ए": case "े":
        this.num = 7;
        this.isVowel = true;
        break;
      case "ऐ": case "ै":
        this.num = 8;
        this.isVowel = true;
        break;
      case "ओ": case "ो":
        this.num = 9;
        this.isVowel = true;
        break;
      case "औ": case "ौ":
        this.num = 10;
        this.isVowel = true;
        break;
      case "ृ": 
        this.num = 11;
        this.isVowel = true;
        break;
      case "1": case "2":
        this.num = 12;
        break;
      default:
        this.num = -1;
    }
  }

  function Letter(str)
  {
    this.consonant = new Alphabet(str);
    this.vowel = '';
    this.ownWidth = 0;
    this.cumulativeWidth = 0;
    this.radeefKaafiyaa = '';

    // set vowel
    var charC = str.charCodeAt(0);
    // space / comma ---- OR vowel
    if (((charC == 32)||(charC == 44)) || ((charC >= 2309) && (charC <= 2324)))
    {
      this.vowel = new Alphabet(str);
    }

    // consonant ---- OR consonant with dot at bottom
    if (((charC >= 2325) && (charC <= 2361)) || ((charC >= 2392) && (charC <= 2399)))
    {
      this.vowel = new Alphabet("अ");
    }

    // anusvaar (the bindi on top) which sometimes is short-cut for half letter
    if (charC == 2306) 
    {
      this.vowel = new Alphabet("्");
    }

    // the number 1 - for maapanee
    if (charC == 49)
    {
      this.vowel = new Alphabet("अ");
    }

    // the number 2 - for maapanee
    if (charC == 50)
    {
      this.vowel = new Alphabet("आ");
    }

    // define setOwnWidth function
    // set individual width as per vowel
    this.setOwnWidth = function() {
      switch (this.vowel.num)
      {
        case 1: case 3: case 5: case 11:
          this.ownWidth = 1;
          break;
        case 2: case 4: case 6: case 8: case 10: case 7: case 9: case 10:
          this.ownWidth = 2;
          break;
      }
    }

    // execute setOwnWidth
    this.setOwnWidth();
  }

  Letter.prototype.changeVowel = function(vowel, charcode)
  {
    if (charcode == 2364) // nukta, not really vowel
    {
      this.consonant.str = this.consonant.str + vowel;
      return;
    }
    if (charcode == 2365) // avagraha, not really vowel, just ignore
    {
      return;
    }
    this.vowel = new Alphabet(vowel);
    this.setOwnWidth();
  }

  Letter.prototype.setCumulativeWidth = function(cumWidth) {
    this.cumulativeWidth = cumWidth;
  };


  // this is where the beauty manifestation starts!
  function visualize()
  {
    splitNprocessPoem();

    if (fFreeVerse)
      initializeCompositeLines();

    if (fGhazal)
    {
      calculateRadeef();
      calculateKaafiyaa();
    }

    addMeter();
    console.log(chars);

    draw();
    document.getElementById("divControls").style.display = "block";
  }


  // process the meter given by user and add to meterForm
  // much like it is done to split and process the poem itself
  function addMeter()
  {
    var meter = document.getElementById("meter").value;
    console.log(meter);
    if (meter.length == 0) 
      return;
    else
      fMeterForm = true;
    meterForm = [];
    var charCount = 0;

    for (k=0;k<meter.length;k++)
    {
      charCode = meter.charCodeAt(k);
      len = meter.length; // existing #of-chars - to add the next char
      if ((charCode >= 2364) && (charCode <= 2381)) // maatraa, nukta or avagraha
      {
        // new element not added to array
        // the vowel part of previous element 
        // modified to update maatraa
        // console.log(meterForm);
        // console.log(meterForm[charCount-1]);
        // console.log(k);
        meterForm[charCount-1].changeVowel(meter.substring(k,k+1),charCode);
      }
      else // not maatraa - true new char
      {
        var thisC = meter.substring(k,k+1); //this character
        meterForm[charCount] = new Letter(thisC);
        charCount++;
      }       
    }

    // now iterate through the line again 
    // and assign cumulative length
    // it is assumed that there is no half letter
    for (k=0;k<meterForm.length;k++)
    {
      // assign cumulative length
      if (k == 0)
      { meterForm[k].cumulativeWidth = meterForm[k].ownWidth; }
      else
      { meterForm[k].cumulativeWidth = meterForm[k-1].cumulativeWidth + meterForm[k].ownWidth; }
    }

    // evaluate each line of poem -- is it as per meter?
    for (line=0;line<chars.length;line++) // poem line
    {
      var ltrToStartAt = 0;
      var ok = '';
      for (k=0;k<meterForm.length;k++) // meter letter
      {
        ok = '';
        console.log(meterForm[k]);
        console.log(ltrToStartAt);
        if (meterForm[k].ownWidth == 1)
        {
          var ltr;
          for (ltr=ltrToStartAt;ltr<chars[line].length;ltr++) // poem letter
          {
              console.log('ltr '+ltr);
              if (chars[line][ltr].ownWidth == 1)
                ok = 'yes';
              if (chars[line][ltr].ownWidth == 2)
                ok = 'no';
              if (ok !== '') // ok has become yes or no
              {
                ltrToStartAt = ltr+1;
                break;
              }
          } // end poem letter
        }
        console.log('meter letter '+k+ok);
        if (ok == 'no') // meter not met for line - break meter loop
        {
          break;
        }
      } // end meter letter
      console.log('line '+line+ ok); // print whether meter met for line
    }

    // console.log(meterForm);

  }

  // sometimes the consonant char may be a pure vowel
  function joinCharConsonantVowel(c,v) 
  {
    if (c==v)
      return v; // c is also a vowel - like आ आ
    if (v == 'अ')
      return c; // could be a case of न अ 
    return c+v;
  }



  function originalVowel(c)
  {
    switch(c)
    {
      case " ": case ",":
        return "";
        break;
      case "अ": 
        return "अ";
        break;
      case "आ": case "ा":
        return "आ";
        break;
      case "इ": case "ि":
        return "इ";
        break;
      case "ई": case "ी":
        return "ई";
        break;
      case "उ": case "ु":
       return "उ";
        break;
      case "ऊ": case "ू":
        return "ऊ";
        break;
      case "ए": case "े":
        return "ए";
        break;
      case "ऐ": case "ै":
        return "ऐ";
        break;
      case "ओ": case "ो":
        return "ओ";
        break;
      case "औ": case "ौ":
        return "औ";
        break;
      case "ृ":
        return "ृ";
        break;
      default:
        return -1;
    }
    return -1;
  }




  // separate each line and character
  function splitNprocessPoem()
  {
    var pom = document.getElementById("pom").value;
    var lines = pom.split("\n");
    var oldLines = prevText.split("\n");
    var i = 0, k = 0;
    var charCode = 0;
    var len = 0;
    maxLineLen = lines.length;
    for (i = 0; i < maxLineLen; i++) // process each line - i = line index
    {
      // do not process old lines
      if ((i < oldLines.length) && (oldLines[i] == lines[i]))
      {
        // in the list of characters of the line
        // last element added with val "old"
        chars[i][chars[i].length] = "old";
      }
      else  
      // process only new edited lines
      // go through each character in the line and handle differently
      // based on what category of character it is
      // to set first 2 info slots
      {
        chars[i] = [];
        for (k=0;k<lines[i].length;k++) // process each char: k = char index
        {
          charCode = lines[i].charCodeAt(k);
          len = chars[i].length; // existing #of-chars - to add the next char
          // console.log(charCode);
          // console.log(lines[i].substring(k,k+1));
          if ((charCode >= 2364) && (charCode <= 2381)) // maatraa, nukta or avagraha
          {
            // new element not added to array
            // the vowel part of previous element 
            // modified to update maatraa
            chars[i][len-1].changeVowel(lines[i].substring(k,k+1),charCode);
          }
          else // not maatraa - true new char
          {
            var thisC = lines[i].substring(k,k+1); //this character
            chars[i][len] = new Letter(thisC);
          }          
        }

        chars[i][chars[i].length] = "new"; // last element, the marker "new"

      }
    }
    // now iterate through the whole chars structure again 
    // and assign lengths for new lines
    // lengths for individual characters and cumulative length
    // for whole line
    // this is the place where the default length for half maatraa 
    // is also determined
    // refactor note: maybe this loop can be merged with the above loop
    // to prevent needless iteration - but the code should not become too
    // unwieldly 
    for (i = 0; i < chars.length; i++)
    {
      // calculate lengths - individual and cumulative
      if (chars[i][chars[i].length-1] == "new")
      {
        for (k=0;k<chars[i].length-1;k++)
        {
          // if vowels are not there, most likely half maatraa
          if (chars[i][k].vowel.num == -1)
          {
            // decide half maatraa length
            if (k == 0) // first letter of line
            {
              if (k == chars[i].length-2) // last letter of line
              {
                chars[i][k].ownWidth = halfLetterLen(0,chars[i][k],0);
              }
              else  // not last letter
              {
                chars[i][k].ownWidth = halfLetterLen(0,chars[i][k],chars[i][k+1]); 
              }
            }
            else  // not first letter
            {
              if (k == chars[i].length-2) // last letter of line
              {
                chars[i][k].ownWidth = halfLetterLen(chars[i][k-1],chars[i][k],0);
              }
              else  // not last letter
              {
                chars[i][k].ownWidth = halfLetterLen(chars[i][k-1],chars[i][k],chars[i][k+1]); 
              }
            }
          }
          // assign cumulative length
          if (k == 0)
          { chars[i][k].setCumulativeWidth(chars[i][k].ownWidth); }
          else
          { chars[i][k].setCumulativeWidth(chars[i][k-1].cumulativeWidth + chars[i][k].ownWidth); }
        }

        // if last cumulative length greater than currently
        // saved maxLen, then update maxLen

        if ((chars[i][k-1] !== undefined) && (chars[i][k-1].cumulativeWidth > maxLen))
        {
          maxLen = chars[i][k-1].cumulativeWidth;
        }
      }
      chars[i].pop();
    }
    // truncate removed lines from chars structure
    // if now "pom" has lesser lines
    if (lines.length < chars.length)
    {
      chars.length = lines.length;
    }
    // console.log(chars);
    prevText = pom;
  }

  // color determined by consonant
  function conColor(c) {
    var color = "";
    var fillOp = "0.7";
    if (c.isVowel)
      color = "grey";
    else
    {
      switch(c.num)  // which consonant
      { 
        case 0: // vowel
          color = "grey";
          break;
        case 1: // ka kha ga ...
          color = "rgb(255,0,0)"; //red
          fillOp = "0.65"
          break;
        case 2: // cha chha ja jha ...
          color = "rgb(255,165,0)"; // orange
          break;
        case 3: // Ta THa Da Dha ...
          color = "rgb(255,255,0)"; // yellow
          break;
        case 4: // ta tha da dha ...
          color = "rgb(0,255,0)"; // green
          // fillOp = "1.0";
          break;
        case 5: // pa pha ba bha
          color = "rgb(0,220,255)"; // blue
          // fillOp = "1.0";
          break;
        case 6: // ya ra la va
          color = "rgb(0,64,255)";  // indigo
          break;
        case 7: // sha sha sa ha
          color = "rgb(143,0,255)"; // violet
          break;
        case 11: 
          color = white;
          break;
        default:
          color = "black";
      }
    }
    return [color,fillOp];
  }

  // style of char blocks - including color
  // c - the character to be styled
  // showConColor - boolean - whether the color is to be displayed or not
  function styleCharBlock(c,colorBy)
  {

    // "c" is the character array
    // 0: the alphabet
    // 1: the maatraa
    // 2: vowel or consonant - if vowel: 0, if consonant, which consonant line
    // 3: whicheth vowel
    // 4: individual length
    // 5: cumulative length
    // 6: this index may or may not exist - indicating radeef(r) or kaafiyaa (k)
    if (c.num === -10) // do not display space, comma
      return "display: none";

    var color = "white";
    var strokeOp = "0.3";
    var strokeW = 1;
    var fillOp = "0.7";

    // call conColor to determine color and opacity as per consonant
    if (colorBy == 'consonant')
    {
      var conColorResult = conColor(c.consonant);
      color = conColorResult[0];
      fillOp = conColorResult[1];
    }
    if ((colorBy == 'ghazal') && (c.radeefKaafiyaa !== ''))
    {
      if (c.radeefKaafiyaa == 'r') // is a radeef char
      {
        color = "rgb(0,220,255)"; // blue
        // fillOp = "1.0";
      }
      if (c.radeefKaafiyaa == 'k') // is a kaafiyaa char
      {
        color = "rgb(0,255,0)"; // green
        // fillOp = "1.0";
      }
    }
    
    // unknown vowel, individual length unknown/0
    // what are some examples when this occurs?
    // 1 eg. ऋ as in rishi
    // any other examples? 
    if ((c[3] == -1) && (c[4] == 0))
    {
      //console.log(c);
      color = "black";
      strokeOp = "1";
      fillOp = "0.7";    
    }
    style = "fill: "+color+"; fill-opacity: " + fillOp + ";stroke:black; stroke-width: "+strokeW+"; stroke-opacity: "+strokeOp;
    if ((c.ownWidth == 0) && (c.vowel.num == -10))
      style += ";visibility:hidden";
    return style;
  }
  
  // shapes' shape determined by vowel
  function vowPath(d,i)
  {
    var p = "";
    var x = ((d.cumulativeWidth-d.ownWidth)*charW);  // what is x?
    var w = charW*d.ownWidth;
    var h = charH;
    switch(d.vowel.num)  // which vowel
    {
      case -1: // unknown
        if (d.ownWidth == 0)
        {
          //p = "M"+x+",0m0,3a3,3 0 1,1 0,-6a3,3 0 1,1 0,6z";
          w = 4;  // *** why is this hardcoded
          h = 4;  // *** why is this hardcoded
          x = x-2;  // what is this?
          p = "M"+x+",0 L"+x+",-"+h + " L"+(x+w)+",-"+h+" L"+(x+w)+",0 z";
        }
        if (d.ownWidth == 1)
        {
          p = "M"+x+",0 L"+x+","+h + " L"+(x+w)+","+h+" L"+(x+w)+",0 z";
        }
        break;
      case 1: case 2: case 11: // a aa ri
        p = "M"+x+",0 L"+x+","+h + " L"+(x+w)+","+h+" L"+(x+w)+",0 z";
        break;
      case 3: // इ
        p = "M"+x+","+h+" L"+x+","+(h/2)+" L"+(x+(w/2))+",0"+" L"+(x+w)+","+(h/2)+" L"+(x+w)+","+h+" z";
        break;
      case 4: // ई
        p = "M"+x+","+h+" L"+(x+(w/2))+",0"+" L"+(x+w)+","+h+" z";
        break;
      case 5: // उ
        //M20,180 L20,190 A10,10 0 0,0 40,190 L40,180 z
        p = "M"+x+",0 L"+x+","+(h/2)+"A"+(w/2)+","+(w/2)+" 0 0,0 "+(x+w)+","+(h/2)+" L"+(x+w)+",0 z";
        break;
      case 6: // ऊ
        if (w == charW)
          p = "M"+x+",0 A"+(w/2)+","+w+" 0 0,0 "+(x+w)+",0 z";  
        else
          p = "M"+x+",0 A"+(w/2)+","+(w/2)+" 0 0,0 "+(x+w)+",0 z";
        break;
      case 7: // ए
        p = "M"+x+",0 L"+x+","+h+" L"+(x+w)+","+h+" L"+(x+w)+","+(h/2)+" z";
        break;
      case 8: // ऐ
        p = "M"+x+",0 L"+x+","+h+" L"+(x+w)+","+h+" z";
        break;
      case 9: // ओ
        p = "M"+x+","+h+" L"+x+","+(h/2)+"A"+(w/2)+","+(h/2)+" 0 0,1 "+(x+w)+","+(h/2)+" L"+(x+w)+","+h+" z";
        break;
      case 10: // औ
        p = "M"+x+","+h+" A"+(w/2)+","+h+" 0 0,1 "+(x+w)+","+h+" z";
        break;
      default: // unknown
        p = "M"+x+",0 L"+x+","+h + " L"+(x+w)+","+h+" L"+(x+w)+",0 z";
        break;
    }
    return p;
  }

  // chars array structure
  // 1st d: line - array
  // 2nd d: the alphabet units - array
  // 3rd d: 6 element info about each alphabet
  // 0: the alphabet
  // 1: the maatraa
  // 2: vowel or consonant - if vowel: 0, if consonant, which consonant line
  // 3: whicheth vowel
  // 4: individual length
  // 5: cumulative length

  // when user clicks char to reassign length
  function adjustCharLen()
  {
    //console.log("adj");
    var k = parseInt(this.getAttribute("id").substring(4)); // whicheth letter in line
    var i = parseInt(this.parentNode.getAttribute("id").substring(5)); // whicheth line
    var kk = 0;
    // if letter has a deergh swar (even vowel number or any vowel above ऊ (num = 6))
    if ((chars[i][k].vowel.num%2 == 0) || ((chars[i][k].vowel.num>6) && (chars[i][k].vowel.num<11)))
    {
      if (chars[i][k].ownWidth == 1) //if vowel set to width one, make it two
      {
        chars[i][k].ownWidth = 2;
        // increase cumulative length of subsequent letters in line by one
        for (kk = k; kk < chars[i].length; kk++) 
          chars[i][kk].cumulativeWidth = chars[i][kk].cumulativeWidth+1;
        if (chars[i][kk-1].cumulativeWidth > maxLen) // adjust maxLen if required
            maxLen = chars[i][kk-1].cumulativeWidth;
        draw();
        return;
      }
      if (chars[i][k].ownWidth == 2) //if vowel set to width two, make it one
      {
        chars[i][k].ownWidth = 1;
        // decrease cumulative length of subsequent letters in line by one
        for (kk = k; kk < chars[i].length; kk++)
          chars[i][kk].cumulativeWidth = chars[i][kk].cumulativeWidth-1;
        draw();
        return;
      }
    }
    if (chars[i][k].vowel.num == -1) // half letter
    {
      if (chars[i][k].ownWidth == 0)
      {
          chars[i][k].ownWidth = 1;
          for (kk = k; kk < chars[i].length; kk++)
            chars[i][kk].cumulativeWidth = chars[i][kk].cumulativeWidth+1;
          if (chars[i][kk-1].cumulativeWidth > maxLen)
            maxLen = chars[i][kk-1].cumulativeWidth;
          draw();
          return;
      }
      if (chars[i][k].ownWidth == 1)
      {
          chars[i][k].ownWidth = 0;
          for (kk = k; kk < chars[i].length; kk++)
            chars[i][kk].cumulativeWidth = chars[i][kk].cumulativeWidth-1;
          draw();
          return;
      }
    }
  }

  function initializeCompositeLines()
  {
    for (i = 0; i < chars.length; i++)
    {
      compositeLinesMarkingA[i] = [];
      if (chars[i].length>0)
      {
        compositeLinesMarkingA[i][0] = chars[i][chars[i].length-1][5];  // total count of individual line
        compositeLinesMarkingA[i][1] = false; // is or is not composite
      }
      else
      {
        compositeLinesMarkingA[i][0] = 0;
        compositeLinesMarkingA[i][1] = false;
      }
    }
  }

  function calculateCompositeLines()
  {
    var compositeInProgress = false;
    var compositeLines = [];
    if (chars.length > 1)
    {
      for (i = 1; i < chars.length; i++)
      {
        if (compositeLinesMarkingA[i][1])  // is part of composite line
        {
          if (!compositeInProgress) // new composite line
          {
            compositeInProgress = true;
            var len = compositeLines.length;
            compositeLines[len] = [];
            compositeLines[len][0] = i-1; // starting position, line index is the *previous*
            compositeLines[len][1] = chars[i-1][chars[i-1].length-1].cumulativeWidth;  // total maatraa count of prev (starting) line
            compositeLines[len][1] += chars[i][chars[i].length-1].cumulativeWidth; // add total maatraa count of current line
          }
          else // in progress composite line
          {
            // just add to in progress composite line
            var len = compositeLines.length;
            //console.log(i);
            compositeLines[len-1][1] += chars[i][chars[i].length-1].cumulativeWidth;
          }
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
    if (compositeLines.length > 0)
      return compositeLines;
    else
      return false;
  }

  // when free verse suppport is on
  // allows users to join multiple lines together for 
  // getting total maatraa count of a set of lines
  function markCompositeLineTextDash()
  {
    // line clicked
    var i = parseInt(this.parentNode.getAttribute("id").substring(5));
    
    // if anything before last line
    // if not marked as composite
    if ((i < compositeLinesMarkingA.length-1) && (!compositeLinesMarkingA[i+1][1]))
    {
      compositeLinesMarkingA[i+1][1] = !compositeLinesMarkingA[i+1][1]; 
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
      compositeLinesMarkingA[i][1] = !compositeLinesMarkingA[i][1]; 
      draw();
    } 
  }

  function calculateRadeef() 
  {
    radeef = '';
    radeefArray = [];
    radeefTruncated = 0;

    var radeef1, radeef2;
    var linelen1,linelen2;
    var linelen1 = chars[0].length;
    var linelen2 = chars[1].length;

    var foundRadeefEnd = false;
    var i = linelen1 - 1; // first line index
    var j = linelen2 - 1; // second line index

    while ((!foundRadeefEnd) && (i >= 0) && (j >= 0))
    {
      radeef1 = joinCharConsonantVowel(chars[0][i].consonant.str,chars[0][i].vowel.str);
      radeef2 = joinCharConsonantVowel(chars[1][j].consonant.str,chars[1][j].vowel.str);

      if (radeef1 == radeef2)
      {
        radeef = radeef1 + radeef;
        radeefArray[radeefArray.length] = [];
        radeefArray[radeefArray.length - 1][0] = chars[0][i].consonant.str;
        radeefArray[radeefArray.length - 1][1] = chars[0][i].vowel.str;
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
    var realRadeef = radeef.substr(radeef.indexOf(' ')+1);
    // console.log(radeef);

    // truncate radeefArray too
    // if clause implies a truncation did occur in the above substr code, and hence array has to be truncated 
    if (radeef !== realRadeef) 
    {
      radeefTruncated = 1;
      for (i = radeefArray.length - 1; i >= 0 ; i--) 
      {
        if (radeefArray[i][0] == " ") break;
      }
      radeefArray.length = i;
      radeef = realRadeef;
    }
    
    // the characters in this radeefArray is in reverse order
    // console.log('radeef array');
    // console.log(radeefArray);
    var radeefArrayLen = radeefArray.length;
    // now mark radeef chars in all relevant lines
    for (var i = 0; i < chars.length; i++) {
      // console.log(i);
      var supposedlyRelevantLine = false;
      // first 2 lines
      if (i<=1) supposedlyRelevantLine = true;
      // intermediate line followed by blank line
      if ((i>1) && (i<(chars.length-1)) && (chars[i+1].length==0)) supposedlyRelevantLine = true;
      // last line
      if (i==(chars.length-1)) supposedlyRelevantLine = true;
      var linelen = chars[i].length;
      if ((supposedlyRelevantLine) && (linelen > radeefArrayLen))
      {
        
        for (var j = 0; j < radeefArrayLen; j++) {
          if ((radeefArray[j][0] == chars[i][linelen-1-j].consonant.str) && (radeefArray[j][1] == chars[i][linelen-1-j].vowel.str))
            chars[i][linelen-1-j].radeefKaafiyaa = 'r';
          else
            break;
        }
        // console.log('line '+i);
        // console.log(chars[i]);
        // break;
      }
    }

    console.log(radeef);
    console.log(chars);
  }

  function calculateKaafiyaa()
  {
    var radeefArrayLen = radeefArray.length;
    var foundKaafiyaaEnd = false;
    var kaafiyaa,kaafiyaa1, kaafiyaa2;
    var kaafiyaaArray = [];
    var linelen1 = chars[0].length;
    var linelen2 = chars[1].length;
    var i = linelen1 - 1 - radeefArrayLen; // first line index
    var j = linelen2 - 1 - radeefArrayLen; // second line index
    var v1,v2;

    while ((!foundKaafiyaaEnd) && (i >= 0) && (j >= 0))
    {

      kaafiyaa1 = originalVowel(chars[0][i].vowel.str);

      kaafiyaa2 = originalVowel(chars[1][j].vowel.str);
      // console.log(kaafiyaa1);
      // console.log(kaafiyaa2);
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
    if (kaafiyaaArray[0]==" ")
      kaafiyaaArray.splice(0,1);
    console.log(kaafiyaaArray);

    var kaafiyaaArrayLen = kaafiyaaArray.length;
    var radeefArrayLen = radeefArray.length;

    // now mark kaafiyaa chars in all relevant lines
    for (var i = 0; i < chars.length; i++) {
      // console.log(i);
      var supposedlyRelevantLine = false;
      // first 2 lines
      if (i<=1) supposedlyRelevantLine = true;
      // intermediate line followed by blank line
      if ((i>1) && (i<(chars.length-1)) && (chars[i+1].length==0)) supposedlyRelevantLine = true;
      // last line
      if (i==(chars.length-1)) supposedlyRelevantLine = true;
      var linelen = chars[i].length;
      if ((supposedlyRelevantLine) && (linelen > (radeefArrayLen+kaafiyaaArrayLen+radeefTruncated)))
      {
        
        for (var j = 0; j < kaafiyaaArrayLen; j++) {
          if (kaafiyaaArray[j] == originalVowel(chars[i][linelen-1-radeefArrayLen-radeefTruncated-j].vowel.str))
            chars[i][linelen-1-radeefArrayLen-radeefTruncated-j].radeefKaafiyaa = 'k';
          else
            break;
        }
        // console.log('line '+i);
        // console.log(chars[i]);
        // break;
      }
    }
  }

  // helper for draw function to place text in correct position
  function charTxtPos(d,i)
  {
    var x = ((d.cumulativeWidth-d.ownWidth)*charW);
    //console.log(d[5]);
    var w = charW*d.ownWidth;
    return x+(w/2);
  }

  // helper for draw function to show text
  function charTxt(d)
  {
    var txt = "";
    if (d.consonant.num != -10)  // non hindi character
    {
      //if ((d[2] == 0)||(d[3] == 1))
      if (d.consonant.isVowel)
      {
        txt = d.consonant.str;
      }
      else
      {
        if (d.vowel.num == 1)
          txt = d.consonant.str;
        else
          txt = d.consonant.str+d.vowel.str;
      }
    }
    if (d.consonant.num == 12) // chars "1" or "2"
      txt = d.consonant.str;
    return txt;
  }

  // determine when half letter will have 0 or 1 maatraa
  // the logic for default handling - which the user can always override
  // p = previous letter (consonant+vowel array structure)
  // c = current letter (consonant+vowel array structure) - for which the len is to be 
  // determined
  // n = next letter (consonant+vowel array structure)
  function halfLetterLen(p,c,n)
  {

    if (p === 0)  // no previous letter, half maatraa is first letter of line
      return 0;
    // no previous letter, half maatraa is first letter of word
    if (p.consonant.num === -10) 
    {
      return 0;
    }

    // special combinations ----------------
    if ((c.consonant.str == "म") && (n.consonant.str == "ह"))
      return 0;
    if ((c.consonant.str == "न") && (n.consonant.str == "ह"))
      return 0;
    // end special combinations ------------

    pLD = ""; // previous is laghu or deergha; 
    nLD = ""; // next is laghu or deergha;

    switch (p.vowel.num) // previous vowel code
    {
      case 1: case 3: case 5: case 11: // previous letter is laghu
        pLD = "l";
        break;
      case 2: case 4: case 6: case 8: case 10: case 7: case 9: case 10:
        pLD = "d";
        break;
    }
    if (pLD === "l") // previous is laghu
    {
      return 1;
    }
    switch (n.vowel.num) // next vowel code
    {
      case 1: case 3: case 5: case 11: // next letter is laghu
        nLD = "l";
        break;
      case 2: case 4: case 6: case 8: case 10: case 7: case 9: case 10:
        nLD = "d";
        break;
    }
    if ((pLD === "d") && (nLD === "d")) // both side deergha
    {
      return 1;
    }
    return 0;
  }

  function drawCompositeLine(drawWhat,i)
  {
    //console.log(i);
    //var i = parseInt(this.parentNode.getAttribute("id").substring(5));
    if (drawWhat == "x1")
    {
      if (i==0)
        return charW*maxLen+(charW*2);
      if (compositeLinesMarkingA[i][1])
        return charW*maxLen+(charW*2.3);        
      else
        return charW*maxLen+(charW*2);
    }
    if (drawWhat == "y1")
    {
      if (compositeLinesMarkingA[i][1])
      {
        if (fLineSpacing)
          return -3;
        else
          return 0;
      }               
      else
        return charH;
    }
    if (drawWhat == "styleSmall")
    {

      if (compositeLinesMarkingA[i][0] == 0)  // empty line
        return "display:none;";

      return "stroke:black;stroke-width:4;"
    }
    if (drawWhat == "styleMain")
    {

      if ((compositeLinesMarkingA[i][0] == 0) || (!compositeLinesMarkingA[i][1]))  // empty line || not composite
        return "display:none;";

      return "stroke:black;stroke-width:4;"
    }
    if (drawWhat == "styleCompositeLineMaatraa")
    {
      var baseC = parseInt(document.getElementById("baseCount").value);
      if (baseC > 0)
      {
        if ((i[1] % baseC) == 0)
        {
          return "fill:black";
        }
        else
        {
          return "fill:red";
        }
      }
      return "fill:black";
    }
    if (drawWhat == "compositeRemainderValue")
    {
      var baseC = parseInt(document.getElementById("baseCount").value);
      if (baseC > 1)
      {
        var remainder = i[1] % baseC;
        if (remainder != 0)
        {
          var result = i[1]/baseC;
          var whole = parseInt(result);
          var remainderInDecimal = result - whole;
          if (remainderInDecimal <= 0.5)
            return "+"+remainder;
          else
            return "-"+(((whole+1)*baseC)-i[1]);
        }
      }
      return "";
    }
  }

  // the D3 draw dance!
  function draw()
  {
     var chart = d3.select("#chart");
     chart.select("svg").remove();
     var chartHeight = ((maxLineLen*(charW+7))+(charW+7))+charW;
     if (fMeterForm)
        chartHeight += 2*(charH+lineSpacing);
     var svg = chart.append("svg")
                  .attr("width", function() {return (fFreeVerse?charW*maxLen+120:charW*maxLen+100);})
                  .attr("height", chartHeight)
                  .attr("style","border: solid 1px #ddd;");

    var gPoem;

    if (fMeterForm)
    {
      gMeterForm = svg.append("svg:g")
                    .attr("transform", function(d,i) 
                    { 
                      return "translate(" + paddingLeft + "," + (charH+lineSpacing) + ")"; 
                    })          
                    .attr("id", "gMeterForm");
      gMeterForm.selectAll("text")               // char text
          .data(meterForm)
          .enter().append("svg:text")
            .attr("y", charH-2)
            .attr("x", function(d,i) {return charTxtPos(d);})
            .attr("class", "graphText3")
            //.attr("dominant-baseline", "central")
            .attr("text-anchor", "middle")
            .text(function(d) {return charTxt(d);});
      gMeterForm.selectAll("path") // assuming only one line in meterForm
        .data(meterForm)
        .enter().append("path")
          .attr("id", function(d,i) {return "char"+i})
          .attr("style", "stroke:black; stroke-width: 1; stroke-opacity: 0.3;fill:white; fill-opacity: 0.7")
          .attr("d", function(d,i) {return vowPath(d,i);})
          .attr("title", function(d,i) {return d[0]+d[1];});
      gMeterForm.append("svg:text")            // line total maatraa
        .attr("y", charH)
        .attr("x", function(d) {return charW*maxLen+charW;})
        //.attr("dominant-baseline", "central")
        .attr("class", "graphText3")
        .text(function() { return (meterForm.length > 0) ? meterForm[meterForm.length-1].cumulativeWidth : "";});

      gPoem = svg.append("svg:g")
                  .attr("transform", function(d,i) 
                  { 
                    return "translate(" + 0 + "," + (2*(charH+lineSpacing)) + ")"; 
                  })
                  .attr("id", "gPoem");
    }
    else
    {
      gPoem = svg.append("svg:g")
                  .attr("id", "gPoem");
    }

    


    // create the "g"s (svg groups) for each line
    if (fLineSpacing)
    {
      var g = gPoem.selectAll("g")
        .data(chars)
        .enter().append("svg:g")
          .attr("transform", function(d,i) 
            { 
              return "translate(" + paddingLeft + "," + ((i*(charH+lineSpacing))+(charH+lineSpacing)) + ")"; 
            })
          .attr("id", function(d,i) { return "gLine"+i});
    }
    else
    {
      var g = gPoem.selectAll("g")
        .data(chars)
        .enter().append("svg:g")
          .attr("transform", function(d,i) 
            { return "translate(" + paddingLeft + "," + ((i*(charH))+(charH)) + ")" })
          .attr("id", function(d,i) { return "gLine"+i});
    }

    if (showText)
    {
        g.selectAll("text")               // char text
          .data(function(d) {return d;} )
          .enter().append("svg:text")
            .attr("y", charH-2)
            .attr("x", function(d,i) {return charTxtPos(d);})
            .attr("class", "graphText3")
            //.attr("dominant-baseline", "central")
            .attr("text-anchor", "middle")
            .text(function(d) {return charTxt(d);});
    }

    g.selectAll("path")
      .data(function(d) {return d;} )
      .enter().append("path")
        .attr("id", function(d,i) {return "char"+i})
        .attr("style", function(d,i) {
          if (fGhazal)
            return styleCharBlock(d,'ghazal');
          else
            return styleCharBlock(d,'consonant');
        })
        .attr("d", function(d,i) {return vowPath(d,i);})
        .attr("title", function(d,i) {return d[0]+d[1];})
        .on("click",adjustCharLen);


    if (fMeterForm)
    {
      svg.selectAll("line")
        .data(meterForm)
        .enter().append("line")
          .attr("x1", function(d,i) {return paddingLeft+((d.cumulativeWidth)*charW);})
          .attr("y1", function(d,i) {return charH+2;})
          .attr("x2", function(d) {return paddingLeft+((d.cumulativeWidth)*charW)})
          .attr("y2", (charH+lineSpacing)*(maxLineLen+3))
          .attr("style", "stroke:blue;stroke-width:1;")
          .attr("stroke-dasharray","5,3");

    }
    
    // line total maatraa
    if (fFreeVerse) // line maatraa count numbers are clickable
    {
      g.append("svg:text")            // line total maatraa
      .attr("y", charH)
      .attr("x", function(d) {return charW*maxLen+charW;})
      //.attr("dominant-baseline", "central")
      .attr("class", "graphText3")
      .text(function(d) { return (d.length > 0) ? d[d.length-1].cumulativeWidth : "";})
      .on("click",markCompositeLineTextDash);

      // small dash beside maatraa count
      g.append("svg:line")
        //.attr("x1", function(d) {return charW*maxLen+(charW);})
        .attr("x1", function(d,i) {return charW*maxLen+(charW*2);})
        .attr("y1", function(d,i) {return charH+2;})
        .attr("x2", function(d) {return charW*maxLen+(charW*2.3);})
        .attr("y2", charH+2)
        .attr("style", function(d,i) {return drawCompositeLine("styleSmall",i);})
        .on("click",markCompositeLineTextDash);

      // composite line marker
      g.append("svg:line")
        //.attr("x1", function(d) {return charW*maxLen+(charW);})
        .attr("x1", function(d,i) {return drawCompositeLine("x1",i);})
        .attr("y1", function(d,i) {return drawCompositeLine("y1",i);})
        .attr("x2", function(d) {return charW*maxLen+(charW*2.3);})
        .attr("y2", charH+2)
        .attr("style", function(d,i) {return drawCompositeLine("styleMain",i);})
        .on("click",unmarkCompositeLine);

      // composite line total maatraa
      drawCompositeNumbers();
    }    
    else  // normal - numbers are not clickable
    {
      g.append("svg:text")            // line total maatraa
      .attr("y", charH)
      .attr("x", function(d) {return charW*maxLen+charW;})
      //.attr("dominant-baseline", "central")
      .attr("class", "graphText3")
      .text(function(d) { return (d.length > 0) ? d[d.length-1].cumulativeWidth : "";});
    }
      
  } // end draw

  function drawCompositeNumbers()
  {
    if (fFreeVerse)
    {
      var dataComposite = calculateCompositeLines();
      var chart = d3.select("#chart");
      var svg = chart.select("svg");
      //console.log("calculated compositeLines");
      //console.log(calculateCompositeLines());
      if (fLineSpacing)
      {
        var compositeLTotal = svg.selectAll(".compositeCountT")
          .data(dataComposite)
          .enter().append("svg:text")
          .attr("y", function(d) {return ((d[0]*(charH+lineSpacing))+(charH+lineSpacing)+charH);})
          .attr("x", function(d) {return paddingLeft + 8 + charW*maxLen+(charW*2);})
          .attr("class", "compositeCountT")
          .attr("style", function(d) {return drawCompositeLine("styleCompositeLineMaatraa",d);})
          .text(function(d) {return d[1];});

        var compositeLRemainder = svg.selectAll(".compositeCountR")
          .data(dataComposite)
          .enter().append("svg:text")
          .attr("y", function(d) {return ((d[0]*(charH+lineSpacing))+(charH+lineSpacing)+charH)+10;})
          .attr("x", function(d) {return paddingLeft + 8 + charW*maxLen+(charW*2)+20;})
          .attr("class", "compositeCountR")
          .attr("style", function(d) {return "fill:red;font-size:80%";})
          .text(function(d) {return drawCompositeLine("compositeRemainderValue",d);});
      }
      else
      {
        var compositeLTotal = svg.selectAll(".compositeCountT")
          .data(dataComposite)
          .enter().append("svg:text")
          .attr("y", function(d) {return ((d[0]*charH)+charH+charH);})
          .attr("x", function(d) {return paddingLeft + 8 + charW*maxLen+(charW*2);})
          .attr("class", "compositeCountT")
          .attr("style", function(d) {return drawCompositeLine("styleCompositeLineMaatraa",d);})
          .text(function(d) {return d[1];});  

        var compositeLRemainder = svg.selectAll(".compositeCountR")
          .data(dataComposite)
          .enter().append("svg:text")
          .attr("y", function(d) {return ((d[0]*charH)+charH+charH)+10;})
          .attr("x", function(d) {return paddingLeft + 8 + charW*maxLen+(charW*2)+20;})
          .attr("class", "compositeCountR")
          .attr("style", function(d) {return "fill:red;font-size:80%";})
          .text(function(d) {return drawCompositeLine("compositeRemainderValue",d);});  
      }
    }
  }

  function redrawCompositeNumbers()
  {
    //console.log("redraw composite numbers");
    d3.selectAll(".compositeCountT").remove();
    d3.selectAll(".compositeCountR").remove();
    drawCompositeNumbers();
  }

  // toggle ShowText control
  function fnShowText()
  {
    showText = !showText;
    document.getElementById("chkShowText").checked = showText;
    draw();
  }

  // toggle Line Spacing control
  function fnLineSpacing()
  {
    fLineSpacing = !fLineSpacing;
    draw();
  }

  // toggle Free Verse support
  function fnFreeVerseSupport()
  {
    fFreeVerse = !fFreeVerse;
    if (fFreeVerse)
    {
      document.getElementById("chkGhazal").disabled = true;
      document.getElementById("spanFreeVerse").style.display = "inline";
      initializeCompositeLines();
    }
    else
    {
      document.getElementById("chkGhazal").disabled = false;
      document.getElementById("spanFreeVerse").style.display = "none";
    }
    draw();
  }

  function fnGhazal()
  {
    fGhazal = !fGhazal;
    if (fGhazal)
    {
      document.getElementById("chkFreeVerse").disabled = true;
      calculateRadeef();
      calculateKaafiyaa();
    }
    else
    {
      document.getElementById("chkFreeVerse").disabled = false;
    }
    
    draw();
  }

  function fnBaseCountChange()
  {
    var baseC = parseInt(document.getElementById("baseCount").value);
    if (baseC > 0)
    {
      if (baseC != prevBaseCount)
      {
        prevBaseCount = baseC;
        if (fFreeVerse)
        {
          redrawCompositeNumbers();
        }
      }
    }
    else
    {
      document.getElementById("baseCount").value = prevBaseCount;
    }
  }

  // minification used: http://jscompress.com/
  // had to fix ग़ ज़ फ़ ड़ ढ़ after that


// Bad + good example for Maapanee
// हो न हो तुम तो कहो
// मेरी सुनो या ना सुनो
// हो कुछ यहाँ गर तुम कहो