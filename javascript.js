// Gameboard Module
const Gameboard = (() => {
  let board = Array(9).fill("");

  const getBoard = () => [...board];
  const setCell = (i, symbol) => board[i] === "" ? (board[i] = symbol, true) : false;
  const reset = () => (board = Array(9).fill(""));

  return { getBoard, setCell, reset };
})();

// Player Factory
const Player = (name, symbol) => ({ name, symbol });

// Game Controller
const GameController = (() => {
  let player1, player2, currentPlayer;
  let gameOver = false, rounds = 0;
  let scores = { X: 0, O: 0 };

  const startGame = (n1, n2) => {
    player1 = Player(n1 || "Player 1", "X");
    player2 = Player(n2 || "Player 2", "O");
    currentPlayer = player1;
    gameOver = false;
    rounds = 0;
    scores = { X: 0, O: 0 };
    Gameboard.reset();
    DisplayController.render();
    DisplayController.updateStatus(`${currentPlayer.name}'s turn (${currentPlayer.symbol})`);
    DisplayController.hideNameInputs();
    DisplayController.updateScore(scores, rounds);
  };

  const playTurn = (i) => {
    if (gameOver || !Gameboard.setCell(i, currentPlayer.symbol)) return;
    DisplayController.render();

    if (checkWinner()) {
      scores[currentPlayer.symbol]++;
      rounds++;
      DisplayController.updateScore(scores, rounds);
      DisplayController.updateStatus(`${currentPlayer.name} wins round ${rounds}!`);
      gameOver = true;
      return setTimeout(nextRound, 1500);
    }

    if (Gameboard.getBoard().every(cell => cell !== "")) {
      rounds++;
      DisplayController.updateScore(scores, rounds);
      DisplayController.updateStatus(`Round ${rounds} is a draw!`);
      gameOver = true;
      return setTimeout(nextRound, 1500);
    }

    switchPlayer();
    DisplayController.updateStatus(`${currentPlayer.name}'s turn (${currentPlayer.symbol})`);
  };

  const switchPlayer = () => currentPlayer = currentPlayer === player1 ? player2 : player1;

  const checkWinner = () => {
    const b = Gameboard.getBoard();
    return [
      [0,1,2],[3,4,5],[6,7,8],
      [0,3,6],[1,4,7],[2,5,8],
      [0,4,8],[2,4,6]
    ].some(([a,b1,c]) => b[a] && b[a] === b[b1] && b[a] === b[c]);
  };

  const nextRound = () => {
    Gameboard.reset();
    gameOver = false;
    currentPlayer = player1;
    DisplayController.render();
    DisplayController.updateStatus(`${currentPlayer.name}'s turn (${currentPlayer.symbol})`);
  };

  const resetGame = () => {
    Gameboard.reset();
    rounds = 0;
    scores = { X: 0, O: 0 };
    gameOver = false;
    currentPlayer = player1 || Player("Player 1", "X");
    DisplayController.render();
    DisplayController.updateStatus("Click 'Start Game' to begin");
    DisplayController.updateScore(scores, rounds);
    DisplayController.showNameInputs();
  };

  return { playTurn, startGame, resetGame };
})();

// Display Controller
const DisplayController = (() => {
  const boardEl = document.getElementById("gameboard"),
        statusText = document.getElementById("status"),
        playerInputs = document.querySelector(".player-inputs"),
        roundsText = document.getElementById("rounds"),
        scoreXText = document.getElementById("scoreX"),
        scoreOText = document.getElementById("scoreO");

  const render = () => {
    boardEl.innerHTML = "";
    Gameboard.getBoard().forEach((mark, i) => {
      const cell = document.createElement("div");
      cell.classList.add("cell");
      cell.textContent = mark;
      cell.dataset.index = i;
      cell.addEventListener("click", () => GameController.playTurn(i));
      boardEl.appendChild(cell);
    });
  };

  const updateStatus = msg => statusText.textContent = msg;

  const updateScore = (scores, round) => {
    roundsText.textContent = `Rounds Played: ${round}`;
    scoreXText.textContent = `Player X: ${scores.X} wins`;
    scoreOText.textContent = `Player O: ${scores.O} wins`;
  };

  const hideNameInputs = () => playerInputs.style.display = "none";
  const showNameInputs = () => {
    playerInputs.style.display = "block";
    document.getElementById("player1").value = "";
    document.getElementById("player2").value = "";
  };

  return { render, updateStatus, updateScore, hideNameInputs, showNameInputs };
})();

// Event Listeners
document.getElementById("startBtn").addEventListener("click", () => {
  const name1 = document.getElementById("player1").value;
  const name2 = document.getElementById("player2").value;
  GameController.startGame(name1, name2);
});

document.getElementById("resetBtn").addEventListener("click", GameController.resetGame);

