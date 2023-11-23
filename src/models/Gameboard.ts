import { Minefield } from './Minefield';
import { Stopwatch } from './Stopwatch';
import { MineCounter } from './MineCounter';

export class Gameboard {
    private stopwatch: Stopwatch;
    private mineCounter: MineCounter;

    private readonly gameDiv: HTMLDivElement;

    constructor(gameDiv: HTMLDivElement) {
        this.gameDiv = gameDiv;
        this.stopwatch = new Stopwatch();
        this.mineCounter = new MineCounter(0);
    }

    public newGame(width: number, height: number, mines: number): void {
        const maxMines = width*height*.5 //no more than half mines
    
        if (mines > maxMines) alert('Too many mines');
    
        const newGame = new Minefield(
            width, 
            height, 
            mines, 
            () => this.stopwatch.start(), 
            () => this.stopwatch.stop(), 
            (mineCount: number) => this.mineCounter.set(mineCount)
        );

        this.gameDiv.textContent = '';
        const minefieldDiv = document.createElement('div');
        minefieldDiv.classList.add('minefield');
        const statusDiv = document.createElement('div');
        statusDiv.classList.add('status-bar')
    
        minefieldDiv.appendChild(newGame.newGame());
        statusDiv.appendChild(this.mineCounter.counterDiv);
        statusDiv.appendChild(this.stopwatch.timer);
    
        this.gameDiv.appendChild(minefieldDiv);
        this.gameDiv.appendChild(statusDiv);
    }
}

