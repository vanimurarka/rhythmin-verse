const sNotes = [82.41,87.31,92.5,98,103.83,110,116.54,123.47,130.81,138.59,146.83,155.56,164.81,174.61,185,196,207.65,220,233.08,246.94,261.63,277.18,293.66,311.13,329.63,349.23,369.99,392,415.3,440,466.16];
let gSurMap = new Map();
  gSurMap.set("D'",{freq:82.41,pure:true,hindi:".ध"});
  gSurMap.set("n'",{freq:0,pure:false,hindi:"._नी"});
  gSurMap.set("N'",{freq:92.50,pure:true,hindi:".नी"});
  gSurMap.set('S',{freq:98.00,pure:true,hindi:"सा"});
  gSurMap.set('r',{freq:0,pure:false,hindi:"_रे"});
  gSurMap.set('R',{freq:110.00,pure:true,hindi:"रे"});
  gSurMap.set('g',{freq:0,pure:false,hindi:"_गा"});
  gSurMap.set('G',{freq:123.47,pure:true,hindi:"गा"});
  gSurMap.set('M',{freq:130.81,pure:true,hindi:"मा"});
  gSurMap.set('m',{freq:0,pure:false,hindi:"मा*"});
  gSurMap.set('P',{freq:146.83,pure:true,hindi:"पा"});
  gSurMap.set('d',{freq:0,pure:false,hindi:"_धा"});
  gSurMap.set('D',{freq:164.81,pure:true,hindi:"धा"});
  gSurMap.set('n',{freq:0,pure:false,hindi:"_नी"});
  gSurMap.set('N',{freq:185.00,pure:true,hindi:"नी"});
  gSurMap.set("S''",{freq:196.00,pure:true,hindi:"सां"});
  gSurMap.set("r''",{freq:0,pure:false,hindi:"_रें"});
  gSurMap.set("R''",{freq:220.00,pure:true,hindi:"रें"});
  gSurMap.set("g''",{freq:0,pure:false,hindi:"_गां"});
  gSurMap.set("G''",{freq:246.94,pure:true,hindi:"गां"});
const sTestCombos = [
      {notes:["S","S''"],btns:["S","b","b","b","b","b","b","S''"],gameRounds:5,graduationScore:5, noteCount: 1, noteNear: 0},
      {notes:["S","P","S''"],btns:["S","b","b","b","P","b","b","S''"],gameRounds:10,graduationScore:10, noteCount: 1, noteNear: 0},
      {notes:["S","R","P","S''"],btns:["S","R","b","b","P","b","b","S''"],gameRounds:15,graduationScore:15, noteCount: 1, noteNear: 0},
      {notes:["S","R","G","P","S''"],btns:["S","R","G","b","P","b","b","S''"],gameRounds:20,graduationScore:20, noteCount: 1, noteNear: 0},
      {notes:["S","R","G","P","D","S''"],btns:["S","R","G","b","P","D","b","S''"],gameRounds:20,graduationScore:20, noteCount: 1, noteNear: 0},
      {notes:["S","R","G","P","D","S''"],btns:["S","R","G","b","P","D","b","S''"],gameRounds:10,graduationScore:20, noteCount: 2, noteNear: 1},
      {notes:["S","R","G","P","D","S''"],btns:["S","R","G","b","P","D","b","S''"],gameRounds:10,graduationScore:20, noteCount: 4, noteNear: 1},
      {notes:["S","R","G","P","D","N","S''"],btns:["S","R","G","b","P","D","N","S''"],gameRounds:50,graduationScore:40, noteCount: 1, noteNear: 0},
      {notes:["S","R","M","P","D","N","S''"],btns:["S","R","b","M","P","D","N","S''"],gameRounds:50,graduationScore:40, noteCount: 1, noteNear: 0},
      {notes:["S","R","G","M","P","D","N","S''"],btns:["S","R","G","M","P","D","N","S''"],gameRounds:50,graduationScore:40, noteCount: 1, noteNear: 0},
      {notes:["S","R","G","M","P","D","N","S''","R''","G''"],btns:["S","R","G","M","P","D","N","S''","R''","G''"],gameRounds:50,graduationScore:40, noteCount: 1, noteNear: 0},
      {notes:["D'","N'","S","R","G","M","P","D","N","S''","R''","G''"],btns:["D'","N'","S","R","G","M","P","D","N","S''","R''","G''"],gameRounds:50,graduationScore:40, noteCount: 1, noteNear: 0},
      {notes:["D'","S","R","G","P","D","S''","R''","G''"],btns:["D'","b","S","R","G","b","P","D","b","S''","R''","G''"],gameRounds:10,graduationScore:20, noteCount: 4, noteNear: 1},
      {notes:["D'","S","R","G","P","D","S''","R''","G''"],btns:["D'","b","S","R","G","b","P","D","b","S''","R''","G''"],gameRounds:10,graduationScore:20, noteCount: 8, noteNear: 1},
];

const cVol = document.getElementById("volume");
const cTest = document.getElementById("selectTest");
const cBtnStart = document.getElementById("btnStart");
const cRound = document.getElementById("txtRound");
const cTotalRounds = document.getElementById("txtTotalRounds");
const cScore = document.getElementById("txtScore");
const cPlayAgain = document.getElementById("playAgainBtns");
const cModal = document.getElementById("myModal");
const cModalTitle = document.getElementById("modalTitle");
const cModalText = document.getElementById("modalText");
const cBtnScore = document.getElementById("btnScore");
const cClose = document.getElementsByClassName("close")[0];
const cScale = document.getElementById("selectScale");
const cPlayTuneAgain = document.getElementById("playTuneAgain");

let gVol = 0;
let gTest = 0;
let gTestNoteI = 0;
let gTestNote = 0;
let gTestNoteName = "";
let gInGuessingMode = false;
let gScale = 0;
let gGuessI = 0;
const cIndexInNotesforGScale = 3;

