var guesses = []

function saveState() {
    try {
        localStorage.setItem("dewordle", JSON.stringify({ date: dayKey, guesses: guesses }));
    } catch (e) {}
    
}

function loadState(){
    let saved;
    try{
        saved = localStorage.getItem("dewordle");
    } catch (e) {return;}

    if (!saved) return;

    let state;
    try { state = JSON.parse(saved);}
    catch (e) {return;}

    if(state.date != dayKey) return;
    
    getTile().style.borderWidth = normalWidth;
    for (let guess of state.guesses) {
        for (let c = 0; c < width; c++) {
            document.getElementById(row + "-" + c).innerText = guess[c];
        }
        guesses.push(guess);
        showResult();
        row += 1;
    }
    col = 0;

    if (!gameOver && row == height) {
        gameOver = true;
        document.getElementById("answer").innerText = word;
    }
    if (!gameOver) {
        getTile().style.borderWidth = selectWidth;
    }
}