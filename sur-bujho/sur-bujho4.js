window.addEventListener("load", fInit);
cVol.addEventListener("change",fVolChange);
cBtnStart.addEventListener("click",fStart);
cTest.addEventListener("change",fSelectTest);
cBtnScore.addEventListener("click", fShowScoreCard);
cScale.addEventListener("change",fSetSursToScale)
cClose.onclick = function() {
  cModal.style.display = "none";
}
// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
  if (event.target == cModal) {
    cModal.style.display = "none";
  }
}

function fInit() {

  // INITIALIZE VOLUME
  let vol = getCookie("SBG:Vol");
  if (vol.length == 0)
      gVol = cVol.value;
  else
  {
      gVol = vol;
      cVol.value = vol;
  }

  // INITIALIZE SCALE
  let scale = getCookie("SBG:Scale");
  if (scale.length != 0)
  {
      gScale = scale;
      if (gScale != 0)
      {
          cScale.value = gScale;
          fSetSursToScale();
      }
  }


  // INITIALIZE LEVEL
  let level = getCookie("SBG:Level");
  if (level.length != 0)
      gTest = level;

  cTest.value = gTest;

  // INITIALIZE GAME
  cTotalRounds.innerHTML = sTestCombos[gTest].gameRounds;
}

function fVolChange() {
  setCookie("SBG:Vol",cVol.value,365);
  gVol = cVol.value;
}

function fSelectTest() {
  fReset();

  gTest = cTest.value;
  cTotalRounds.innerHTML = sTestCombos[gTest].gameRounds;

  setCookie("SBG:Level",gTest,365);
}

function fReset() {
  fClearButtons();
  cRound.innerHTML = 0;
  cScore.innerHTML = 0;
  gInGuessingMode = false;
  gTestNoteI = 0;
  gTestNoteName = '';
  gTestNote = 0;
  cPlayAgain.style.display = "none";
  cPlayTuneAgain.style.display = "none";
  cBtnStart.style.display = "inline-block";
  cScale.disabled = false;
}

function fStart() {
  fReset();

  cScale.disabled = true;
  // play s
  playNote(gSurMap.get("S").freq,"triangle", gVol);

  // start game after a gap
  setTimeout(function() { fStartRound(); }, 1500);

  cBtnStart.style.display = "none";
}

function fPlaySAgain()
{
  playNote(gSurMap.get("S").freq,"triangle", gVol);
}

function fPlayGuessNoteAgain()
{
  playNote(gTestNote[gGuessI].freq,"triangle", gVol);
}

function fTuneAgain()
{
  let i = 0;
  while(i < sTestCombos[gTest].noteCount)
  { 
    let freq = gTestNote[i].freq;
    setTimeout(function() { playNote(freq,"triangle", gVol); }, i*1500);
    i++;
  }
}

function fStartRound()
{

  // whicheth note in the test (gTestI in testCombos) to be guessed
    // as per noteCount -- how many notes to guess
    let i = 0;
    gTestNoteI = [];
    while (i < sTestCombos[gTest].noteCount)
    {
      if (i==0)
        gTestNoteI[i] = Math.floor(Math.random() * (sTestCombos[gTest].notes.length - 0) + 0);
      else
      {
        let newIndex = Math.floor(Math.random() * (sTestCombos[gTest].noteNear+2));
        newIndex--;
        newIndex = gTestNoteI[i-1]+newIndex;
        if (newIndex < 0) newIndex = 0;
        if (newIndex >= sTestCombos[gTest].notes.length) newIndex = sTestCombos[gTest].notes.length - 1;
        // alert(newIndex);
        gTestNoteI[i] = newIndex;
      }
      i++;
    }
    console.log(gTestNoteI);

  // whicheth note in the test (gTest in sTestCombos) to be guessed -- for one note
  // gTestNoteI = Math.floor(Math.random() * (sTestCombos[gTest].notes.length - 0) + 0);
  // gTestNoteName = sTestCombos[gTest].notes[gTestNoteI];

  // get the note
  gTestNote = [];
  gTestNoteName = [];
  i=0;
  while (i < gTestNoteI.length)
  {
    gTestNote[i] = gSurMap.get(sTestCombos[gTest].notes[gTestNoteI[i]]);
    gTestNoteName[i] = sTestCombos[gTest].notes[gTestNoteI[i]];
    i++;
  }
  console.log(gTestNote);
  console.log(gTestNoteName);

  // play the note
  // playNote(gTestNote.freq,"triangle", gVol);

  i = 0;
  while(i < sTestCombos[gTest].noteCount)
  { 
    let freq = gTestNote[i].freq;
    console.log("playing "+i);
    setTimeout(function() { playNote(freq,"triangle", gVol); }, i*1500);
    i++;
  }

  fClearButtons();
  let divGuessButtons = d3.select("#guessButtons");
  divGuessButtons.selectAll("input")
    .data(sTestCombos[gTest].btns)
    .enter()
    .append("input")
      .attr("type","button")
      .attr("value", function(d,i) {
        if (d=="b")
          return " ";
        else
          return d;})
      .attr("class","big noteBtn")
      .attr("id", function(d,i) {return "btn-"+d;})
      .on("click", fTakeNoteViaClick);

  cPlayAgain.style.display = "block";
  if (sTestCombos[gTest].noteCount > 1)
        cPlayTuneAgain.style.display = "inline-block";

  gInGuessingMode = true;
}

