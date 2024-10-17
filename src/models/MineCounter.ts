export class MineCounter {
    readonly counterDiv: HTMLDivElement;
    private currentCount: number;
    private readonly BOMB_CODE = '&#x1f4a3;';

    constructor(initialCount: number) {
        this.counterDiv = document.createElement('div');
        this.counterDiv.id = 'mine-counter';
        this.currentCount = initialCount;
        this.render();
    }

    public set(count:number): void {
        this.currentCount = count;
        this.render();
    }

    private render(): void {
        // this.counterDiv.innerHTML = `${this.BOMB_CODE}: ${this.currentCount}`;
        this.counterDiv.innerHTML = `<span class="placeBomb"></span>: ${this.currentCount}`;
    }
}