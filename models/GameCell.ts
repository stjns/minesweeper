export class GameCell {
    readonly mined: boolean = false;
    readonly el: HTMLDivElement;
    private readonly cellRevealCallback: Function;
    private mineNeighbors: number = 0; 

    private flagged = false;
    private revealed = false;
    private disabled = false;

    constructor(mined: boolean = false, cellRevealCallback: Function) {
        this.mined = mined;
        this.el = <HTMLDivElement>document.createElement('div');
        this.cellRevealCallback = cellRevealCallback;

        if (mined) this.mineNeighbors = 1;

        this.el.classList.add("game-cell");
        this.el.classList.add('un-revealed');

        this.el.addEventListener('contextmenu', (e) => {
            e.preventDefault();
            this.onFlagToggle();
        });
        this.el.addEventListener('click', () => this.onCellClick());
    }

    public setMinedNeighbors(minedNeighbors: number) {
        if (!this.mined)
            this.mineNeighbors = minedNeighbors;
    }

    public reveal() {
        if (!this.flagged && !this.revealed) {
            this.revealed = true;
            this.el.classList.remove('un-revealed');

            if (this.mined) {
                this.el.classList.add('exploded');
                this.el.innerHTML = '&#x1f4a3;'
                this.cellRevealCallback(true);
            } else {
                if (this.mineNeighbors > 0)
                    this.el.textContent = this.numNearbyMines().toString();
                
                this.cellRevealCallback(false);
            }
        } 
    }

    public disable = () => this.disabled = true;

    private onCellClick(): void {
        if (!this.disabled && !this.isRevealed() && !this.isFlagged()) {
            this.reveal();
            if (this.numNearbyMines() === 0) {

            } 
        }
    }

    private onFlagToggle(): void {
        if (!this.disabled && !this.isRevealed()) {
            if (!this.isFlagged()) {
                this.el.innerHTML = '&#x26f3;';
            } else {
                this.el.textContent = ' ';
            }

            this.flagged = !this.flagged;
        }
    }

    public isFlagged = () => this.flagged;
    public isRevealed = () => this.revealed;
    public numNearbyMines = () => this.mineNeighbors;
    public isEmpty = () => this.mineNeighbors === 0;
}