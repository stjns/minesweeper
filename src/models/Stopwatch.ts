export class Stopwatch {
    private interval: number = 0;
    private clock: number = 0;
    private offset: number = 0;
    readonly timer: HTMLDivElement;
    
    constructor() {
        this.timer = document.createElement('div');
        this.render(0);
    }

    public start(): void {
        if (!this.interval) {
            this.offset = Date.now();
            this.interval = setInterval(() => this.update(),100);
        }
    }

    public reset() {
        this.stop();
        this.render(0);
    }

    public stop(): void {
        if (this.interval) {
            clearInterval(this.interval);
        }
    }

    private update() {
        this.render(Date.now() - this.offset);
    }

    private render(time: number) {
        this.timer.innerHTML = (time / 1000).toFixed(1);
    }

}