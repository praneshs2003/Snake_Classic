const gameBoard = document.getElementById('gameBoard');
const context = gameBoard.getContext('2d');
const scoreElement = document.getElementById('scoreValue');
const highScore = document.getElementById('highScore');

let gameFacts = document.getElementById('showFact'); // API CALL FOR THE GAMING TRIVIA QUESTIONS STARTS HERE
let ansBox = document.getElementById('ansBox');
let buttonClick = document.getElementById('answerButton');

buttonClick.addEventListener('click',()=>{
fetch('https://opentdb.com/api.php?amount=50&category=15&difficulty=medium&type=multiple')
.then((res)=>res.json())
.then((facts)=>{
    const ques = Math.floor(Math.random()*facts.results.length);
    gameFacts.innerHTML = facts.results[ques].question;
    ansBox.innerHTML = "Answer:  "+ '    '+ facts.results[ques].correct_answer;
})
.catch((error)=>{console.log(error)
    gameFacts.innerHTML = "something went wrong. please try again";
    ansBox.innerHTML = " ";
    console.log(error.message)
})    })   //ENDS HERE

// LOGIC OF THE GAME STARTS HERE
const WIDTH = gameBoard.width;
const HEIGHT = gameBoard.height;

const snakePos = 25;
const foodPos = 25;
let foodX;
let foodY;
let X_Direction = 25;
let Y_Direction = 0;
let score = 0;
let highestScore = 0;
let speed = 400;
let active = true;
let started = false;

scoreElement.textContent = score; // TO DISPLAY THE CURRENT SCORE
highScore.textContent = localStorage.getItem("highScore"); // TO DISPLAY THE HIGHEST SCORE


let snake = [
    {x:foodPos,y:0},
    {x:0,y:0}
]  // SNAKE'S BODY


window.addEventListener('keydown',keyBinding)
startGame();

function startGame(){
    context.fillStyle = 'gray';
                  //(x,y,width,height)
    context.fillRect(0,0,WIDTH,HEIGHT);
    description();
}

function clearBoard()
{
    context.fillStyle = 'gray';
                    //(x,y,width,height)
    context.fillRect(0,0,WIDTH,HEIGHT);
}

function createFood(){  // FUNCTION TO CREATE THE FOOD POS
    foodX = (Math.floor(Math.random()*WIDTH/foodPos)*foodPos);
    foodY = (Math.floor(Math.random()*HEIGHT/foodPos)*foodPos);
}

function displayFood() // FUNCTION TO DISPLAY THE FOOD
{
    context.fillStyle = 'white';
    context.fillRect(foodX,foodY,foodPos,foodPos);
}

function drawSnake()  // FUNCTION TO DISPLAY THE SNAKE
{
    context.fillStyle = 'lightgreen';
    context.strokeStyle = 'black';
    snake.forEach((snakeBody)=>{
        context.fillRect(snakeBody.x,snakeBody.y,snakePos,snakePos);
        context.strokeRect(snakeBody.x,snakeBody.y,snakePos,snakePos);
    })
}

function moveSnake()  // MOVEMENT OF THE SNAKE
{
    const head = {x:snake[0].x + X_Direction, y:snake[0].y + Y_Direction}
    snake.unshift(head);
    if(snake[0].x == foodX && snake[0].y == foodY)
    {
        score += 1;
        if(score>localStorage.getItem("highScore"))
        {
            highestScore = score;
            localStorage.setItem("highScore",highestScore);
            highScore.textContent = localStorage.getItem("highScore");
        }
        if(score%15==0)
        {
            speed -= 20;
        }
        scoreElement.textContent = score;
        createFood();
    }
    else
        snake.pop();
}


function nextFrame()
{
    if(active)
    {
    setTimeout(()=>{
        clearBoard();
        displayFood();
        moveSnake();
        drawSnake();
        checkGameOver();
        nextFrame();
    },speed);
    }
    else{
        clearBoard();
        context.font = "bold 50px serif";
        context.fillStyle = "red";
        context.textAlign = "center";
        context.fillText("Game Over!!",WIDTH/2,HEIGHT/2);
        context.fillText("Your Score: "+score,310,350);
    }
}

function keyBinding(event)  // ADDING KEYBINDINGS
{
    if(!started){
        started = true;
        createFood();
        nextFrame();
    }

    const LEFT = 37;
    const RIGHT = 39;
    const UP = 38;
    const DOWN = 40;
    
    switch(true){
        case(event.keyCode == LEFT && X_Direction!=snakePos):
            X_Direction = -snakePos;
            Y_Direction = 0;
            break;

        case(event.keyCode == RIGHT && X_Direction != -snakePos):
            X_Direction = snakePos;
            Y_Direction = 0;
            break;

        case(event.keyCode == UP && Y_Direction != snakePos):
            X_Direction = 0;
            Y_Direction = -snakePos;
            break;

        case(event.keyCode == DOWN && Y_Direction != -snakePos):
            X_Direction = 0;
            Y_Direction = snakePos;
            break;
    }
}

function checkGameOver()  //FUNCTION TO CHECK WHETHER THE GAME IS OVER
{
    switch(true){
        case(snake[0].x<0):
        case(snake[0].x>=WIDTH):
        case(snake[0].y<0):
        case(snake[0].y>=HEIGHT):
            active = false;
            break;
    }

    for(let i = 1; i < snake.length; i+=1){
        if(snake[i].x == snake[0].x && snake[i].y == snake[0].y){
            active = false;
        }
    }
}

function description(){   // TO DISPLAY THE RULES OF THE GAME
context.font = "bold 20px serif";
context.fillStyle = "lightgreen";
context.textAlign = "start";
context.fillText("' Press any button to start '",190,200);
context.fillText("Do not hit the wall or touch the body of the snake",100,250);
context.fillText("If you did, the Game will End",180,300);
context.fillText("The speed of the snake will increase for every '15' Points",60,350);
context.fillText("You score will be calculated",190,400);
}


//ENDS HERE