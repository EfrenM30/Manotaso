Card Slap Reaction Game

A fast-paced browser card game where players race to react when the played card matches the current count. The slowest player takes the pile, so timing and reflexes are everything.

Features
4-player gameplay (1 human vs 3 NPCs)
Multiple difficulty modes:
Easy
Normal
Hard
Randomized card system
Reaction-based slap mechanic
Automatic NPC reactions
Dynamic pile system
Win detection
Reset/game restart support
How to Play
Select a difficulty mode.
Read the game rules.
Start the game.
Players take turns placing cards while counting upward.
If the played card matches the current counter:
Everyone must press SLAP as fast as possible.
The slowest player takes the pile.
The first player to run out of cards wins.
Game Rules
Players take turns placing cards and counting upward.
If a card matches the number, everyone must react quickly.
The slowest player takes the pile.
Difficulty Modes
Mode	Reaction Speed
Easy	2000ms
Normal	1200ms
Hard	600ms
Project Structure
project-folder/
│
├── index.html
├── style.css
├── script.js
└── images/
    └── title.png
Code Overview

The game is built using JavaScript, HTML, and CSS.

1. Mode Selection

Players choose a game difficulty that changes NPC reaction speed.

let modes = ["easy", "normal", "hard"];
let selectedMode = "normal";
let reactionSpeed = 1200;
2. Game Initialization

Creates players and fills each hand with random cards.

function initGame() {
    players = [];

    for (let i = 0; i < NUM_PLAYERS; i++) {
        let hand = [];

        for (let j = 0; j < HAND_SIZE; j++) {
            hand.push(Math.floor(Math.random() * 10));
        }

        players.push({ hand });
    }
}
3. Card Playing System

Handles turns and card placement.

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
}
4. Reaction System

Starts the slap phase when a card matches the counter.

function startReaction() {
    reactionActive = true;
    reactionEnded = false;

    document.getElementById("message").innerText = "SLAP NOW!";
}
5. Winner Detection

Checks if a player has no cards remaining.

function checkWin() {
    players.forEach((p, i) => {
        if (p.hand.length === 0) {
            alert("Player " + (i + 1) + " wins!");
            location.reload();
        }
    });
}
Example HTML Structure
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Card Slap Reaction Game</title>

    <link rel="stylesheet" href="style.css">
</head>
<body>

    <div id="mode"></div>

    <script src="script.js"></script>
</body>
</html>
Technologies Used
HTML5
CSS3
JavaScript (Vanilla JS)
Future Improvements
Multiplayer support
Online matchmaking
Sound effects
Better animations
Mobile support
Custom card themes
Score tracking system
Known Issues
NPC reactions may occasionally feel too random.
Reloading the page resets all progress.
Cards are represented only as numbers for now.
Installation
Download the project files.
Place all files in the same folder.
Open index.html in your browser.
Contributing

Feel free to fork this project and improve it with:

New game mechanics
Better UI/UX
Additional game modes
Improved AI behavior
Bug fixes

Pull requests are welcome.
