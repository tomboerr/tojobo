var height = 6;
var width = 5;

var row = 0;
var col = 0;

var gameOver = false;
var word = "";
var dayKey = "";

var selectWidth = "5px"
var normalWidth = "2px"

var keyLayout = [
    ["Q","W","E","R","T","Z","U","I","O","P"],
    ["A","S","D","F","G","H","J","K","L"],
    ["Enter","Y","X","C","V","B","N","M","Backspace"]
]

window.onload = async function() {
    await loadWord();
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

    for (let r = 0; r < keyLayout.length; r++){
        let keyRow = document.createElement("div");
        keyRow.id = "row" + r.toString();
        keyRow.classList.add("row");
        document.getElementById("keyboard").appendChild(keyRow);
        for (let k = 0; k < keyLayout[r].length; k++){
            let key = document.createElement("span");
            key.id = keyLayout[r][k];
            key.classList.add("key");
            if (keyLayout[r][k] == "Enter" || keyLayout[r][k] == "Backspace") {
                key.classList.add("wide");
            }
            if (keyLayout[r][k] == "Backspace"){
                key.innerText = "⌫";
            }
            else{
                key.innerText = keyLayout[r][k];
            }
            document.getElementById("row" + r.toString()).appendChild(key);
        }
    }

    document.addEventListener("keyup", (e) => pressKey(e.key))

    document.getElementById("keyboard").addEventListener("click", (e) => {
        if (!e.target.classList.contains("key")){
            return;
        }
        pressKey(e.target.id);
    });

    loadState();
}

function pressKey(key){
    if (gameOver) return;

    if (/^[a-zA-Z]$/.test(key)) {
        if (col < width){
            let currTile = getTile()
            currTile.style.borderWidth = normalWidth;
            if (currTile.innerText == "") {
                currTile.innerText = key.toUpperCase();
                col += 1;
            }
            let nextTile = getTile()
            if (col < width){
                nextTile.style.borderWidth = selectWidth;
            }
        }
    }
    else if (key == "Backspace") {
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
    else if (key == "Enter") {
        if (col == width){
            let guess = "";
            for (let c = 0; c < width; c++) {
                guess += document.getElementById(row + "-" + c).innerText;
            }
            if (!ALLOWED.includes(guess)) {
                shakeRow();
                return;
            }
            guesses.push(guess);
            showResult()
            if(gameOver){
                celebrate(row);
                reportResult(row + 1);
            }
            row += 1;
            col = 0;
            saveState();
            if (!gameOver && row < height) {
                getTile().style.borderWidth = selectWidth;
            }
        }
        else{
            shakeRow();
        }
    }

    if (!gameOver && row == height){
        gameOver = true;
        document.getElementById("answer").innerText = word;
        reportResult(null);
    }
}

function showResult(){
    let correct = 0;
    let copy = word;
    
    for (let c = 0; c < width; c++){
        let currTile = document.getElementById(row.toString() + "-" + c.toString());
        let letter = currTile.innerText;
        let key = document.getElementById(letter);

        if (letter == word[c]){
            currTile.classList.add("correct");
            correct += 1;
            copy = copy.replace(letter, "")
            // color key green
            key.classList.add("correct");
            key.classList.remove("absent");
            key.classList.remove("present");
        }
    }
    
    for (let c = 0; c < width; c++){
        let currTile = document.getElementById(row.toString() + "-" + c.toString());
        let letter = currTile.innerText;
        let key = document.getElementById(letter);
        
        if (currTile.classList.contains("correct")){
            continue;
        }
        else if (copy.includes(letter)){
            currTile.classList.add("present");
            copy = copy.replace(letter, "")
            if(!key.classList.contains("correct")){
                key.classList.add("present");
                key.classList.remove("absent");
            }
        }
        else{
            currTile.classList.add("absent");
            if(!key.classList.contains("correct") && !key.classList.contains("present")){
                key.classList.add("absent");
            }
        }
    }
    if (correct == width){
        gameOver = true;
    }
}

function getTile(){
    return document.getElementById(row.toString() + "-" + col.toString());
}

async function loadWord() {
    try {
        let response = await fetch("/api/word");
        let data = await response.json();
        word = data.word;
        dayKey = data.day;
    } catch (e) {
        gameOver = true;
    }
}

async function reportResult(attempts){
    try {
        await fetch("api/result", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({attempts:attempts})
        });
    }
    catch (e){}
}

// obsolete!
function getDailyWord(){
    let now = new Date();
    let today = Date.UTC(now.getFullYear(), now.getMonth(), now.getDate());
    let dayNumber = Math.floor(today / 86400000);

    let x = dayNumber * 2654435761 % 4294967296;
    x = (x ^ (x >>> 16)) >>> 0;

    return ANSWERS[x % ANSWERS.length];
}

function shakeRow(){
    for(let i=0; i<width;i++){
        let tile =  document.getElementById(row.toString() + "-" + i.toString());
        animateTile(tile, "shake");
    }
}

function animateTile(tile, name, delay = 0) {
    if (tile.classList.contains(name)) return;
    tile.style.animationDelay = delay + "ms";
    tile.classList.add(name);
    tile.addEventListener("animationend", () => {
        tile.classList.remove(name);
        tile.style.animationDelay = "";
    }, { once: true });
}

function celebrate(winRow) {
    let center = (width - 1) / 2;
    for (let r = winRow; r >= 0; r--) {
        for (let c = 0; c < width; c++) {
            let distance = (winRow - r) + Math.abs(c - center);
            let tile = document.getElementById(r + "-" + c);
            animateTile(tile, "pulse", distance * 80);
        }
    }
}