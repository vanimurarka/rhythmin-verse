export class surBujhoGame {
	#notes;
	#rounds;
	#roundNotes;
	#roundNumber = 1;
	#noteToGuess;
	#aContext = new AudioContext();

	constructor(level)
	{
		this.#notes = level.notes;
		this.#rounds = level.gameRounds;
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
			this.#roundNumber = this.#roundNumber + 1;
			if (this.#roundNumber == this.#rounds)
				result.end = true;
		}
		
		return result;
	}
	nextRound()
	{
		if (this.#roundNumber < this.#rounds)
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
	#elRounds;
	#elRound;
	#elGuessButtons;
	#fnGuessClick;
	#guessBtns;
	constructor(elGame,elGuessBtns,fnClick,elRounds,elRound,)
	{
		this.#elGame = elGame;
		this.#elGuessButtons = elGuessBtns;
		this.#fnGuessClick = fnClick;
		this.#elRounds = elRounds;
		this.#elRound = elRound;

	}
    set noteBtns(btns) {
        this.#guessBtns = btns;
    }
	initGameScreen(level)
	{
		
	}
	makeGuessBtns()
	{
		this.#elGuessButtons.selectAll("input")
    		.data(this.#guessBtns)
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
	markGuessResult(btn, result)
	{
		if (result)
			btn.style.backgroundColor = "green";
		else
			btn.style.backgroundColor = "red";
	}
	clearGuessBtns()
	{
		
  		this.#elGuessButtons.selectAll("input").remove();
	}
	makeLevelBtns(div,levels,onclick)
	{
		div.selectAll("div")
    		.data(levels)
    		.enter()
    		.append("div")
                .attr("class","levelBtn")
                .text(function(d,i) {
					return "Level " + (i+1);})
                .on("click", onclick);
	}
    clearLevelBtns(div)
    {
        div.selectAll("div").remove();
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

function Binding(b) {
	_this = this
	this.element = b.element	
	this.value = b.object[b.property]
	this.attribute = b.attribute
	this.valueGetter = function(){
		return _this.value;
	}
	this.valueSetter = function(val){
		_this.value = val
		_this.element[_this.attribute] = val
	}

	Object.defineProperty(b.object, b.property, {
		get: this.valueGetter,
		set: this.valueSetter
	});	
	b.object[b.property] = this.value;
	
	this.element[this.attribute] = this.value

}

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
