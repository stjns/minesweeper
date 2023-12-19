// An individual cell within the minefield
class e{constructor(e,t,i,s){this.mineNeighbors=0,this.mined=!1,this.flagged=!1,this.exploded=!1,this.revealed=!1,this.disabled=!1,this.flaggingEnabled=!1,this.touchTimer=0,this.BOMB_CODE="&#x1f4a3;",this.FLAG_CODE="&#x26f3;",this.isFlagged=()=>this.flagged,this.isRevealed=()=>this.revealed,this.numNearbyMines=()=>this.mineNeighbors,this.isEmpty=()=>0===this.mineNeighbors,this.isMined=()=>this.mined,this.htmlElement=document.createElement("div"),this.cellRevealCallback=e,this.cellFlagCallback=t,this.multiFlagCallback=i,this.chordCallback=s,this.htmlElement.classList.add("game-cell"),this.htmlElement.classList.add("un-revealed"),this.htmlElement.addEventListener("contextmenu",e=>{e.preventDefault(),this.toggleFlag()}),this.htmlElement.addEventListener("click",()=>this.reveal()),this.htmlElement.addEventListener("touchstart",e=>this.touchHandler(e)),this.htmlElement.addEventListener("touchend",()=>this.cancelTouch()),this.htmlElement.addEventListener("touchmove",()=>this.cancelTouch())}touchHandler(e){e.preventDefault(),this.touchTimer||(this.touchTimer=setTimeout(()=>{this.touchTimer=0,this.toggleFlag()},250))}cancelTouch(){this.touchTimer&&(clearTimeout(this.touchTimer),this.touchTimer=0,this.reveal())}//set a mine on this cell
arm(){this.mined=!0,this.mineNeighbors=1}//needed to prevent a bug for flagging before the game has started
enableFlagging(){this.flaggingEnabled=!0}//set the number that will appear on a cell
setMinedNeighbors(e){this.mined||(this.mineNeighbors=e)}//action when an unflagged cell is clicked
reveal(){this.disabled||this.flagged||this.revealed?this.revealed&&this.mineNeighbors>0&&this.chordCallback(this.mineNeighbors):(this.revealed=!0,this.mined?(this.cellRevealCallback(!0),this.exploded=!0,this.htmlElement.classList.add("exploded"),this.htmlElement.innerHTML=this.BOMB_CODE):(this.cellRevealCallback(!1),this.mineNeighbors>0&&(this.htmlElement.textContent=this.mineNeighbors.toString(),this.htmlElement.classList.add(`n${this.mineNeighbors}`))),this.htmlElement.classList.remove("un-revealed"))}//when the game is over disable the cell from being clicked 
gameOver(){this.disabled=!0,!this.mined||this.flagged||this.exploded?!this.mined&&this.flagged&&this.htmlElement.classList.add("bad-flag"):(this.htmlElement.classList.add("unexploded-mine"),this.htmlElement.innerHTML=this.BOMB_CODE)}//add/remove flag from an unrevelead cell
toggleFlag(){!this.flaggingEnabled||this.disabled||this.isRevealed()?this.revealed&&this.mineNeighbors>0&&this.multiFlagCallback(this.mineNeighbors):(this.isFlagged()?this.htmlElement.textContent=" ":this.htmlElement.innerHTML=this.FLAG_CODE,this.flagged=!this.flagged,this.cellFlagCallback(this.flagged))}}class t{constructor(e,t){this.x=e,this.y=t}}class i{constructor(){this.Unflagged=[],this.Flagged=[],this.Unrevealed=0}}class s{constructor(e,t,i,s,l,h){this.remainingMines=0,this.virginBoard=!0//new, untouched minefield
,//check to see if a user has won by flagging all mines
this.checkForWinByFlags=()=>0===this.cells.flatMap(e=>e.filter(e=>e.isMined()&&!e.isFlagged())).length,this.boardHeight=t,this.boardWidth=e,this.mineCount=i,this.remainingMines=i,this.gameEndCallback=l,this.gameStartCallback=s,this.mineCountCallback=h,this.mineCountCallback(i),this.cells=[...Array(e)].map(e=>Array(t)),this.populateBoard()}//create a randomized minefield based on height/width/mines specified
//leave a gap at the point of the initial click
generateMineMap(e,i,s,l,h){let a=[],n=[];//all possible cells
//populate full cellArray with all possible cell coordinates
for(let e=0;e<l;e++)for(let i=0;i<s;i++)a.push(new t(i,e));//remove the initial clicked cell and all it's immediate neighbors
//as possible locations for a mine
let r=[];for(let t of a)t.x>=e-1&&t.x<=e+1&&t.y>=i-1&&t.y<=i+1||r.push(t);//add the specified number of mines randomly to the remaining cells
for(let e=0;e<h;e++){let e=Math.floor(Math.random()*r.length);n.push(...r.splice(e,1))}return n}populateBoard(){for(let t=0;t<this.boardHeight;t++)for(let i=0;i<this.boardWidth;i++){let s=new e(e=>this.cellRevealCallback(e,i,t),e=>this.cellFlagCallback(e),e=>this.multiFlagCallback(i,t,e),e=>this.chordCallback(i,t,e));this.cells[i][t]=s}}//chording is when you do a normal click on a revealed cell in order
//to reveal its unrevealed neighbors. If the number of nearby flagged cells
//equals the number on the clicked cell, each unflagged, unrevealed cell should
//be revealed. This can result in game loss. 
chordCallback(e,t,i){let s=this.mapNearbyCells(e,t);s.Flagged.length===i&&s.Unflagged.forEach(e=>e.reveal())}//get a map of all nearby cells and their states
mapNearbyCells(e,t){let s=new i,l=0===t?0:t-1,h=t===this.boardHeight-1?t:t+1,a=0===e?0:e-1,n=e===this.boardWidth-1?e:e+1;for(let i=l;i<=h;i++)for(let l=a;l<=n;l++){if(l===e&&i===t)continue;//no need to count myself
let h=this.cells[l][i];!h.isRevealed()&&s.Unrevealed++,!h.isRevealed()&&h.isFlagged()&&s.Flagged.push(h),h.isRevealed()||h.isFlagged()||s.Unflagged.push(h)}return s}//when a cell gets flagged, we need to recalculate the number
//of remaining mines. Also, this can flag other cells if the
//user uses the convience feature of flagging a "numbered" 
//revealed cell.
cellFlagCallback(e){e?this.mineCountCallback(--this.remainingMines):this.mineCountCallback(++this.remainingMines),this.checkForWinByFlags()&&this.winnerWinner()}multiFlagCallback(e,t,i){let s=this.mapNearbyCells(e,t);s.Unrevealed===i&&s.Unflagged.forEach(e=>e.toggleFlag())}//set the number that will appear on the cells near a mine
calculateMinedNeighbors(){for(let e=0;e<this.boardHeight;e++)for(let t=0;t<this.boardWidth;t++)if(!this.cells[t][e].isMined()){let i=0;t>0&&this.cells[t-1][e].isMined()&&i++,t<this.boardWidth-1&&this.cells[t+1][e].isMined()&&i++,e>0&&(t>0&&this.cells[t-1][e-1].isMined()&&i++,this.cells[t][e-1].isMined()&&i++,t<this.boardWidth-1&&this.cells[t+1][e-1].isMined()&&i++),e<this.boardHeight-1&&(t>0&&this.cells[t-1][e+1].isMined()&&i++,this.cells[t][e+1].isMined()&&i++,t<this.boardWidth-1&&this.cells[t+1][e+1].isMined()&&i++),this.cells[t][e].setMinedNeighbors(i)}}//right after the first move we need to do a bunch of stuff,
//like calculating the minefield, enabling flagging
firstMove(e,t){let i=this.generateMineMap(e,t,this.boardWidth,this.boardHeight,this.mineCount);for(let e=0;e<this.boardHeight;e++)for(let t=0;t<this.boardWidth;t++)i.some(i=>i.x===t&&i.y===e)&&this.cells[t][e].arm(),this.cells[t][e].enableFlagging();this.calculateMinedNeighbors(),this.virginBoard=!1,this.gameStartCallback()}/*
     * When a cell is revealed, this function is run to see what actions
     * the board should take, eg declare win, loss, or propagate an empty
     * cell field. In the latter case, this method is recursive.
     * 
     * If the cell is not empty or mined, we don't need to do anything.
     * 
     * result: false if the cell is mined, true if it is
     * x, y: coordinates for the revealed cell
     */cellRevealCallback(e,t,i){if(this.virginBoard&&this.firstMove(t,i),e)//explode
this.gameEndCallback(),this.disableAllCells();else if(this.cells[t][i].isEmpty())for(let e=t-1;e<t+2;e++)for(let t=i-1;t<i+2;t++)e>=0&&e<this.boardWidth&&t>=0&&t<this.boardHeight&&!this.cells[e][t].isRevealed()&&(this.cells[e][t].reveal(),this.cells[e][t].isEmpty()&&this.cellRevealCallback(!1,e,t));else this.checkForWin()&&this.winnerWinner()}//used when the user has won to flag remaining mines
flagAllMinesRevealUnrevealed(){for(let e of this.cells)for(let t of e)t.isMined()&&!t.isFlagged()?t.toggleFlag():t.isRevealed()||t.reveal()}winnerWinner(){this.gameEndCallback(),this.flagAllMinesRevealUnrevealed(),this.disableAllCells()}//check to see if the user has won
//TODO probably a smarter way to do this?
checkForWin(){for(let e of this.cells)for(let t of e)if(!t.isRevealed()&&!t.isMined())return!1;return!0}//used when the user has won/lost to prevent further clicks
disableAllCells(){for(let e of this.cells)for(let t of e)t.gameOver()}//start a new game!
newGame(){let e=document.createElement("div");for(let t=0;t<this.boardHeight;t++){let i=document.createElement("div");i.classList.add("cell-row");for(let e=0;e<this.boardWidth;e++)i.appendChild(this.cells[e][t].htmlElement);e.appendChild(i)}return e}}class l{constructor(){this.interval=0,this.offset=0,this.timer=document.createElement("div"),this.timer.classList.add("game-timer"),this.render(0)}start(){this.reset(),this.interval||(this.offset=Date.now(),this.interval=setInterval(()=>this.update(),100))}reset(){this.stop(),this.render(0)}stop(){this.interval&&(clearInterval(this.interval),this.interval=0)}update(){this.render(Date.now()-this.offset)}render(e){let t=Math.floor(e/6e4).toString().padStart(2,"0"),i=(e%6e4/1e3).toFixed(1).padStart(4,"0");this.timer.innerHTML=`${t}:${i}`}}class h{constructor(e){this.BOMB_CODE="&#x1f4a3;",this.counterDiv=document.createElement("div"),this.counterDiv.id="mine-counter",this.currentCount=e,this.render()}set(e){this.currentCount=e,this.render()}render(){this.counterDiv.innerHTML=`${this.BOMB_CODE}: ${this.currentCount}`}}const a=document.getElementById("game-board"),n=document.getElementById("txt-board-width"),r=document.getElementById("txt-board-height"),d=document.getElementById("txt-mines"),o=document.getElementById("btn-new-game"),c=new class{constructor(e){this.gameDiv=e,this.stopwatch=new l,this.mineCounter=new h(0)}newGame(e,t,i){let l=e*t*.5//no more than half mines
;i>l&&alert("Too many mines");let h=new s(e,t,i,()=>this.stopwatch.start(),()=>this.stopwatch.stop(),e=>this.mineCounter.set(e));this.gameDiv.textContent="";let a=document.createElement("div");a.classList.add("minefield");let n=document.createElement("div");n.classList.add("status-bar"),a.appendChild(h.newGame()),n.appendChild(this.mineCounter.counterDiv),n.appendChild(this.stopwatch.timer),this.gameDiv.appendChild(a),this.gameDiv.appendChild(n)}}(a);//default values
n.value="10",r.value="10",d.value="20",o.addEventListener("click",()=>{let e=n.valueAsNumber,t=r.valueAsNumber,i=d.valueAsNumber;c.newGame(e,t,i)}),o.click();//# sourceMappingURL=index.cdf78128.js.map

//# sourceMappingURL=index.cdf78128.js.map
