var r1 = Math.floor(Math.random() * 6) + 1;
var r2 = Math.floor(Math.random() * 6) + 1;
console.log("player1: " + r1);
console.log("player2: " + r2);
//use DOM manipulation to alter the src link to the dice1 - dice6
document.querySelector(".img1").setAttribute("src", "./images/dice" + r1 + ".png");
document.querySelector(".img2").setAttribute("src", "./images/dice" + r2 + ".png");

if(r1 > r2) {
    document.querySelector("h1").textContent = "Player 1 Wins!";
} else if(r1 < r2) {
    document.querySelector("h1").textContent = "Player 2 Wins!";
} else {
    document.querySelector("h1").textContent = "Draw!";
}