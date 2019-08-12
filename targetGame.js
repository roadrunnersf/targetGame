function loadJSFile() {
	//canvas
	var canvas = document.getElementById('myCanvas')
	var ctx = canvas.getContext('2d')
	var sceneID

	var requestframeref = null
	/*
var windowDims = {
  x: window.innerWidth;
  y: window.innerHeight;
};

canvas.width = windowDims.innerWidth;
canvas.height = windowDims.innerHeight;

*/

	var Hair = function(hConfig) {
		this.x = event.clientX
		this.y = event.clientY
		this.crossWidth = hConfig.crossWidth || 50
		this.circleWidth = hConfig.circleWidth || 19
	}

	//MUSIC!!!!!!!!!!!! see note on music in HTML tab
	//document.getElementById('myAudio').play();

	Hair.prototype.draw = function(event) {
		//draw horizontal
		ctx.strokeStyle = 'white'
		ctx.moveTo(this.x - this.crossWidth / 2, this.y)
		ctx.lineTo(this.x + this.crossWidth / 2, this.y)
		ctx.stroke()
		//draw vertical
		ctx.moveTo(this.x, this.y - this.crossWidth / 2)
		ctx.lineTo(this.x, this.y + this.crossWidth / 2)
		ctx.stroke()
		//draw circle
		ctx.beginPath()
		ctx.arc(this.x, this.y, this.circleWidth, this.circleWidth, 0, 360)
		ctx.stroke()
	}

	var Trgt = function(tConfig) {
		this.x = undefined //x postiton
		this.y = undefined //y postiton
		this.s = undefined //size
		this.fillColor = undefined //'blue',
		this.sUpper = tConfig.sUpper || 120
		this.sLower = tConfig.sLower || 150
		this.shrinkRate = tConfig.shrinkRate || 1
		this.shrinkMult = tConfig.shrinkMult || 1.03
		this.shrinkType = undefined
	}

	Trgt.prototype = {
		shrinkTypeChooser: function() {
			this.shrinkType = Math.floor(Math.random() * 5) + 1 //random integer beween 1 & 5
		},
		shrinkOrDiss: function() {
			if (this.s > 0) {
				//target not hit but bigger than 0
				this.shrink()
			} else {
				//target shrunk too small (DISSappeared) so reset target
				this.diss()
			}
		},
		shrink: function() {
			this.s -= this.shrinkRate
			switch (this.shrinkType) {
				case 1: //shrink from top left
					break
				case 2: //shrink from top right
					this.x += this.shrinkRate
					break
				case 3: //shrink from bottom right
					this.x += this.shrinkRate
					this.y += this.shrinkRate
					break
				case 4: //shrink from bottom left
					this.y += this.shrinkRate
					break
				case 5: //shrink to centre
					this.x += this.shrinkRate / 2
					this.y += this.shrinkRate / 2
					break
			}
		},
		hit: function() {
			game.clicks++
			game.scoreSubtotal++
			game.scoreGrandTotal++

			this.reset()
			this.shrinkRate *= this.shrinkMult
		},
		miss: function() {
			//called when a click DOES NOT hit a target
			game.clicks++
		},
		diss: function() {
			//called when a target disapears
			game.lives--
			this.reset()
		},
		reset: function() {
			//reset trgt size to base values and chooses a new random position
			this.shrinkTypeChooser()
			this.s = Math.floor(Math.random() * this.sUpper) + this.sLower //random trgt size
			this.x = Math.floor(Math.random() * (canvas.width - this.s)) //x position of Trgt
			this.y = Math.floor(Math.random() * (canvas.height - this.s)) //y position of Trgt
		},
		chooseColor: function() {
			if (
				hair.x >= this.x &&
				hair.x <= this.x + this.s &&
				hair.y >= this.y &&
				hair.y <= this.y + this.s
			) {
				//inside target
				this.fillColor = 'red'
			} else {
				//outside target
				this.fillColor = 'blue'
			}
		},
		draw: function() {
			this.chooseColor()
			ctx.beginPath()
			ctx.rect(this.x, this.y, this.s, this.s)
			ctx.fillStyle = this.fillColor
			ctx.fill()
		}
	}

	//initialise crosshair
	var hair = new Hair({})

	var game = {
		scoreSubtotal: 0,
		scoreGrandTotal: 0,
		scoreMax: 10,
		lives: 10 + 1, //keep the +1 as the first draw loop will lead to a false loss
		clicks: 0,
		difficulty: 1.5 //base difficulty of the game - changing this will effect the difficulty of all levels as those are a multiplier of this numner
	}

	//initialise targets for all levels.

	var trgt = new Trgt({
		shrinkRate: game.difficulty
	})
	var trgt2 = new Trgt({
		shrinkRate: game.difficulty * 1.3
	})
	var trgt3 = new Trgt({
		shrinkRate: game.difficulty * 1.5
	})
	var trgt4 = new Trgt({
		shrinkRate: game.difficulty * 1.8
	})
	var trgt5 = new Trgt({
		shrinkRate: game.difficulty * 2.5
	})

	function drawScore() {
		ctx.textAlign = 'left'
		ctx.font = '16px Arial'
		ctx.fillStyle = 'white'
		ctx.fillText('Subtotal: ' + game.scoreSubtotal, 8, 20)
		ctx.fillText('Grand Total: ' + game.scoreGrandTotal, 8, 36)
		ctx.fillText('Clicks: ' + game.clicks, 8, 52)
		ctx.fillText('Lives: ' + game.lives + ' / 10', 8, 68)
	}

	document.addEventListener('click', mouseClickHandler, false)
	document.addEventListener('mousemove', mouseMoveHandler, false)

	function mouseClickHandler() {
		switch (sceneID) {
			case 'intro':
				scene_play1()
				break
			case 'play1':
				targetHandle(trgt)
				break
			case 'interlude1':
				scene_play2()
				break
			case 'play2':
				targetHandle(trgt2)
				break
			case 'interlude2':
				scene_play3()
				break
			case 'play3':
				targetHandle(trgt3)
				break
			case 'interlude3':
				scene_play4()
				break
			case 'play4':
				targetHandle(trgt4)
				break
			case 'interlude4':
				scene_play5()
				break
			case 'play5':
				targetHandle(trgt5)
				break
			case 'win':
				document.location.reload()
				break
			case 'lose':
				document.location.reload()
				break
		}
	}

	function mouseMoveHandler(e) {
		var relativeX = e.clientX - canvas.offsetLeft
		if (relativeX > 0 && relativeX < canvas.width) {
			hair.x = relativeX
		}
		var relativeY = e.clientY - canvas.offsetTop
		if (relativeY > 0 && relativeY < canvas.height) {
			hair.y = relativeY
		}
	}

	function sceneText(txt) {
		ctx.clearRect(0, 0, canvas.width, canvas.height) //clear canvas
		ctx.fillStyle = 'white'
		ctx.font = '35px Arial'
		ctx.textAlign = 'center'
		ctx.fillText(txt, canvas.width / 2, canvas.height / 2)
	}

	function targetHandle(curTrgt) {
		if (
			hair.x >= curTrgt.x &&
			hair.x <= curTrgt.x + curTrgt.s &&
			hair.y >= curTrgt.y &&
			hair.y <= curTrgt.y + curTrgt.s
		) {
			//TARGET HIT!
			curTrgt.hit()
		} else {
			//TARGET MISS
			curTrgt.miss()
		}
	}

	function play(curTrgt, scn) {
		//sets up the PLAY scenes

		game.scoreSubtotal = 0
		//game.clicks = 0
		game.lives++

		function draw() {
			// drawing code
			ctx.clearRect(0, 0, canvas.width, canvas.height) //clear canvas
			curTrgt.draw()
			hair.draw()
			drawScore()
			curTrgt.shrinkOrDiss()
			//========================win/lose logic
			if (game.lives == 0) {
				cancelAnimationFrame(requestframeref)
				return scene_lose()
			}
			if (game.scoreSubtotal == game.scoreMax) {
				cancelAnimationFrame(requestframeref)
				requestframeref = null
				return scn()
			}
			requestframeref = requestAnimationFrame(draw) //add movement
		}
		draw()
	}

	//=================================================================================
	//======================SCENE PLAY 1
	//=================================================================================
	var scene_play1 = function() {
		sceneID = 'play1'
		game.lives--
		play(trgt, scene_interlude1)
	}

	//=================================================================================
	//======================SCENE PLAY 2
	//=================================================================================
	var scene_play2 = function() {
		sceneID = 'play2'
		play(trgt2, scene_interlude2)
	}
	//=================================================================================
	//======================SCENE PLAY 3
	//=================================================================================
	var scene_play3 = function() {
		sceneID = 'play3'
		play(trgt3, scene_interlude3)
	}
	//=================================================================================
	//======================SCENE PLAY 4
	//=================================================================================
	var scene_play4 = function() {
		sceneID = 'play4'
		play(trgt4, scene_interlude4)
	}
	//=================================================================================
	//======================SCENE PLAY 5
	//=================================================================================
	var scene_play5 = function() {
		sceneID = 'play5'
		play(trgt5, scene_win)
	}
	//=================================================================================
	//======================SCENE INTRO
	//=================================================================================
	var scene_intro = function() {
		sceneID = 'intro'
		sceneText('Welcome')
	}
	//=================================================================================
	//======================SCENE INTERLUDE 1
	//=================================================================================
	var scene_interlude1 = function() {
		sceneID = 'interlude1'
		sceneText('Great job, you completed Level 1.')
		drawScore()
	}
	//=================================================================================
	//======================SCENE INTERLUDE 2
	//=================================================================================
	var scene_interlude2 = function() {
		sceneID = 'interlude2'
		sceneText('Well done, you completed Level 2.')
		drawScore()
	}
	//=================================================================================
	//======================SCENE INTERLUDE 3
	//=================================================================================
	var scene_interlude3 = function() {
		sceneID = 'interlude3'
		sceneText('Fantastic, you completed Level 3.')
		drawScore()
	}
	//=================================================================================
	//======================SCENE INTERLUDE 4
	//=================================================================================
	var scene_interlude4 = function() {
		sceneID = 'interlude4'
		sceneText('Fabulous, you completed Level 4.')
		drawScore()
	}
	//=================================================================================
	//======================SCENE WIN
	//=================================================================================
	var scene_win = function() {
		sceneID = 'win'
		sceneText('Congratulations, you completed the game!')
		drawScore()
	}
	//=================================================================================
	//======================SCENE LOSE
	//=================================================================================
	var scene_lose = function() {
		sceneID = 'lose'
		sceneText('Better luck next time.')
		drawScore()
	}
	//=================================================================================
	//=================================================================================

	scene_intro()
	//scene_play1();
}
