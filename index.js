const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const settings = {
	player: {
		width: 20,
		height: 80,
		color: 'rgb(0, 204, 255)',
		speed: 6
	}, 
	ball: {
		color: 'rgb(0, 204, 255)',
		speed: 7
	}
};

let players = [];
let ball;

function setup() {
	addRoundRectCanvasPrototype();
	applyCanvasDimensions();

	createBall();
	createPlayers();
	
	startMappingPressedKeys();
	startMappingReleasedKeys();

	draw();
}

function addRoundRectCanvasPrototype() {
	CanvasRenderingContext2D.prototype.roundRect = function (x, y, w, h, r) {
		if (w < 2 * r) r = w / 2;
		if (h < 2 * r) r = h / 2;
		this.beginPath();
		this.moveTo(x+r, y);
		this.arcTo(x+w, y,   x+w, y+h, r);
		this.arcTo(x+w, y+h, x,   y+h, r);
		this.arcTo(x,   y+h, x,   y,   r);
		this.arcTo(x,   y,   x+w, y,   r);
		this.closePath();
		return this;
	}
}

function applyCanvasDimensions() {
	canvas.width = 1000;
	canvas.height = 600;
	// canvas.width = 0.8 * window.innerWidth;
	// canvas.height = 0.8 * window.innerHeight;
}

function createBall() {
	ball = new Ball();
  ball.resetBall();
}

function createPlayers() {
	players = [];
	for (let i = 0; i < 2; i++) {
		players.push(new Player());
  }
	
	players[1].x = canvas.width - 50 - players[1].width;
}

function startMappingPressedKeys() {
	document.addEventListener('keydown', (event) => {
		if (event.code === 'ArrowDown') {
			players[1].direction = 1;
		}
		
		if (event.code === 'ArrowUp') {
			players[1].direction = -1;
		}
		
		
		if (event.code === 'KeyS') {
			players[0].direction = 1;
		}
		
		if (event.code === 'KeyW') {
			players[0].direction = -1;
		}
	});
}

function startMappingReleasedKeys() {
	document.addEventListener('keyup', (event) => {
		if (event.code === 'ArrowDown' || event.code === 'ArrowUp') {
			players[1].direction = 0;
		}
		
		if (event.code === 'KeyS' || event.code === 'KeyW') {
			players[0].direction = 0;
		}
	});	
}

function draw() {
	requestAnimationFrame(draw);

	clearCanvas();
	updatePlayers();
	updateBall();
}

function clearCanvas() {
	ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
}

function updatePlayers() {
	for (let i = 0; i < players.length; i++) {
		players[i].draw();
		players[i].move();
	}
}

function updateBall() {
	ball.draw();
	ball.update();
  ball.collisionDetection();
}

class Player {
	constructor() {
		this.x = 50;
		this.y = canvas.height / 2;
		this.dy = settings.player.speed;
		this.width = settings.player.width;
		this.height = settings.player.height;
		this.color = settings.player.color;
		this.direction = 0;
		this.score = 0;
		this.scoreElement = document.getElementById(`p${players.length}`);
	}
	
	draw() {
		ctx.shadowColor = this.color;
		ctx.shadowBlur = 20;

		ctx.fillStyle = this.color;
		ctx.roundRect(this.x, this.y, this.width, this.height, 10).fill();
	}
	
  move() {
		if (this.direction === 1) {
			if (!(this.y < canvas.height - players[0].height)) {
				return;
			}
		}

		if (this.direction === -1) {
			if (!(this.y > 0)) {
				return;
			}
		}

    this.y += this.dy * this.direction;
  }
  
  increaseScore() {
    this.score++;
    this.scoreElement.textContent = this.score;
  }
}

class Ball {
	constructor() {
		this.radius = 10;
	}
	
	draw() {
		ctx.beginPath();
		ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
		ctx.fillStyle = settings.ball.color;
		ctx.fill();
	}
	
	update() {
		this.x += this.dx;
		this.y += this.dy;
		this.magnitude = Math.sqrt(Math.pow(this.dx, 2) + Math.pow(this.dy, 2));
    
    if (this.x + this.radius > canvas.width) {
      this.resetBall();
      players[0].increaseScore();
    }
    
    if (this.x - this.radius <= 0) {
      this.resetBall();
      players[1].increaseScore();
    }
		
		if (this.y + this.radius > canvas.height ||
			this.y - this.radius < 0) {
				this.dy = -this.dy;
    }
	}
	
	collisionDetection() {
		if (this.x + this.radius == players[1].x && this.y >= players[1].y && this.y <= players[1].y + settings.player.height) {
			this.dx = -this.dx;
		}
		
		if (this.x - this.radius == players[0].x + players[0].width && this.y >= players[0].y && this.y <= players[0].y + settings.player.height) {
			this.dx = -this.dx;
		}
  }
  
  resetBall() {
    const randomSignX = Math.random() > 0.5 ? 1 : -1;
    const randomSignY = Math.random() > 0.5 ? 1 : -1;

    this.x = canvas.width / 2;
    this.y = canvas.height / 2;
    
    this.dx = settings.ball.speed * randomSignX;
    this.dy = settings.ball.speed * Math.random() * randomSignY;
  }
}

setup();