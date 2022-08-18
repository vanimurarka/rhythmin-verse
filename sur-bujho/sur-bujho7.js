export class surBujhoGame {
	#notes;
	#rounds;
	#roundNotes;
	#roundNumber = 1;
	#noteToGuess;
    #score = 0;
	#aContext = new AudioContext();

	constructor(level)
	{
		this.#notes = level.notes;
		this.#rounds = level.gameRounds;
	}
    get round() {
        return this.#roundNumber;
    }
    get score() {
        return this.#score;
    }
	start()
	{
		this.#noteToGuess = 'S';
		this.playS();
	}
	assessGuess(noteName)
	{
		let result = {success:false,end:false};
		if (noteName == this.#noteToGuess)
		{
			result.success = true;
			this.#roundNumber++;
            this.#score++;
			if (this.#roundNumber > this.#rounds)
				result.end = true;
		}
        else
        {
            this.#score--;
        }
		
		return result;
	}
	nextRound()
	{
		if (this.#roundNumber <= this.#rounds)
		{
			let iNoteToGuess = Math.floor(Math.random() * (this.#notes.length - 0) + 0);
			this.#noteToGuess = this.#notes[iNoteToGuess];
			let freq = gSurMap.get(this.#noteToGuess).freq;
			this.#playNote(freq, "triangle", 5);
		}
	}
	playS()
	{
		this.#playNote(gSurMap.get("S").freq,"triangle", 5); // 5 = volume
	}
	#playNote(frequency, type, vol)
	{
		let o = null;
		let g = null;
	  o = this.#aContext.createOscillator()
	  g = this.#aContext.createGain()
	  g.gain.value += vol;
	  o.type = type
	  o.connect(g)
	  o.frequency.value = frequency
	  g.connect(this.#aContext.destination)
	  o.start(0)

	  g.gain.exponentialRampToValueAtTime(
	    0.00001, this.#aContext.currentTime + 5
	  )
	}
}

export class surBujhoUI {
	#elGame;
    #elLevelNbr;
	#elRounds;
	#elRound;
    #elScore;
	#elGuessButtons;
    #elLevelButtons;
	#fnGuessClick;
    #level;
	#clLevelOpen = "";
	#clLevelClose = "";   
	constructor(arg)
	{
        this.#elLevelButtons = d3.select("#"+ arg.idLevelBtns);
		this.#elGame = d3.select("#"+ arg.idGame);
		this.#elGuessButtons = d3.select("#"+ arg.idGuessBtns);
		this.#fnGuessClick = arg.fnClick;
		this.#elRounds = d3.select("#"+ arg.idRounds);
		this.#elRound = d3.select("#"+ arg.idRound);
        this.#elScore = d3.select("#" + arg.idScore);
        this.#elLevelNbr = d3.select("#" + arg.idGameLevel);
		this.#clLevelOpen = arg.clLevelOpen;
		this.#clLevelClose = arg.clLevelClose;
	}
    set score(score) {
        this.#elScore.text(score);
    }
    set rounds(rounds) {
        this.#elRounds.text(rounds);
    }
    set round(round) {
        this.#elRound.text(round);
    }
	initGameScreen({level,levelNbr})
	{
		this.#elGame.style('display','block');
        this.#level = level;
        this.#elLevelNbr.text(levelNbr);
        this.#elRounds.text(level.gameRounds);
        this.round = 1;
        this.score = 0;
        this.clearGuessBtns();
	}
    hideGameScreen()
    {
        this.#elGame.style('display','none');
    }
	makeGuessBtns(round = 1)
	{
        this.#elRound.text(round);
		this.#elGuessButtons.selectAll("input")
    		.data(this.#level.btns)
    		.enter()
    		.append("input")
      			.attr("type","button")
      			.attr("value", function(d,i) {
					if (d=="b")
					return " ";
					else
					return d;})
				.attr("class","noteBtn")
				.attr("id", function(d,i) {return "btn-"+d;})
				.on("click", this.#fnGuessClick);
	}
	markGuessResult(btn, result, score)
	{
        this.score = score;
		if (result)
			btn.style.backgroundColor = "green";
		else
			btn.style.backgroundColor = "red";
	}
	clearGuessBtns()
	{
		
  		this.#elGuessButtons.selectAll("input").remove();
	}
	makeLevelBtns(levels,maxOpenLevel,onclick)
	{
        this.hideGameScreen();
		let clLevelOpen = this.#clLevelOpen;
		let clLevelClose = this.#clLevelClose;
		this.#elLevelButtons.selectAll("div")
    		.data(levels)
    		.enter()
    		.append("div")
                .attr("class",function(d,i) {
					return (i < maxOpenLevel) ? clLevelOpen : clLevelClose})
                .attr("id",function(d,i) {return "l-"+(i+1);})
                .text(function(d,i) {
					return "Level " + (i+1);})
                .on("click", 
					// function(d,i) {return onclick;});
					onclick);
	}
    clearLevelBtns(div)
    {
        this.#elLevelButtons.selectAll("div").remove();
    }
}

export const cLevels = [
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

let gSurMap = new Map();
  gSurMap.set("D'",{freq:82.41});
  gSurMap.set("N'",{freq:92.50});
  gSurMap.set('S',{freq:98.00});
  gSurMap.set('R',{freq:110.00});
  gSurMap.set('G',{freq:123.47});
  gSurMap.set('M',{freq:130.81});
  gSurMap.set('P',{freq:146.83});
  gSurMap.set('D',{freq:164.81});
  gSurMap.set('N',{freq:185.00});
  gSurMap.set("S''",{freq:196.00});
  gSurMap.set("R''",{freq:220.00});
  gSurMap.set("G''",{freq:246.94});
