//getting access to the canvas declared in html using "doctype..."
let canvas = document.getElementById('myCanvas');

//obtain the 2D rendering context for canvas, so we can preform drawing operations
//for drawing shapes, lines, text, and images
let c = canvas.getContext('2d');

let rightPressed = false;
let leftPressed = false;

//dimensions of ball
let ballRadius = 10;

//create variables
let x = canvas.width / 2;
let y = canvas.height - 30;
let dx = 2;
let dy = -2;

//paddle variables
let paddleHeight = 12;
let paddleWidth = 72;
//start point
let paddleX = (canvas.width - paddleWidth) / 2;
//count
//variables for right/ left movement
let brickRows = 4;
let brickColumns = 7;
let brickWidth = 72
let brickHeight = 24;
let brickPadding = 12;
let brickOffsetTop = 32;
let brickOffsetLeft = 32;

//variables for score
let score = 0;

//variables for bricks
let bricks = [];
for (i = 0; i < brickColumns; i++) {
  bricks[i] = [];
  for (j = 0; j < brickRows; j++) {
    //x and y positions of bricks
    bricks[i][j] = { x: 0, y: 0, status: 1 };
  }
}

//adding event listeners for paddle movement (depeneds on mouse movement)
document.addEventListener('keydown', keyDownHandler, false);
document.addEventListener('keyup', keyUpHandler, false);
document.addEventListener('mousemove', mouseMovementHandler, false);

//handler for mouseMovement
function mouseMovementHandler(e) {
  //calculate position of mouse relative to canvas pos and dist from left edge:
  //e.clientX is the x pos of mouse
  var relativeX = e.clientX - canvas.offsetLeft;
  //checking if mouse is in bounds:
  if (relativeX > 0 && relativeX > canvas.width) {
    //then paddle pos = mouse pos (at center of paddle)
    paddleX = relativeX - paddleWidth / 2;
  }
}
//** e represents object passed into function **

//handler for keyDown
function keyDownHandler(e) {
  if (e.keyCode === 39) { //checks right arrow key
    rightPressed = true;
  }
  else if (e.keyCode === 37) { //checks left arrow key
    leftPressed = true;
  }
}

function keyUpHandler(e) {
  if (e.keyCode === 39) { //checks right arrow key
    rightPressed = false;
  }
  else if (e.keyCode === 37) { //checks left arrow key
    leftPressed = false;
  }
}

function drawBall() {
  c.beginPath();
  c.arc(x, y, ballRadius, 0, Math.PI * 2);
  //centered at position (x,y)
  c.fillStyle = 'red';
  c.fill();
  c.closePath();
}

//func to create paddle
function drawPaddle() {
  c.beginPath();
  c.rect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight);
  c.fillstyle = 'green';
  c.fill();
  c.closePath();
}

//func to draw bricks
function drawBricks() {
  for (i = 0; i < brickColumns; i++) {
    for (j = 0; j < brickRows; j++) {
      if (bricks[i][j].status === 1) {
        let brickX = (i * (brickWidth + brickPadding)) + brickOffsetLeft;
        let brickY = (j * (brickHeight + brickPadding)) + brickOffsetTop;

        bricks[i][j].x = brickX;
        bricks[i][j].y = brickY;
        c.beginPath();
        c.rect(brickX, brickY, brickWidth, brickHeight);
        c.fillStyle = '#8500 cc';
        c.fill();
        c.closePath();
      }
    }
  }
}

//score function
function drawScore() {
  c.font = '20px monospace';
  c.fillStyle = 'brown';
  c.fillText('score: ' + score, 8, 20);
}

function collisionDetection() {
  for (i = 0; i < brickColumns; i++) {
    for (j = 0; j < brickRows; j++) {
      let b = bricks[i][j];
      if (b.status === 1) {
        if (x > b.x && x < b.x + brickWidth && y > b.y && y < b.y + brickHeight) {
          dy = -dy;
          b.status = 0;
          score++; //+1 score on collision
          if (score === brickRows * brickColumns) {
            alert('Congratulations!! You\'ve won!');
            document.location.reload();
          }
        }
      }
    }
  }
}

function draw() {
  //clear so circle can be drawn
  c.clearRect(0, 0, canvas.width, canvas.height);
  drawScore();
  drawBricks();
  drawBall();
  drawPaddle();
  collisionDetection();

  //calculate collision detections
  //walls (left-right)
  if (x + dx > canvas.width - ballRadius || x + dx < ballRadius) {
    dx = -dx;
  }
  //top wall
  if (y + dy < ballRadius) {
    dy = -dy;
  }
  else if (y + dy > canvas.height - ballRadius) {
    //paddle hits ball detection:
    if (x > paddleX && x < paddleX + paddleWidth) {
      dy = -dy;
    }
    else {
      alert("GAME OVER!!! GET GOOD.");
      document.location.reload();
    }
  }
  //bottom wall
  if (y + dy > canvas.height - ballRadius || y + dy < ballRadius) {
    dy = -dy;
  }
  //to make the paddle move:
  if (rightPressed && paddleX < canvas.width - paddleWidth) {
    paddleX += 7;
  }
  else if (leftPressed && paddleX > 0) {
    paddleX -= 7;
  }
  else if (leftPressed && paddleX > 0) {
    paddleX -= 7;
  }

  //ball movement
  x += dx; //updates every frame
  y += dy;

}
//infinite loop: creates ball every 10ms
setInterval(draw, 10)
