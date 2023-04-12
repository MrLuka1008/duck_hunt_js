const gameBoard = document.getElementById("root");

let duckObj = {
  img: `./img/greenDuck.png`,
  y: 500,
  x: 650,
};

function gameStart() {
  gameBoard.innerHTML = startBoard();
}

function startGame() {
  gameBoard.removeChild(gameBoard.children[0]);
  let duckImg = document.createElement("img");

  duckImg.setAttribute("src", `${duckObj.img}`);
  duckImg.setAttribute("id", `duck`);
  duckImg.setAttribute("style", `left:${duckObj.x}px; top:${duckObj.y}px`);
  gameBoard.appendChild(duckImg);
  //   duckMove();
}

const duckMove = setInterval(() => {
  console.log(duckObj.y - 4);
}, 1000);

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
