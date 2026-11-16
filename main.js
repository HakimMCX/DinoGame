const canvas = document.getElementById("game_area"); //the paper
const ctx /*context*/ = canvas.getContext("2d"); //the marker

const dinoHeight = 60;
const dinoWidth = 39;
const dinoX = 50; //Distance from the left edge of the canvas.

const groundY = 250;    
let dinoY = groundY - dinoHeight/2;

// game states
let gameOver = false;
let score = 0;
let highScore = Number(localStorage.getItem("dinoHighScore")) || 0;

const dinoImg = new Image(); //create new image object
dinoImg.src = "images/dino1.png"; //attach sprite

function drawDino() {
    // draw image at x, y and width, height we set earlier
    ctx.drawImage(dinoImg, dinoX, dinoY, dinoWidth, dinoHeight);
}

//dinoImg.onload = drawDino; //run the drawDino func when image is loaded  

const groundImg = new Image(); //create new image object
groundImg.src = "images/ground.png"; //attach sprite

function drawTrack() {
    // draw the ground image
    ctx.drawImage(groundImg, 0, groundY, canvas.width, canvas.height - groundY);
}

//groundImg.onload = drawTrack; //run the drawDino func when image is loaded  

//PROPERTIES
let dinoSpeedY = 0;
let onGround = true;
const gravity = 0.6;
const jumpPower = -12; //-y keatas

//DETECTION
document.addEventListener("keydown", function(event){ //action key //keydown(press) , keyup(release)
    if(event.code === "Space" && onGround){
        event.preventDefault(); //stop the page from scrolling down

        dinoSpeedY = jumpPower; //launch the dino upward
        onGround = false; //the dino is now in the air (jump)
    }

})

function moveDino(){
    dinoSpeedY += gravity;
    dinoY += dinoSpeedY; 

    //detect his leg, reset everything
    if(dinoY+dinoHeight/2 >= groundY){
        //reset dino y position
        dinoY = groundY - dinoHeight/2;

        dinoSpeedY = 0;
        onGround = true;
    }
}

//SPAWN CACTI
const cactusWidth = 34;
const cactusHeight = 70;

let cactiX = []; //x position cactus
let cactusSpeed = 6;
let spawnTimer = 100;

const cactusImg = new Image(); //create new image object
cactusImg.src = "images/cactus.png"; //attach sprite

function drawCacti() {
    for (const x of cactiX){
        ctx.drawImage(cactusImg, x, groundY-cactusHeight/2, cactusWidth, cactusHeight);
    }
}

function moveCacti() {
    spawnTimer--;

    if(spawnTimer<=0){
        //spawn cactus
        //canvas width = right most side of the canvas
        cactiX.push(canvas.width);

        spawnTimer = 67 + Math.random() * 90; //random between 0-1
    }

    //
    for(let i=0; i<cactiX.length; i++){
        cactiX[i] -= cactusSpeed; //move to left
    }
    cactiX = cactiX.filter(function(x){
        return x>0
    })
}

function saveHighScore() {
    // only save if the new score beats the old high score
    if (score > highScore) {
        highScore = score;
        localStorage.setItem("dinoHighScore", highScore);
    }
}

function checkCollision() {
    const cactusY = groundY - cactusHeight / 2;

    // the four edges of the dino
    const dinoLeft = dinoX;
    const dinoRight = dinoX + dinoWidth;
    const dinoTop = dinoY;
    const dinoBottom = dinoY + dinoHeight;

    for (const x of cactiX) {
        // the four edges of this cactus
        const cactusLeft = x;
        const cactusRight = x + cactusWidth;
        const cactusTop = cactusY;
        const cactusBottom = cactusY + cactusHeight;

        if (
            dinoLeft < cactusRight &&   // dino is not past the cactus's right side
            dinoRight > cactusLeft &&   // dino is not before the cactus's left side
            dinoTop < cactusBottom &&   // dino is not under the cactus
            dinoBottom > cactusTop      // dino is not above the cactus
        ) {
            gameOver = true;
        }
    }
}

function drawScore() {
    ctx.font = "20px monospace";
    ctx.fillText("HI " + highScore, canvas.width - 350, 30);
    ctx.fillText(score, canvas.width - 200, 30);
}

//GAME LOOP this function runs every frame
function gameLoop() {
    // clear the old frame
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (gameOver) {
        // set the font to monospace
        ctx.font = "20px monospace";
        // draw near the center of the canvas
        ctx.fillText("GAME OVER", canvas.width / 2 - 50, canvas.height / 2 - 50);
    } else {
        // only move things if the game is not over
        moveDino();
        moveCacti();
        checkCollision();
        score += 1;
    }

    // draw ground, cacti, dino, then the score on top
    drawTrack();
    drawCacti();
    drawDino();
    drawScore();

    // run this function again on the next frame
    requestAnimationFrame(gameLoop);
}

// start the first frame
requestAnimationFrame(gameLoop);
