import { Gameboard } from "./models/Gameboard";

const gameDiv = <HTMLDivElement>document.getElementById('game-board');
const boardWidthInput = <HTMLInputElement>document.getElementById('txt-board-width');
const boardHeightInput = <HTMLInputElement>document.getElementById('txt-board-height');
const mineCountInput = <HTMLInputElement>document.getElementById('txt-mines');
const newGameBtn = <HTMLButtonElement>document.getElementById('btn-new-game');

const gameBoard = new Gameboard(gameDiv);

//default values
boardWidthInput.value = '10';
boardHeightInput.value = '10';
mineCountInput.value = '20';

newGameBtn.addEventListener('click', () => {
    const width = boardWidthInput.valueAsNumber;
    const height = boardHeightInput.valueAsNumber;
    const mines = mineCountInput.valueAsNumber;

    gameBoard.newGame(width, height, mines);
});

newGameBtn.click();
