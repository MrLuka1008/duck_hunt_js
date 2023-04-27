const gameBoard = document.getElementById("root");
const frontStage = document.createElement("div");
let duckImg = document.createElement("img");
let randomY = Math.floor(Math.random() * (350 - 0 + 1) + 0);
let movingRight = true;

let duckObj = {
  img: `./img/greenDuck.png`,
  y: 350,
  x: 450,
};

console.log(randomY);

function gameStart() {
  gameBoard.innerHTML = startBoard();

  frontStage.setAttribute("id", "frontStage");

  gameBoard.appendChild(frontStage);
}

function startGame() {
  gameBoard.removeChild(gameBoard.children[0]);

  duckImg.src = duckObj.img;
  duckImg.id = "duck";
  duckImg.style.left = `${duckObj.x}px`;
  duckImg.style.top = `${duckObj.y}px`;

  // Add the new duck to the game board

  gameBoard.appendChild(duckImg);
}

const duckMove = setInterval(() => {
  // Get the current top and left coordinates of the duck
  const duckTop = duckImg.offsetTop;
  const duckLeft = duckImg.offsetLeft;

  // Check if the duck has reached the right wall
  if (duckLeft >= gameBoard.offsetWidth - duckImg.offsetWidth) {
    // Change direction to left
    movingRight = false;
    // Set a new random target Y coordinate
    randomY = Math.floor(Math.random() * (350 - 0 + 1) + 0);
  }

  // Check if the duck has reached the left wall
  if (duckLeft <= 0) {
    // Change direction to right
    movingRight = true;
    // Set a new random target Y coordinate
    randomY = Math.floor(Math.random() * (350 - 0 + 1) + 0);
  }

  // Check if the duck has reached its target Y coordinate
  if (duckTop <= randomY) {
    // Set a new random target Y coordinate
    randomY = Math.floor(Math.random() * (550 - 0 + 1) + 150);
  }

  // Update the top and left coordinates of the duck
  if (movingRight) {
    duckImg.style.left = `${duckLeft + 2}px`;
  } else {
    duckImg.style.left = `${duckLeft - 2}px`;
  }

  // Calculate the distance between the current top position and the target Y coordinate
  const distanceToTarget = randomY - duckTop;

  // Determine the speed of the descent based on the distance to the target
  const descentSpeed = distanceToTarget < 100 ? 1 : 2;

  // Move the duck towards the target Y coordinate
  if (duckTop <= randomY) {
    duckImg.style.top = `${duckTop + descentSpeed}px`;
  } else {
    duckImg.style.top = `${duckTop - 2}px`;
  }
}, 20);

gameBoard.addEventListener("click", (event) => {
  // Get the x and y coordinates of the mouse click

  const mouseX = event.clientX - gameBoard.offsetLeft;
  const mouseY = event.clientY - gameBoard.offsetTop;
  // Get the current top and left coordinates of the duck

  const duckTop = duckImg.offsetTop;
  const duckLeft = duckImg.offsetLeft;

  // Check if the mouse click coordinates are within the boundaries of the duck
  if (
    mouseX >= duckLeft &&
    mouseX <= duckLeft + duckImg.offsetWidth &&
    mouseY >= duckTop &&
    mouseY <= duckTop + duckImg.offsetHeight
  ) {
    // The player has successfully shot the duck!
    duckKill();
  }
});

function duckKill() {
  console.log("Good shot!");
  duckImg.src = `./img/duckkill.png`;

  // Clear the duckMove interval to stop the duck from moving
  clearInterval(duckMove);

  setTimeout(() => {
    duckImg.src = `./img/duckDrop.png`;

    const duckTop = duckImg.offsetTop;
    const duckLeft = duckImg.offsetLeft;

    // Calculate the distance to drop the duck
    const distanceToDrop = gameBoard.offsetHeight - duckTop - duckImg.offsetHeight;

    // Calculate the descent speed based on the distance to drop
    const descentSpeed = distanceToDrop < 100 ? 1 : 2;

    // Drop the duck smoothly
    const dropDuck = setInterval(() => {
      // Get the current top coordinate of the duck
      const duckTop = duckImg.offsetTop;

      // Move the duck towards the bottom of the screen
      duckImg.style.top = `${duckTop + descentSpeed}px`;

      // Check if the duck has reached the bottom of the screen
      if (duckTop + duckImg.offsetHeight >= gameBoard.offsetHeight) {
        // Stop dropping the duck
        clearInterval(dropDuck);
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
