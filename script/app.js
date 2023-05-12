const gameBoard = document.getElementById("root");
const frontStage = document.createElement("div");
const bullets = document.createElement("div");
const aliveDuckCounts = document.createElement("div");

const gunShootSound = new Audio("../sound/gunShootSound.mp3");
const duckFlySound = new Audio("../sound/duckFlySound.mp3");
const fallSound = new Audio("../sound/fallSound.mp3");
const loseSound = new Audio("../sound/loseSound.mp3");
const winSound = new Audio("../sound/winSound.mp3");
const introSound = new Audio("../sound/introSound.mp3");
duckFlySound.volume = 0.1;

// Initialize empty arrays to hold image file paths and random Y-coordinates for the ducks
let aliveDuckImgs = [];
let duckImgs = [];
let bulletImgs = [];
let randomYs = [];

// Initialize variables to keep track of duck movement direction, game status, and number of killed ducks
let movingRight = true;
let gameStarted = false;
let killedDuck = 0;

// Initialize variable to keep track of whether or not the player has fired a shot
let isShotFired = false;

const lvlSystem = {
  lvlOne: {
    numbeOfDucks: 2,
    bullet: 4,
    speed: 20,
  },
  lvlTwo: {
    numbeOfDucks: 3,
    bullet: 5,
    speed: 19,
  },
  lvlThree: {
    numbeOfDucks: 4,
    bullet: 6,
    speed: 18,
  },
  lvlFour: {
    numbeOfDucks: 5,
    bullet: 7,
    speed: 17,
  },
  lvlFive: {
    numbeOfDucks: 6,
    bullet: 8,
    speed: 16,
  },
  lvlSix: {
    numbeOfDucks: 7,
    bullet: 9,
    speed: 15,
  },
  lvlSeven: {
    numbeOfDucks: 8,
    bullet: 10,
    speed: 14,
  },
  lvlEight: {
    numbeOfDucks: 9,
    bullet: 11,
    speed: 13,
  },
  lvlNine: {
    numbeOfDucks: 10,
    bullet: 12,
    speed: 12,
  },
  lvlTen: {
    numbeOfDucks: 11,
    bullet: 13,
    speed: 11,
  },
};

let newLvl = localStorage.getItem("currentLvl");
let newSpeed = localStorage.getItem("currentSpeed");

// If there is no value assigned to "newLvl" variable, set it to "lvlOne" string and save it in localStorage

if (!newLvl) {
  newLvl = "lvlOne";
  localStorage.setItem("currentLvl", newLvl);
}

if (!newSpeed) {
  newSpeed = "20";
  localStorage.setItem("currentSpeed", newSpeed);
}

let currentLevel = newLvl;
let currentSpeed = newSpeed;

const duckCount = lvlSystem[currentLevel].numbeOfDucks;
const bulletCount = lvlSystem[currentLevel].bullet;

let timeLeft = duckCount * 5;

let duckObj = {
  img: `./img/greenDuck.gif`,
  y: 350,
  x: 450,
};

function gameStart() {
  if (currentLevel == "lvlOne") {
    // check if the player lost the game and needs to restart from level one
    gameBoard.innerHTML = startBoard();
    // loseCondition();
  } else {
    // the player has progressed to the next level
    gameBoard.innerHTML = nextToNext();
  }

  frontStage.setAttribute("id", "frontStage");

  gameBoard.appendChild(frontStage);
}

function startGame() {
  gameStarted = true;

  gameBoard.removeChild(gameBoard.children[0]);

  startTimer();
  searchDuck();
  createBullets();
  createDucksIcon();
  createDucks();
}

// This function creates the bullets for the game.

const createBullets = () => {
  for (let i = 0; i < bulletCount; i++) {
    let bulletImg = document.createElement("img");
    bulletImg.src = "./img/bullet.png";
    bulletImg.className = "bullet";
    bulletImg.id = `bullet${i}`;
    bulletImg.style.left = `${0 + i * 20}px`;
    bulletImg.style.top = `10px`;
    bulletImgs.push(bulletImg);
    bullets.appendChild(bulletImg);
    gameBoard.appendChild(bullets);
  }
};
// This function creates the DucksIcon for the game.
const createDucksIcon = () => {
  for (let i = 0; i < duckCount; i++) {
    let aliveDuckImg = document.createElement("img");
    aliveDuckImg.src = "./img/aliveDuckCount.png";
    aliveDuckImg.className = "aliveDuckCount";
    aliveDuckImg.id = `aliveDuckCount${i}`;
    aliveDuckImg.style.right = `${0 + i * 20}px`;
    aliveDuckImg.style.top = `10px`;
    aliveDuckImgs.push(aliveDuckImg);
    aliveDuckCounts.appendChild(aliveDuckImg);
    gameBoard.appendChild(aliveDuckImg);
  }
};

