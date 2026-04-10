let modes = ["easy", "normal", "hard"];
let selectedMode = "normal";
let reactionSpeed = 1200;

const NUM_PLAYERS = 4;
const HAND_SIZE = 20;

let players = [];
let currentPlayer = 0;
let counter = 0;
let pile = [];
let reactionActive = false;
let clickTimes = [];

/* ---------------- MODE SELECTION ---------------- */

function selectMode() {
    let display = document.getElementById('mode');

    display.innerHTML = `
        <h2>Select Mode</h2>

        <div class="mode-buttons">
            <button onclick="setMode('easy')">Easy<br><small>Slow reaction</small></button>
            <button onclick="setMode('normal')">Normal<br><small>Balanced</small></button>
            <button onclick="setMode('hard')">Hard<br><small>Fast reaction</small></button>
        </div>

        <button onclick="showRules()" class="play">Play</button>
    `;
}

function setMode(mode) {
    selectedMode = mode;

    if (mode === "easy") reactionSpeed = 2000;
    if (mode === "normal") reactionSpeed = 1200;
    if (mode === "hard") reactionSpeed = 600;
}

/* ---------------- RULES SCREEN ---------------- */

function showRules() {
    let display = document.getElementById('mode');

    display.innerHTML = `
        <div id="rulesScreen">
            <h2>Rules</h2>

            <p>
                Players take turns placing cards and counting upward.<br><br>
                If a card matches the number, everyone must react quickly.<br><br>
                The slowest player takes the pile.
            </p>

            <button onclick="startGame()">Start Game</button>
        </div>
    `;
}

function startGame() {
    loadGameUI();
}

/* ---------------- GAME UI ---------------- */

function loadGameUI(){
    let display = document.getElementById('mode');

    display.innerHTML = `
    <h1>Manotaso</h1>

    <div id="table">

        <div class="opponent top">
            <div class="cards-back"></div>
            <p id="p2Count"></p>
        </div>

        <div class="opponent left">
            <div class="cards-back vertical"></div>
            <p id="p3Count"></p>
        </div>

        <div class="opponent right">
            <div class="cards-back vertical"></div>
            <p id="p4Count"></p>
        </div>

        <div id="center">
            <div id="deck"></div>
            <div id="pile"></div>

            <button id="slapBtn">SLAP</button>
            <p>Current: <span id="counter">0</span></p>
            <p id="message"></p>
        </div>

        <div id="hand"></div>
    </div>
    `;

    initGame();
    renderDeck();
    renderHand();

    document.getElementById("slapBtn").onclick = () => {
        if (!reactionActive) return;
        registerClick(0);
    };
}

/* ---------------- GAME LOGIC ---------------- */

function initGame() {
    players = [];

    for (let i = 0; i < NUM_PLAYERS; i++) {
        let hand = [];
        for (let j = 0; j < HAND_SIZE; j++) {
            hand.push(Math.floor(Math.random() * 10));
        }
        players.push({ hand });
    }

    counter = 0;
    currentPlayer = 0;
    pile = [];

    renderDeck();
    renderHand();
    updateCounts();
}

function renderDeck() {
    const deck = document.getElementById("deck");
    deck.innerHTML = "";

    for (let i = 0; i < 6; i++) {
        const div = document.createElement("div");
        div.className = "card-back";
        div.style.setProperty("--i", i);
        deck.appendChild(div);
    }
}

function renderHand() {
    const handDiv = document.getElementById("hand");
    handDiv.innerHTML = "";

    let div = document.createElement("div");
    div.className = "player-card";
    div.innerText = players[0].hand.length;

    div.onclick = () => {
        if (currentPlayer !== 0 || reactionActive) return;

        let index = Math.floor(Math.random() * players[0].hand.length);
        playCard(index);
    };

    handDiv.appendChild(div);
}

function renderPile() {
    const pileDiv = document.getElementById("pile");
    pileDiv.innerHTML = "";

    pile.slice(-5).forEach((card, i) => {
        const div = document.createElement("div");
        div.className = "card";
        div.innerText = card;
        div.style.setProperty("--i", i);
        pileDiv.appendChild(div);
    });
}

function updateCounts() {
    document.getElementById("p2Count").innerText = players[1].hand.length;
    document.getElementById("p3Count").innerText = players[2].hand.length;
    document.getElementById("p4Count").innerText = players[3].hand.length;
}

function playCard(index) {
    if (currentPlayer !== 0 || reactionActive) return;

    takeTurn(0, index);
    npcTurns();
}

function takeTurn(playerIndex, cardIndex = null) {
    let player = players[playerIndex];

    let card;

    if (playerIndex === 0) {
        card = player.hand.splice(cardIndex, 1)[0];
    } else {
        let rand = Math.floor(Math.random() * player.hand.length);
        card = player.hand.splice(rand, 1)[0];
    }

    pile.push(card);
    renderPile();

    document.getElementById("counter").innerText = counter;

    if (card === counter) {
        startReaction();
        return;
    }

    counter = (counter + 1) % 10;
    currentPlayer = (currentPlayer + 1) % NUM_PLAYERS;

    updateCounts();
    checkWin();
}

function npcTurns() {
    let interval = setInterval(() => {
        if (currentPlayer === 0 || reactionActive) {
            clearInterval(interval);
            renderHand();
            return;
        }
        takeTurn(currentPlayer);
    }, 800);
}

/* ---------------- REACTION SYSTEM (FIXED) ---------------- */

let reactionStartTime = 0;
let reactionEnded = false;
let reactionTimeout = null;

function startReaction() {
    reactionActive = true;
    reactionEnded = false;

    document.getElementById("message").innerText = "SLAP NOW!";

    clickTimes = [];
    reactionStartTime = Date.now();

    for (let i = 1; i < NUM_PLAYERS; i++) {
        let delay = Math.random() * reactionSpeed;

        setTimeout(() => {
            if (!reactionActive || reactionEnded) return;
            registerClick(i);
        }, delay);
    }

    reactionTimeout = setTimeout(() => {
        if (!reactionEnded) endReaction();
    }, 2500);
}

function registerClick(playerIndex) {
    if (reactionEnded) return;

    if (clickTimes.some(c => c.player === playerIndex)) return;

    clickTimes.push({
        player: playerIndex,
        time: Date.now() - reactionStartTime
    });

    if (playerIndex === 0) {
        endReaction();
    }
}

function endReaction() {
    if (reactionEnded) return;

    reactionEnded = true;
    reactionActive = false;

    clearTimeout(reactionTimeout);

    let results = [];

    for (let i = 0; i < NUM_PLAYERS; i++) {
        let click = clickTimes.find(c => c.player === i);

        results.push({
            player: i,
            time: click ? click.time : Infinity
        });
    }

    results.sort((a, b) => a.time - b.time);

    let loser = results[results.length - 1].player;

    players[loser].hand.push(...pile);
    pile = [];

    renderPile();

    document.getElementById("message").innerText =
        "Player " + (loser + 1) + " was last and takes the pile";

    counter = 0;
    currentPlayer = 0;

    clickTimes = [];

    renderHand();
    updateCounts();
}

function checkWin() {
    players.forEach((p, i) => {
        if (p.hand.length === 0) {
            alert("Player " + (i + 1) + " wins!");
            location.reload();
        }
    });
}