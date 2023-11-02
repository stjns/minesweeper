import { GameBoard } from "./models/GameBoard";

const boardDiv = <HTMLDivElement>document.getElementById("game-board");
const boardWidthInput = <HTMLInputElement>document.getElementById("txt-board-width");
const boardHeightInput = <HTMLInputElement>document.getElementById("txt-board-height");
const mineCountInput = <HTMLInputElement>document.getElementById("txt-mines");
const newGameBtn = <HTMLButtonElement>document.getElementById("btn-new-game");

boardWidthInput.value = '10';
boardHeightInput.value = '10';
mineCountInput.value = '20';

const initialGame = new GameBoard(10,10, 20);
boardDiv.appendChild(initialGame.newGame());

newGameBtn.addEventListener('click', () => {
    const width = boardWidthInput.valueAsNumber;
    const height = boardHeightInput.valueAsNumber;
    const mines = mineCountInput.valueAsNumber;

    const maxMines = width*height*.5 //no more than half mines

    if (mines > maxMines) alert('Too many mines');

    const newGame = new GameBoard(width, height, mines);
    boardDiv.textContent = '';
    boardDiv.appendChild(newGame.newGame());
});