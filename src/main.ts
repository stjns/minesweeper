import { Gameboard } from "./models/Gameboard";
import myMine from "./icons/myMine.svg";

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

function getSvg(mountPoint:HTMLElement, svgUrl:URL) {
    fetch(svgUrl)
        .then((response) => {
            if (!response.ok) throw new Error(`Failed to fetch SVG: ${response.statusText}`);
            return response.text();
        })
        .then((svgText) => {
            const svgContainer = document.createElement('div'); 
            svgContainer.innerHTML = svgText;
    
            // Extract the <svg> element from the loaded content
            const svgElement = svgContainer.querySelector('svg');
    
            if (svgElement) {
                svgElement.setAttribute("width", "15px");
                svgElement.setAttribute("height", "15px");
                // Append the loaded <svg> to the hooker element
                mountPoint.appendChild(svgElement);
                // console.log("SVG added successfully:", svgElement);
            } else {
                console.error("No <svg> element found in the loaded content.");
            }
        })
        .catch((error) => console.error("Error loading SVG:", error));
}

const bombTarget = <HTMLElement>document.getElementsByClassName('placeBomb')[0];

getSvg(bombTarget, myMine);