const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const menu = document.getElementById("menu");
const playerScoreEl = document.getElementById("playerScore");
const aiScoreEl = document.getElementById("aiScore");

let gameRunning = false;
let paused = false;

// Paddle settings
const paddleWidth = 10;
const paddleHeight = 100;
let playerY = canvas.height / 2 - paddleHeight / 2;
let aiY = canvas.height / 2 - paddleHeight / 2;

// Ball settings
let ballX = canvas.width / 2;
let ballY = canvas.height / 2;
let ballSpeedX = 5;
let ballSpeedY = 5;
const ballSize = 10;

// Scores
let playerScore = 0;
let aiScore = 0;

// Controls
let upPressed = false;
let downPressed = false;

document.addEventListener("keydown", (e) => {
    if (e.key === "ArrowUp") upPressed = true;
    if (e.key === "ArrowDown") downPressed = true;

    if (e.key === " ") {
        gameRunning = true;
        menu.style.display = "none";
    }

    if (e.key.toLowerCase() === "p") {
        paused = !paused;
    }
});

document.addEventListener("keyup", (e) => {
    if (e.key === "ArrowUp") upPressed = false;
    if (e.key === "ArrowDown") downPressed = false;
});

function resetBall() {
    ballX = canvas.width / 2;
    ballY = canvas.height / 2;
    ballSpeedX *= -1;
}

function update() {
    if (!gameRunning || paused) return;

    // Player movement
    if (upPressed && playerY > 0) playerY -= 7;
    if (downPressed && playerY < canvas.height - paddleHeight) playerY += 7;

    // AI movement
    if (aiY + paddleHeight / 2 < ballY) aiY += 4;
    else aiY -= 4;

    // Ball movement
    ballX += ballSpeedX;
    ballY += ballSpeedY;

    // Wall collision
    if (ballY <= 0 || ballY >= canvas.height - ballSize) {
        ballSpeedY *= -1;
    }

    // Player paddle collision
    if (
        ballX <= paddleWidth &&
        ballY > playerY &&
        ballY < playerY + paddleHeight
    ) {
        ballSpeedX *= -1;
    }

    // AI paddle collision
    if (
        ballX >= canvas.width - paddleWidth - ballSize &&
        ballY > aiY &&
        ballY < aiY + paddleHeight
    ) {
        ballSpeedX *= -1;
    }

    // Scoring
    if (ballX < 0) {
        aiScore++;
        aiScoreEl.textContent = aiScore;
        resetBall();
    }

    if (ballX > canvas.width) {
        playerScore++;
        playerScoreEl.textContent = playerScore;
        resetBall();
    }
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw paddles
    ctx.fillStyle = "white";
    ctx.fillRect(0, playerY, paddleWidth, paddleHeight);
    ctx.fillRect(canvas.width - paddleWidth, aiY, paddleWidth, paddleHeight);

    // Draw ball
    ctx.fillRect(ballX, ballY, ballSize, ballSize);

    // Center line
    ctx.fillStyle = "gray";
    ctx.fillRect(canvas.width / 2 - 2, 0, 4, canvas.height);
}

function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

gameLoop();
