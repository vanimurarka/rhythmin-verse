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
	#div;
	#btns;
	#btnClickFn;
	constructor(div,btns,btnClickFn)
	{
		this.#div = div;
		this.#btns = btns;
		this.#btnClickFn = btnClickFn;
	}
	makeGuessBtns()
	{
		this.#div.selectAll("input")
    		.data(this.#btns)
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
				.on("click", this.#btnClickFn);
	}
	markGuessResult(btn, result)
	{
		if (result)
			btn.style.backgroundColor = "green";
		else
			btn.style.backgroundColor = "red";
	}
	clearBtns()
	{
  		this.#div.selectAll("input").remove();
	}
	makeLevelBtns(div,levels)
	{
		div.selectAll("input")
    		.data(levels)
    		.enter()
    		.append("input")
      			.attr("type","button")
      			.attr("value", function(d,i) {
					return "Level " + i;});
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
