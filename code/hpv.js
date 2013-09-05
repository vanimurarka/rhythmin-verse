  var charW = 24;
  var charH = 24;
  var mode = "analyze";
  var showText = true;
  var prevText = "";
  var lineSpacing = true;
  var selWord = 1;
  function switchMode()
  {
    if (mode == "edit")
    {
      mode = "analyze";
      document.getElementById("chkShowEditables").checked = false;
    }
    else
    {
      mode = "edit";
      document.getElementById("chkShowEditables").checked = true;
    }
    
    draw();
  }
  function fnShowText()
  {
    showText = !showText;
    document.getElementById("chkShowText").checked = showText;
    draw();
  }
  function fnLineSpacing()
  {
    lineSpacing = !lineSpacing;
    draw();
  }
  /*
  function conColor(c)
  {
    if (c[3] === -10) // do not display space, comma
      return "display: none";

    var color = "";
    var strokeOp = "";
    var strokeW = 0;
    switch(c[2])
    {
      case 0:
        color = "grey";
        break;
      case 1:
        color = "rgb(255,0,0)";
        break;
      case 2:
        color = "rgb(255,165,0)";
        break;
      case 3: 
        color = "rgb(255,255,0)";
        break;
      case 4:
        color = "rgb(0,255,0)";
        break;
      case 5:
        color = "rgb(0,176,240)";
        break;
      case 6:
        color = "rgb(102,0,255)";
        break;
      case 7:
        color = "rgb(153,51,255)";
        break;
      default:
        color = "black";
    }
    if (((c[3]%2 == 0) || ((c[3]>6)&&(c[3]<11))) && (mode == "edit"))
    {
      strokeOp = "1.0";
      strokeW = 2;
    }
    else
    {
      strokeOp = "0.3";
      strokeW = 1;
    }
    if ((c[3] == -1) && (c[4] == 0))
    {
      color = "black";
      strokeOp = "1";
      
    }
      return "fill: "+color+"; fill-opacity: 0.7;stroke:black; stroke-width: "+strokeW+"; stroke-opacity: "+strokeOp;
  }
  */
  function conColor(c)
  {
    if (c[3] === -10) // do not display space, comma
      return "display: none";

    var color = "";
    var strokeOp = "";
    var strokeW = 0;
    var fillOp = "0.7";
    switch(c[2])
    {
      case 0:
        color = "grey";
        break;
      case 1:
        color = "rgb(255,0,0)"; //red
        fillOp = "0.65"
        break;
      case 2:
        color = "rgb(255,165,0)"; // orange
        break;
      case 3: 
        color = "rgb(255,255,0)"; // yellow
        break;
      case 4:
        color = "rgb(0,255,0)"; // green
        fillOp = "1.0"
        break;
      case 5:
        color = "rgb(0,220,255)"; // blue
        fillOp = "1.0";
        break;
      case 6:
        color = "rgb(0,64,255)";  // indigo
        break;
      case 7:
        color = "rgb(143,0,255)"; // violet
        break;
      default:
        color = "black";
    }
    if (((c[3]%2 == 0) || ((c[3]>6)&&(c[3]<11))) && (mode == "edit"))
    {
      strokeOp = "1.0";
      strokeW = 2;
    }
    else
    {
      strokeOp = "0.3";
      strokeW = 1;
    }
    if ((c[3] == -1) && (c[4] == 0))
    {
      color = "black";
      strokeOp = "1";
      fillOp = "0.7";
      
    }
      return "fill: "+color+"; fill-opacity: "+fillOp+";stroke:black; stroke-width: "+strokeW+"; stroke-opacity: "+strokeOp;
  }
  function vowColor(c)
  {
    var color = "";
    switch(c)
    {
      case 1:
      case 2:
        color = "grey";
        break;
      case 3:
      case 4:
        color = "rgb(255,0,0)";
        break;
      case 5:
      case 6:
        color = "rgb(255,165,0)";
        break;
      case 7:
      case 8: 
        color = "rgb(0,255,0)";
        break;
      case 9:
      case 10:
        color = "rgb(102,0,255)";
        break;
      default:
        color = "black";
    }
    return "fill: "+color+"; fill-opacity: 0.8;stroke:black;stroke-width: 1";
  }
  function vowPath(d,i)
  {
    var p = "";
    var x = ((d[5]-d[4])*charW);
    var w = charW*d[4];
    var h = charH;
    switch(d[3])
    {
      case -1:
        if (d[4] == 0)
        {
          //p = "M"+x+",0m0,3a3,3 0 1,1 0,-6a3,3 0 1,1 0,6z";
          w = 4;
          h = 4;
          x = x-2;
          p = "M"+x+",0 L"+x+",-"+h + " L"+(x+w)+",-"+h+" L"+(x+w)+",0 z";
        }
        if (d[4] == 1)
        {
          p = "M"+x+",0 L"+x+","+h + " L"+(x+w)+","+h+" L"+(x+w)+",0 z";
        }
        break;
      case 1: case 2: case 11:
        p = "M"+x+",0 L"+x+","+h + " L"+(x+w)+","+h+" L"+(x+w)+",0 z";
        break;
      case 3:
        p = "M"+x+","+h+" L"+x+","+(h/2)+" L"+(x+(w/2))+",0"+" L"+(x+w)+","+(h/2)+" L"+(x+w)+","+h+" z";
        break;
      case 4:
        p = "M"+x+","+h+" L"+(x+(w/2))+",0"+" L"+(x+w)+","+h+" z";
        break;
      case 5:
        //M20,180 L20,190 A10,10 0 0,0 40,190 L40,180 z
        p = "M"+x+",0 L"+x+","+(h/2)+"A"+(w/2)+","+(w/2)+" 0 0,0 "+(x+w)+","+(h/2)+" L"+(x+w)+",0 z";
        break;
      case 6:
        if (w == charW)
          p = "M"+x+",0 A"+(w/2)+","+w+" 0 0,0 "+(x+w)+",0 z";  
        else
          p = "M"+x+",0 A"+(w/2)+","+(w/2)+" 0 0,0 "+(x+w)+",0 z";
        break;
      case 7:
        p = "M"+x+",0 L"+x+","+h+" L"+(x+w)+","+h+" L"+(x+w)+","+(h/2)+" z";
        break;
      case 8:
        p = "M"+x+",0 L"+x+","+h+" L"+(x+w)+","+h+" z";
        break;
      case 9:
        p = "M"+x+","+h+" L"+x+","+(h/2)+"A"+(w/2)+","+(h/2)+" 0 0,1 "+(x+w)+","+(h/2)+" L"+(x+w)+","+h+" z";
        break;
      case 10:
        p = "M"+x+","+h+" A"+(w/2)+","+h+" 0 0,1 "+(x+w)+","+h+" z";
        break;
      default:
        p = "M"+x+",0 L"+x+","+h + " L"+(x+w)+","+h+" L"+(x+w)+",0 z";
        break;
    }
    return p;
  }
  // which vowel
  function getVowData(char)
  {
    switch(char)
    {
      case " ": case ",":
        return -10;
      case "अ": 
        return 1;
        break;
      case "आ": case "ा":
        return 2;
        break;
      case "इ": case "ि":
        return 3;
        break;
      case "ई": case "ी":
        return 4;
        break;
      case "उ": case "ु":
       return 5;
        break;
      case "ऊ": case "ू":
        return 6;
        break;
      case "ए": case "े":
        return 7;
        break;
      case "ऐ": case "ै":
        return 8;
        break;
      case "ओ": case "ो":
        return 9;
        break;
      case "औ": case "ौ":
        return 10;
        break;
      case "ृ":
        return 11;
        break;
      default:
        return -1;
    }
    return -1;
  }
  // vowel or consonant, if consonant, which line in varnmala
  function getConsData(char)
  {
    switch(char)
    {
      case " ": case ",":
        return -10;
      case "अ": case "आ": case "इ": case "ई": case "उ": case "ऊ": 
      case "ए": case "ऐ": case "ओ": case "औ":
        return 0;
        break;
      case "क": case "ख": case "ग": case "घ": case "ग़": case "ङ":
        return 1;
        break;
      case "च": case "छ": case "ज": case "झ": case "ञ": case "ज़":
        return 2;
        break;
      case "ट": case "ठ": case "ड": case "ढ": case "ण": case "ड़": case "ढ़":
        return 3;
        break;
      case "त": case "थ": case "द": case "ध": case "न": case "ं":
        return 4;
        break;
      case "प": case "फ": case "ब": case "भ": case "म": case "फ़":
        return 5;
        break;
      case "य": case "र": case "ल": case "व":
        return 6;
        break;
      case "श": case "ष": case "स": case "ह":
        return 7;
        break;
      default:
        return -1;
    }
    return -1;
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
  var chars = [];
  var maxLen = 0;
  var maxLineLen = 0;
  function adjustCharLen()
  {
    //console.log("adj");
    var k = parseInt(this.getAttribute("id").substring(4));
    var i = parseInt(this.parentNode.getAttribute("id").substring(5));
    var kk = 0;
    if ((chars[i][k][3]%2 == 0) || ((chars[i][k][3]>6) && (chars[i][k][3]<11)))
    {
      if (chars[i][k][4] == 1)
      {
        chars[i][k][4] = 2;
        for (kk = k; kk < chars[i].length; kk++)
          chars[i][kk][5] = chars[i][kk][5]+1;
        if (chars[i][kk-1][5] > maxLen)
            maxLen = chars[i][kk-1][5];
        draw();
        return;
      }
      if (chars[i][k][4] == 2)
      {
        chars[i][k][4] = 1;
        for (kk = k; kk < chars[i].length; kk++)
          chars[i][kk][5] = chars[i][kk][5]-1;
        draw();
        return;
      }
    }
    if (chars[i][k][3] == -1) // half letter
    {
      if (chars[i][k][4] == 0)
      {
          chars[i][k][4] = 1;
          for (kk = k; kk < chars[i].length; kk++)
            chars[i][kk][5] = chars[i][kk][5]+1;
          if (chars[i][kk-1][5] > maxLen)
            maxLen = chars[i][kk-1][5];
          draw();
          return;
      }
      if (chars[i][k][4] == 1)
      {
          chars[i][k][4] = 0;
          for (kk = k; kk < chars[i].length; kk++)
            chars[i][kk][5] = chars[i][kk][5]-1;
          draw();
          return;
      }
    }
  }
  function charTxtPos(d,i)
  {
    var x = ((d[5]-d[4])*charW);
    //console.log(d[5]);
    var w = charW*d[4];
    return x+(w/2);
  }
  function charTxt(d)
  {
    var txt = "";
    if (d[2] != -10)  // non hindi character
    {
      if ((d[2] == 0)||(d[3] == 1))
      {
        txt = d[0];
      }
      else
      {
        txt = d[0]+d[1];
      }
    }
    return txt;
  }
  function halfLetterLen(p,c,n)
  {
    //console.log("n: "+n);
    if (p === 0)  // no previous, i.e. first letter
      return 0;
    if (p[2] === -10) // half maatraa is first letter of word
      return 0;
    pLD = ""; // previous is laghu or deergha; 
    nLD = ""; // next is laghu or deergha; 
    switch (p[3])
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
    switch (n[3])
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
  function draw()
  {
     console.log(chars);
     var chart = d3.select("#chart")
     chart.select("svg").remove();
     var svg = chart.append("svg")
                  .attr("width", charW*maxLen+100)
                  .attr("height", ((maxLineLen*(charW+7))+(charW+7))+charW)
                  .attr("style","border: solid 1px #ddd;");

    if (lineSpacing)
    {
      var g = svg.selectAll("g")
        .data(chars)
        .enter().append("svg:g")
          .attr("transform", function(d,i) { return "translate(" + 10 + "," + ((i*(charW+7))+(charW+7)) + ")" })
          .attr("id", function(d,i) { return "gLine"+i});
    }
    else
    {
      var g = svg.selectAll("g")
        .data(chars)
        .enter().append("svg:g")
          .attr("transform", function(d,i) { return "translate(" + 10 + "," + ((i*(charW))+(charW)) + ")" })
          .attr("id", function(d,i) { return "gLine"+i});
    }
    g.selectAll("path")
      .data(function(d) {return d;} )
      .enter().append("path")
        .attr("id", function(d,i) {return "char"+i})
        .attr("style", function(d,i) {return conColor(d);})
        .attr("d", function(d,i) {return vowPath(d,i);})
        .attr("title", function(d,i) {return d[0]+d[1];})
        .on("click",adjustCharLen);

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
        
    g.append("svg:text")            // line total maatraa
      .attr("y", charH)
      .attr("x", function(d) {return charW*maxLen+charW;})
      //.attr("dominant-baseline", "central")
      .attr("class", "graphText3")
      .text(function(d) { return (d.length > 0) ? d[d.length-1][5] : "";});
  }
  function visualize()
  {
    var pom = document.getElementById("pom").value;
    var lines = pom.split("\n");
    var oldLines = prevText.split("\n");
    //chars = [];
    var i = 0, k = 0;
    var charCode = 0;
    var len = 0;
    maxLineLen = lines.length;
    for (i = 0; i < maxLineLen; i++)
    {
      // do not process old lines
      if ((i < oldLines.length) && (oldLines[i] == lines[i]))
      {
        chars[i][chars[i].length] = "old";
      }
      else  
      // process only new edited lines
      // go through each character in the line and handle differently
      // based on what category of character it is
      // to set first 2 info slots
      {
        chars[i] = [];
        for (k=0;k<lines[i].length;k++)
        {
          charCode = lines[i].charCodeAt(k);
          len = chars[i].length;
          console.log(lines[i].substring(k,k+1) + " " + charCode);
          if ((charCode == 32)||(charCode == 44))  // space, comma
          {
            chars[i][len] = ["",""];
            chars[i][len][0] = lines[i].substring(k,k+1);
            chars[i][len][1] = lines[i].substring(k,k+1);
          }
          if ((charCode >= 2309) && (charCode <= 2324)) // vowel
          {
            chars[i][len] = ["",""];
            chars[i][len][0] = lines[i].substring(k,k+1);
            chars[i][len][1] = lines[i].substring(k,k+1);
          }
          if ((charCode >= 2325) && (charCode <= 2361)) // consonant
          {
            chars[i][len] = ["",""];
            chars[i][len][0] = lines[i].substring(k,k+1);
            chars[i][len][1] = "अ";
          }
          if ((charCode >= 2392) && (charCode <= 2399)) 
          // consonant all the ones with dots at bottom
          {
            chars[i][len] = ["",""];
            chars[i][len][0] = lines[i].substring(k,k+1);
            chars[i][len][1] = "अ";
          }
          if ((charCode >= 2366) && (charCode <= 2381)) // maatraa
          {
            chars[i][len-1][1] = lines[i].substring(k,k+1);
          }
          if (charCode == 2306) // anusvara
          {
            chars[i][len] = ["",""];
            chars[i][len][0] = lines[i].substring(k,k+1);
            chars[i][len][1] = "्";
          }
        }
        chars[i][chars[i].length] = "new";
      }
    }
    for (i = 0; i < chars.length; i++)
    {
      //console.log(chars[i]);
      // get the number values for the characters
      if (chars[i][chars[i].length-1] == "new")
      {
        for (k=0;k<chars[i].length-1;k++)
        {
          chars[i][k][2] = getConsData(chars[i][k][0]);
          chars[i][k][3] = getVowData(chars[i][k][1]);
          chars[i][k][4] = 0; // len
          chars[i][k][5] = 0; // cum len
        }
      }
      // calculate lengths
      if (chars[i][chars[i].length-1] == "new")
      {
        for (k=0;k<chars[i].length-1;k++)
        {
          // assign length as per vowel
          switch (chars[i][k][3])
          {
            case 1: case 3: case 5: case 11:
              chars[i][k][4] = 1;
              break;
            case 2: case 4: case 6: case 8: case 10: case 7: case 9: case 10:
              chars[i][k][4] = 2;
              break;
            case -1: // no vowel, most likely half maatraa
              {
                // decide half maatraa length
                if (k == 0) // first letter of line
                {
                  if (k == chars[i].length-2) // last letter of line
                  {
                    chars[i][k][4] = halfLetterLen(0,chars[i][k],0);
                  }
                  else  // not last letter
                  {
                    chars[i][k][4] = halfLetterLen(0,chars[i][k],chars[i][k+1]); 
                  }
                }
                else  // not first letter
                {
                  if (k == chars[i].length-2) // last letter of line
                  {
                    chars[i][k][4] = halfLetterLen(chars[i][k-1],chars[i][k],0);
                  }
                  else  // not last letter
                  {
                    chars[i][k][4] = halfLetterLen(chars[i][k-1],chars[i][k],chars[i][k+1]); 
                  }
                }
              }
          }
          // assign cumulative length
          if (k == 0)
          { chars[i][k][5] = chars[i][k][4]; }
          else
          { chars[i][k][5] = chars[i][k-1][5] + chars[i][k][4]; }
        }
        //console.log(i);
        //console.log(chars[i][k-1]);
        if (chars[i].length > 1)
        {
          if (chars[i][k-1][5] > maxLen)
          {
            maxLen = chars[i][k-1][5];
          }
        }
      }
      chars[i].pop();
    }
    if (lines.length < chars.length)
    {
      chars.length = lines.length;
    }
    //console.log(chars);
    prevText = pom;
    draw();
    document.getElementById("divShowEditables").style.display = "block";
  }

  // minification used: http://jscompress.com/
  // had to fix ग़ ज़ फ़ ड़ ढ़ after that