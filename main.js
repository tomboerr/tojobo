var height = 6;
var width = 5;

var row = 0;
var col = 0;

var gameOver = false;
var word = "drama";

var selectWidth = "5px"
var normalWidth = "2px"


window.onload = function() {
    initialize();
}

function initialize() {
    for (let r=0; r < height; r++) {
        for (let c=0; c < width; c++) {
            let tile = document.createElement("span");
            tile.id = r.toString() + "-" + c.toString();
            tile.classList.add("tile");
            tile.innerText = "";
            document.getElementById("board").appendChild(tile);
        }
    }
    word = word.toUpperCase();
    getTile().style.borderWidth = selectWidth;

    document.addEventListener("keyup", (e) => {
        if (gameOver) return;

        if (/^[a-zA-Z]$/.test(e.key)) {
            if (col < width){
                let currTile = getTile()
                currTile.style.borderWidth = normalWidth;
                if (currTile.innerText == "") {
                    currTile.innerText = e.key.toUpperCase();
                    col += 1;
                }
                let nextTile = getTile()
                nextTile.style.borderWidth = selectWidth;
            }
        }
        else if (e.key == "Backspace") {
            if (col < width){
                let currTile = getTile()
                currTile.style.borderWidth = normalWidth;
            }
            if (0 < col && col <= width){
                col -= 1;
            }
            let nextTile = getTile()
            nextTile.innerText = "";
            nextTile.style.borderWidth = selectWidth;
        }
        else if (e.key == "Enter") {
            if (col == width){
                showResult()
                row += 1;
                col = 0;
                if (!gameOver && row < height) {
                    getTile().style.borderWidth = selectWidth;
                }
            }
        }

        if (!gameOver && row == height){
            gameOver = true;
            document.getElementById("answer").innerText = word;
        }
    })
}

function showResult(){
    let correct = 0;
    let copy = word;
    
    for (let c = 0; c < width; c++){
        let currTile = document.getElementById(row.toString() + "-" + c.toString());
        let letter = currTile.innerText;

        if (letter == word[c]){
            currTile.classList.add("correct");
            correct += 1;
            copy = copy.replace(letter, "")
        }
    }
    
    for (let c = 0; c < width; c++){
        let currTile = document.getElementById(row.toString() + "-" + c.toString());
        let letter = currTile.innerText;
        
        if (currTile.classList.contains("correct")){
            continue;
        }
        else if (copy.includes(letter)){
            currTile.classList.add("present");
            copy = copy.replace(letter, "")
        }
        else{
            currTile.classList.add("absent");
        }
    }
    if (correct == width){
        gameOver = true;
    }
}

function getTile(){
    return document.getElementById(row.toString() + "-" + col.toString());
}