const gameBoard = document.getElementById("root");
const frontStage = document.createElement("div");
const bullets = document.createElement("div");
const aliveDuckCounts = document.createElement("div");

let aliveDuckImgs = [];
let duckImgs = [];
let bulletImgs = [];
let randomYs = [];
let movingRight = true;
let count = 0;
let gameStarted = false;
let killedDuck = 0;

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
    numbeOfDucks: 5,
    bullet: 7,
    speed: 18,
  },
};

let newLvl = localStorage.getItem("currentLvl");
let newSpeed = localStorage.getItem("currentSpeed");

let currentLevel = newLvl;
let currentSpeed = newSpeed;

// localStorage.setItem("currentLvl", "lvlOne");

let duckObj = {
  img: `./img/greenDuck.png`,
  y: 350,
  x: 450,
  isDuckDead: false,
};

function gameStart() {
  gameBoard.innerHTML = startBoard();

  frontStage.setAttribute("id", "frontStage");

  gameBoard.appendChild(frontStage);
}

function startGame() {
  gameStarted = true;
  gameBoard.removeChild(gameBoard.children[0]);

  const duckCount = lvlSystem[currentLevel].numbeOfDucks;
  const bulletCount = lvlSystem[currentLevel].bullet;

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

      console.log(delay);

      gameBoard.appendChild(duckImg);
    }, i * delay); // Delay each duck by a random amount of time
  }
}

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
      console.log(duckId);
      console.log(event.target);
      // The player has successfully shot the duck!
      duckKill(duckImg, duckId);
      countDuck();
    }
  }

  console.log(randomYs);
});

function duckKill(duckImg, duckId) {
  console.log("Good shot!");
  duckImg.src = `./img/duckkill.png`;

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

  if (killedDuck == lvlSystem[currentLevel].numbeOfDucks) {
    winCondition();
  }
};

function winCondition() {
  // Remove all duck images from the game board
  duckImgs.forEach((duckImg) => duckImg.remove());

  if (currentLevel == "lvlOne") {
    localStorage.setItem("currentLvl", "lvlTwo");
    localStorage.setItem("currentSpeed", "19");
  } else if (currentLevel == "lvlTwo") {
    localStorage.setItem("currentLvl", "lvlThree");
    localStorage.setItem("currentSpeed", "14");
  }

  // localStorage.setItem("currentLvl", "lvlTwo");
  location.reload();
}

const loseCondition = () => {
  localStorage.setItem("currentLvl", "lvlOne");
  localStorage.setItem("currentSpeed", "20");
  location.reload();
};

const deadDuckCounter = (killedDuck) => {
  for (let i = 0; i < killedDuck; i++) {
    aliveDuckImgs[i].src = `./img/deadDuckCount.png`;
  }

  console.log(aliveDuckImgs);
};

function startBoard() {
  return ` <div id="gameStartBoard">
  <h1>Kill a lot of duck</h1>
  <h2>"Retro gaming"</h2>
  <h3><3</h3>
  <a href="#" onclick="startGame()">Start game</a> 
  </div>
  `;
}

gameStart();
