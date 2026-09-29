var guesses = []

function todayKey() {
    let now = new Date();
    return now.getFullYear() + "-" + (now.getMonth() + 1) + "-" + now.getDate();
}

function setCookie(name, value){
    let midnight = new Date();
    midnight.setHours(24,0,0,0);
    document.cookie = name + "=" + encodeURIComponent(value) + "; expires=" + midnight.toUTCString() + "; path=/; SameSite=Lax";
}

function getCookie(name){
    let match = document.cookie.split("; ").find(c => c.startsWith(name + "="));
    if (match) {
        return decodeURIComponent(match.substring(name.length + 1));
    } 
    else {
        return null;
    }
}

function saveState() {
    setCookie("wordle", JSON.stringify({ date: todayKey(), guesses: guesses }));
}

function loadState(){
    let saved = getCookie("wordle");
    if (!saved) return;

    let state;
    try { state = JSON.parse(saved);}
    catch (e) {return;}

    if(state.date != todayKey()) return;
    
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