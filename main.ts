import { GameBoard } from "./models/GameBoard";

let boardDiv = <HTMLDivElement>document.getElementById("game-board");

const gameBoard = new GameBoard(10, 10, 20);

boardDiv.appendChild(gameBoard.generateInitialBoard());