function fClearButtons()
{
  let divGuessButtons = d3.select("#guessButtons");
  divGuessButtons.selectAll("input").remove();
  for (let i = 1; i <= 8; i++)
  {
    let span = document.getElementById('myDot'+i);
    span.style.visibility = "hidden";
  }
}

function fTakeNoteViaClick(event,noteName)
{
  if (noteName == "b") return;
  if (gInGuessingMode)
  {
    fRecordGuess(noteName,this);
  }
}

function fRecordGuess(noteName,btnNote)
{
  if (noteName == gTestNoteName[gGuessI])
  {
      cScore.innerHTML = parseInt(cScore.innerHTML) + 1;
      btnNote.style.backgroundColor = "green";
      btnNote.style.color = "white";

      gGuessI++;

      if (sTestCombos[gTest].noteCount > 1)
      {
        let rect = btnNote.getBoundingClientRect();
        let left = parseInt(rect.x + 10) + "px";
        let SAgain = document.getElementById("SAgain");
        rect = SAgain.getBoundingClientRect();
        let span = document.getElementById('myDot'+gGuessI);
        span.style.position = "relative";
        span.style.left = left;
        // let top = parseInt(rect.y + 30) + ((gGuessI-1) * 10);
        let top = 10 + ((gGuessI-1) * 5);
        span.style.top = top + "px";
        span.style.visibility = "visible";
        span.style.display = "block";
      }

      if (gGuessI == sTestCombos[gTest].noteCount)
      {
        gGuessI = 0;
        gInGuessingMode = false;
        let round = parseInt(cRound.innerHTML);
        round++;
        cRound.innerHTML = round;

        if (round == sTestCombos[gTest].gameRounds)
            gameOver();
        else
            setTimeout(function() { fStartRound(); }, 1500);
      }
      else if (sTestCombos[gTest].noteCount > 1)
      {
        setTimeout(function() { 
            btnNote.style.backgroundColor = "black";
          }, 600);
      }
  }
  else
  {
    cScore.innerHTML = parseInt(cScore.innerHTML) - 1;

    btnNote.style.backgroundColor = "red";
    btnNote.style.color = "white";

    if (sTestCombos[gTest].noteCount > 1)
    {
      setTimeout(function() { 
          btnNote.style.backgroundColor = "black";
        }, 600);
    }
  }
}

function gameOver()
{
  cScale.disabled = false;
  let finalScore = parseInt(cScore.innerHTML);
  let maxScore = sTestCombos[gTest].gameRounds * sTestCombos[gTest].noteCount;
  let percent = (finalScore / maxScore) * 100;
  console.log(percent);
  setCookie("SBG:Level"+gTest,percent,365);
  fReset();
  fShowScoreCard();
}

function fShowScoreCard() {
  cModalTitle.innerHTML = "Score Card";
  cModalTitle.style.display = "block";
  cModalText.innerHTML = fGetStats();
  cModal.style.display = "block";
}

function fGetStats()
{
  let stats = "";
  for (i=0; i<=sTestCombos.length-1; i++)
  {
    let score = parseInt(getCookie("SBG:Level"+i));
    if (isNaN(score)) score = 0;
    // let rounds = parseInt(getCookie("SBG:Level"+i+"Rounds"));
    // if (isNaN(rounds)) rounds = 0;
    stats += "Level " + (i+1) + ": " + score + "%<br>";
  }
  return stats;
}

function fSetSursToScale()
{
  gScale = parseInt(cScale.value);
  let i = cIndexInNotesforGScale + gScale;
  for (let [key, value] of gSurMap) {
    value.freq = sNotes[i-3];  // 0th value in notes array is 3 indexes less than sa
    gSurMap.set(key,value);
    i++;
  }
  setCookie("SBG:Scale",gScale,365);
}