// This function creates the Ducks for the game.

const createDucks = () => {
  for (let i = 0; i < duckCount; i++) {
    const delay = Math.floor(Math.random() * 6000); // Generate a random delay between 0 and 4000 milliseconds

    setTimeout(() => {
      let duckImg = document.createElement("img");
      duckImg.src = duckObj.img;
      duckImg.id = `duck-${i}`;
      duckImg.className = `duck`;
      duckImg.style.left = `${duckObj.x + i * 50}px`;
      duckImg.style.top = `${duckObj.y}px`;
      duckImgs.push(duckImg);

      randomYs.push(Math.floor(Math.random() * (550 - 0 + 1) + 150));

      if (Math.random() < 0.5) {
        movingRight = true;
        duckImg.style.transform = "scaleX(-1)";
      } else {
        movingRight = false;
      }

      duckFlySound.play();

      gameBoard.appendChild(duckImg);
    }, i * delay); // Delay each duck by a random amount of time
  }
};

function duckMove() {
  // Get the current top and left coordinates of the duck

  for (let i = 0; i < duckImgs.length; i++) {
    const duckImg = duckImgs[i];

    const duckTop = duckImg.offsetTop;
    const duckLeft = duckImg.offsetLeft;

    // Check if the duck has reached the right wall
    if (duckLeft >= gameBoard.offsetWidth - duckImg.offsetWidth) {
      // Change direction to left
      movingRight = false;
      // Set a new random target Y coordinate
      randomYs[i] = Math.floor(Math.random() * (350 - 0 + 1) + 0);
    }

    // Check if the duck has reached the left wall
    if (duckLeft <= 0) {
      // Change direction to right
      movingRight = true;
      // Set a new random target Y coordinate
      randomYs[i] = Math.floor(Math.random() * (350 - 0 + 1) + 0);
    }

    // Check if the duck has reached its target Y coordinate
    if (duckTop <= randomYs[i]) {
      // Set a new random target Y coordinate
      randomYs[i] = Math.floor(Math.random() * (550 - 0 + 300) + 150);
    }

    // Update the top and left coordinates of the duck
    if (movingRight) {
      duckImg.style.left = `${duckLeft + 2}px`;
    } else {
      duckImg.style.left = `${duckLeft - 2}px`;
    }

    // Calculate the distance between the current top position and the target Y coordinate
    const distanceToTarget = randomYs[i] - duckTop;

    // Determine the speed of the descent based on the distance to the target
    const distanceToDrop = gameBoard.offsetHeight - duckTop - duckImg.offsetHeight;
    const descentSpeed = distanceToDrop < 100 ? 1 : 2;

    // Move the duck towards the target Y coordinate
    if (duckTop <= randomYs[i]) {
      duckImg.style.top = `${duckTop + descentSpeed}px`;
    } else {
      duckImg.style.top = `${duckTop - 2}px`;
    }
  }
}

setInterval(duckMove, currentSpeed);

gameBoard.addEventListener("click", (event) => {
  if (gameStarted) {
    countShoot();
  }
  // Get the x and y coordinates of the mouse click
  const mouseX = event.clientX - gameBoard.offsetLeft;
  const mouseY = event.clientY - gameBoard.offsetTop;

  // Loop through the duck image elements and check if the mouse click coordinates are within their boundaries
  for (let i = 0; i < duckImgs.length; i++) {
    const duckImg = duckImgs[i];
    const duckTop = duckImg.offsetTop;
    const duckLeft = duckImg.offsetLeft;
    if (
      mouseX >= duckLeft &&
      mouseX <= duckLeft + duckImg.offsetWidth &&
      mouseY >= duckTop &&
      mouseY <= duckTop + duckImg.offsetHeight
    ) {
      const duckId = duckImg.getAttribute("id");

      // The player has successfully shot the duck!
      duckKill(duckImg, duckId);
      countDuck();
    }
  }
});

