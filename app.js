const gameBoard = document.getElementById("root");

const greenDuck = `./img/greenDuck.png`;

function gameStart() {
  gameBoard.innerHTML = startBoard();
}

function startGame() {
  gameBoard.removeChild(gameBoard.children[0]);
}

function startBoard() {
  return ` <div id="gameBoard">
    <h1>Kill a lot of duck</h1>
    <h2>"Retro gaming"</h2>
        <h3><3</h3>
      <a href="#" onclick="startGame()">Start game</a>
    </div>
  `;
}

gameStart();
