import { Minefield } from './models/Minefield';
import { Stopwatch } from './models/Stopwatch';
import { MineCounter } from './models/MineCounter';

const gameDiv = <HTMLDivElement>document.getElementById('game-board');
const boardWidthInput = <HTMLInputElement>document.getElementById('txt-board-width');
const boardHeightInput = <HTMLInputElement>document.getElementById('txt-board-height');
const mineCountInput = <HTMLInputElement>document.getElementById('txt-mines');
const newGameBtn = <HTMLButtonElement>document.getElementById('btn-new-game');

const stopwatch = new Stopwatch();
const mineCounter = new MineCounter(0);

//default values
boardWidthInput.value = '10';
boardHeightInput.value = '10';
mineCountInput.value = '20';

function gameStart(): void {
    stopwatch.start();
}

function gameEnd(): void {
    stopwatch.stop();
}

function mineCountUpdate(count: number): void {
    mineCounter.set(count);
}

function setupNewGame(): void {
    const width = boardWidthInput.valueAsNumber;
    const height = boardHeightInput.valueAsNumber;
    const mines = mineCountInput.valueAsNumber;

    const maxMines = width*height*.5 //no more than half mines

    if (mines > maxMines) alert('Too many mines');

    const newGame = new Minefield(width, height, mines, gameStart, gameEnd, mineCountUpdate);
    gameDiv.textContent = '';
    const minefieldDiv = document.createElement('div');
    minefieldDiv.classList.add('minefield');
    const statusDiv = document.createElement('div');
    statusDiv.classList.add('status-bar')

    minefieldDiv.appendChild(newGame.newGame());
    statusDiv.appendChild(mineCounter.counterDiv);
    statusDiv.appendChild(stopwatch.timer);

    gameDiv.appendChild(minefieldDiv);
    gameDiv.appendChild(statusDiv);
}

newGameBtn.addEventListener('click', () => {
    stopwatch.reset();
    setupNewGame();
});

setupNewGame();