function duckKill(duckImg, duckId) {
  fallSound.play();

  // duckImg.src = `./img/duckKill.png`;

  setTimeout(() => {
    duckImg.src = `./img/duckKill.png`;
  }, 2);

  setTimeout(() => {
    duckImg.src = `./img/duckDrop.png`;

    const duckTop = duckImg.offsetTop;
    const duckLeft = duckImg.offsetLeft;

    // Calculate the distance to drop the duck
    const distanceToDrop = gameBoard.offsetHeight - duckTop - duckImg.offsetHeight;

    // Calculate the descent speed based on the distance to drop
    const descentSpeed = distanceToDrop < 100 ? 10 : 10;

    // Drop the duck smoothly
    const dropDuck = setInterval(() => {
      // Get the current top coordinate of the duck
      const duckTop = duckImg.offsetTop;

      // Move the duck towards the bottom of the screen
      duckImg.style.top = `${duckTop + 10}px`;

      // Check if the duck has reached the bottom of the screen
      if (duckTop + duckImg.offsetHeight >= gameBoard.offsetHeight) {
        // Stop dropping the duck
        // clearInterval(dropDuck);
      }
    }, 20);
  }, "300");
}

function countShoot() {
  if (isShotFired) {
    gunShootSound.play();
  } else {
    isShotFired = true;
  }

  if (lvlSystem[currentLevel].bullet > 0) {
    lvlSystem[currentLevel].bullet -= 1;
    bullets.removeChild(bullets.lastChild);
  } else {
    loseCondition();
  }
}

const countDuck = () => {
  killedDuck += 1;

  deadDuckCounter(killedDuck);

  if (killedDuck == duckCount) {
    winCondition();
  }
};

function startTimer() {
  let timerIcon = document.createElement("h5");
  let lvlIcon = document.createElement("h5");
  lvlIcon.style.left = `54%`;
  lvlIcon.style.color = `red`;
  lvlIcon.textContent = newLvl;
  gameBoard.appendChild(lvlIcon);

  setInterval(() => {
    timeLeft--;
    if (timeLeft == 0) {
      loseCondition();
    } else {
      timerIcon.textContent = timeLeft;
      gameBoard.appendChild(timerIcon);
    }
  }, 1000);
}

function winCondition() {
  winDog();

  setTimeout(() => {
    // Remove all duck images from the game board
    duckImgs.forEach((duckImg) => duckImg.remove());

    // Check if there's a higher level available
    const nextLevel = getNextLevel(currentLevel);

    if (nextLevel) {
      // Update the level and speed in local storage
      localStorage.setItem("currentLvl", nextLevel);
      localStorage.setItem("currentSpeed", lvlSystem[nextLevel].speed.toString());
    }
    // Reload the page
    location.reload();
  }, 1500);
}

// Helper function to get the next level
function getNextLevel(level) {
  const levelKeys = Object.keys(lvlSystem);
  const currentLevelIndex = levelKeys.indexOf(level);
  if (currentLevelIndex < levelKeys.length - 1) {
    return levelKeys[currentLevelIndex + 1];
  }
  return null;
}

const loseCondition = () => {
  localStorage.setItem("currentLvl", "lvlOne");
  localStorage.setItem("currentSpeed", "20");
  fallSound.pause();
  duckFlySound.pause();
  loseSound.play();
  loseDog();

  setTimeout(() => {
    gameBoard.innerHTML = loseBoard();
  }, 800);

  setTimeout(() => {
    location.reload();
  }, 3000);
};

const deadDuckCounter = (killedDuck) => {
  for (let i = 0; i < killedDuck; i++) {
    aliveDuckImgs[i].src = `./img/deadDuckCount.png`;
  }
};

function createDog(src, id, className, topPosition) {
  let dogImg = document.createElement("img");
  dogImg.src = src;
  dogImg.id = id;
  dogImg.className = className;
  dogImg.style.top = topPosition;

  gameBoard.appendChild(dogImg);
}

function winDog() {
  createDog("./img/winDog.png", "winDogs", "winDogs", "290px");
}

function loseDog() {
  createDog("./img/loseDog.png", "winDogs", "winDogs", "300px");
}

function searchDuck() {
  let searchDogImg = document.createElement("img");
  searchDogImg.src = `./img/searchDuck.gif`;
  searchDogImg.id = `searchDogImg`;
  searchDogImg.className = `searchDogImg`;

  gameBoard.appendChild(searchDogImg);
}

function startBoard() {
  introSound.play();
  return ` <div id="gameStartBoard">
  <h1>Kill a lot of duck</h1>
  <h2>"Retro gaming"</h2>
  <h3><3</h3>
  <h4>${newLvl}</h4>
  <a href="#" onclick="startGame()">Start game</a> 
  </div>
  `;
}

function nextToNext() {
  winSound.play();
  return `
  <div id="gameStartBoard">
  <h2>You Win !!</h2>
  <h2>Next</h2>
  <h3>${newLvl}</h3>
  <a href="#" onclick="startGame()">Start</a> 
  </div> `;
}

function loseBoard() {
  return `
  <div id="gameStartBoard">
  <h2>You Lose !!</h2>
  <h2>Try Again</h2>
  </div> `;
}

gameStart();
