import { Icon } from './Icons';

export class MineCounter {
    readonly counterDiv: HTMLDivElement;
    private currentCount: number;
    private countContainer: HTMLSpanElement;
    private readonly bomb = Icon.createIcon('mine');

    constructor(initialCount: number) {
        this.counterDiv = document.createElement('div');
        this.counterDiv.id = 'mine-counter';

        this.counterDiv.appendChild(this.bomb);
        this.bomb.style.verticalAlign = "bottom";

        this.countContainer = document.createElement('span');
        this.countContainer.id = 'count-container';
        this.counterDiv.appendChild(this.countContainer);

        this.currentCount = initialCount;
        this.render();
    }

    public set(count:number): void {
        this.currentCount = count;
        this.render();
    }

    private render(): void {
        this.countContainer.innerText = ` : ${this.currentCount}`;
    }
}