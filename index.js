const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const settings = {
	player: {
		width: 20,
		height: 80,
		color: 'red',
		speed: 7
	}, 
	ball: {
		speed: 5
	},
	factors: {
		angleRandomness: 2
	}
};

let players = [];
let ball;

document.addEventListener('keydown', (event) => {
	if(event.code === 'ArrowDown') {
    players[1].direction = 1;
	}
	
	if(event.code === 'ArrowUp') {
    players[1].direction = -1;
	}
	
	
	if(event.code === 'KeyS') {
    players[0].direction = 1;
	}
	
	if(event.code === 'KeyW') {
    players[0].direction = -1;
  }
}, true);

document.addEventListener('keyup', (event) => {

  if(event.code === 'ArrowDown' || event.code === 'ArrowUp') {
    players[1].direction = 0;
	}
	
	if(event.code === 'KeyS' || event.code === 'KeyW') {
    players[0].direction = 0;
  }
});

function setup() {
	canvas.width = 1000;
	canvas.height = 600;
	players = [];
  ball = new Ball();
  ball.resetBall();
	
	for(let i = 0; i < 2; i++) {
		players.push(new Player());
  }
	
	players[1].x = canvas.width - 50 - players[1].width;
	
	draw();
}

function draw() {
	requestAnimationFrame(draw);
	ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
	
	for (let i = 0; i < 2; i++) {
		players[i].draw();
		players[i].move();
	}
	
	ball.draw();
	ball.update();
  ball.collisionDetection();
}

function Player() {
	this.x = 50;
	this.y = canvas.height / 2;
	this.dy = settings.player.speed;
	this.width = settings.player.width;
	this.height = settings.player.height;
	this.color = settings.player.color;
  this.direction = 0;
  this.score = 0;
  this.scoreElement = document.getElementById(`p${players.length}`);
	
	this.draw = function() {
		ctx.fillStyle = this.color;
		ctx.fillRect(this.x, this.y, this.width, this.height);
	}
	
  this.move = function() {
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
  
  this.increaseScore = function() {
    this.score++;
    this.scoreElement.textContent = this.score;
  }
}

function Ball() {
	this.radius = 10;
	
	this.draw = function() {
		ctx.beginPath();
		ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
		ctx.fillStyle = 'white';
		ctx.fill();
	}
	
	this.update = function() {
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
	
	this.collisionDetection = function() {
		if (this.x + this.radius == players[1].x && this.y >= players[1].y && this.y <= players[1].y + settings.player.height) {
			this.dx = -this.dx;
      this.dy = -newBallDYBasedonOnHitPosition(this.y, players[1].y);
		}
		
		if (this.x - this.radius == players[0].x + players[0].width && this.y >= players[0].y && this.y <= players[0].y + settings.player.height) {
			this.dx = -this.dx;
      this.dy = -newBallDYBasedonOnHitPosition(this.y, players[0].y);
		}
  }
  
  this.resetBall = function() {
    const randomSignX = Math.random() > 0.5 ? 1 : -1;
    const randomSignY = Math.random() > 0.5 ? 1 : -1;

    this.x = canvas.width / 2;
    this.y = canvas.height / 2;
    
    this.dx = settings.ball.speed * randomSignX;
    this.dy = settings.ball.speed * Math.random() * randomSignY;
  }
}

// function calculateDeflectionAngle(balldx, balldy, ballY, playerY) {
// 	const halfPlayerHeight = settings.player.height / 2;
// 	const hitHeightFactor = (playerY - ballY + halfPlayerHeight) / halfPlayerHeight;
	
// 	const atan2Angle = Math.atan2(balldy, balldx) * (180 / Math.PI);
// 	const degrees = atan2Angle;
// 	// console.log(degrees);
// }

function newBallDYBasedonOnHitPosition(ballY, playerY) {
  const playerHeight = settings.player.height;
  const hitYPositionFromCenter = (playerHeight / 2) - ballY + playerY;

  return hitYPositionFromCenter / (playerHeight / 2);
}

setup();