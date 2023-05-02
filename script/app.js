const gameBoard = document.getElementById("root");
const frontStage = document.createElement("div");

let duckImgs = [];
let bulletImgs = [];
let randomYs = [];
let movingRight = true;

const lvlSystem = {
  lvlOne: {
    duckCount: 2,
    bullet: 4,
  },
  lvlTwo: {
    duckCount: 3,
    bullet: 5,
  },
};

let currentLevel = "lvlTwo";

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
  gameBoard.removeChild(gameBoard.children[0]);

  const duckCount = lvlSystem[currentLevel].duckCount;
  const bulletCount = lvlSystem[currentLevel].bullet;

  // console.log(bulletCount);

  for (let i = 0; i < bulletCount; i++) {
    let bulletImg = document.createElement("img");
    bulletImg.src = "./img/bullet.png";
    bulletImg.className = "bullet";
    bulletImg.style.left = `${0 + i * 20}px`;
    bulletImg.style.top = `10px`;
    bulletImgs.push(bulletImg);
    gameBoard.appendChild(bulletImg);
  }

  for (let i = 0; i < duckCount; i++) {
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

      gameBoard.appendChild(duckImg);
    }, i * 4000); // Delay each duck by i * 2000 milliseconds
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

setInterval(duckMove, 20);

gameBoard.addEventListener("click", (event) => {
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
      // The player has successfully shot the duck!
      duckKill(duckImg);
      console.log("good");
    }
  }
});

function duckKill(duckImg) {
  console.log("Good shot!");
  duckImg.src = `./img/duckkill.png`;

  // Clear the duckMove interval to stop the duck from moving

  //clearInterval must do this duck killed

  // clearInterval(duckMove);

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
