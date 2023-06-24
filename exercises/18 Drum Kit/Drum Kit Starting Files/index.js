var btns = document.querySelectorAll("button.drum");

//creating a dictionary variable
var sounds = {"w":"crash", "a":"kick-bass", "s":"snare", "d":"tom-1", "j":"tom-2", "k":"tom-3", "l":"tom-4"}; 

//forEach(elem => function) is the syntax of for-each loop in JS.
btns.forEach(btn => btn.addEventListener("click", handleClick)); //each button registering a click event listener called handleClick

function handleClick() {
    buttonAnimation(this.innerHTML);
    var audio = new Audio("./sounds/" + sounds[this.innerHTML] + ".mp3");
    audio.play();
}

function buttonAnimation(key) {
    var activeButton = document.querySelector("." + key); //.key{} as a class
    activeButton.classList.add("pressed"); //in here, the added class item should not have leading '.' (interpreted in pure HTML)
    setTimeout(function() {activeButton.classList.remove("pressed");}, 100); //timeout time in ms
}

document.addEventListener("keydown", function(event) {
    var keyPressed = event.key;
    console.log("the key pressed is " + keyPressed);
    buttonAnimation(keyPressed);
    //buggy when not capturing default key.
    var audio = new Audio("./sounds/" + sounds[keyPressed] + ".mp3");
    audio.play();
});


// var audio = new Audio("./sounds/tom-1.mp3");
//     audio.play(); 
// deprecated.
// switch (this.innerHTML) {
//     case "w":
//         audio = new Audio("./sounds/" + sounds[this.innerHTML] + ".mp3");
//         audio.play();
//         break;
//     case "a":
//         audio = new Audio("./sounds/" + sounds[this.innerHTML] + ".mp3");
//         audio.play();
//         break;
//     case "s":
//         audio = new Audio("./sounds/" + sounds[this.innerHTML] + ".mp3");
//         audio.play();
//         break;
//     case "d":
//         audio = new Audio("./sounds/" + sounds[this.innerHTML] + ".mp3");
//         audio.play();
//         break;
//     case "j":
//         audio = new Audio("./sounds/" + sounds[this.innerHTML] + ".mp3");
//         audio.play();
//         break;
//     case "k":
//         audio = new Audio("./sounds/" + sounds[this.innerHTML] + ".mp3");
//         audio.play();
//         break;
//     case "l":
//         audio = new Audio("./sounds/" + sounds[this.innerHTML] + ".mp3");
//         audio.play();
//         break;
//     default:
//         console.log(this.innerHTML);
// }