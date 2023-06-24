var btnColors = ["red", "green", "blue", "yellow", "purple", "white", "black"];
var colors = 4;
var gamePattern = [];
var userClickedPattern = []; //this should be flushed each level

var gameStarted = false;
var level = 0;

$(document).on("keydown", function(event) { //start code
    if(!gameStarted) { 
        gameStarted = true;
        console.log("key pressed, game started");
        level = 1;
        nextSequence();
    }
});

// for(var i = 1; i < level; i++) {
//    gamePattern.push("red");
// }

$(".btn").on("click", function() { //user action registered, static, does not apply to any injected html (purple, white, black etc.)
    var userChosenColor = this.id;
    console.log(userChosenColor);
    animatePress(userChosenColor);
    playSound(userChosenColor);
    if(gameStarted) {
        userClickedPattern.push(userChosenColor);
        console.log("user pattern: " + userClickedPattern);
        checkAnswer(level);
    }
});

function nextSequence() { //create new level
    //for every 5 levels, append a color
    // if(colors < btnColors.length && level / 5 > 1 && level % 5 == 1) {
    //     appendColor(colors++);
    // }
    var rn = Math.floor(Math.random() * colors); 
    rnChosenColor = btnColors[rn];
    console.log(rn);
    gamePattern.push(rnChosenColor);
    console.log("gamepattern:", gamePattern);

    $("h1").text("Level " + level);
    animatePress(rnChosenColor);
    playSound(rnChosenColor);
}

function appendColor(colorIndex) {
    //add purple panel, white panel and black panel to the html
    var currcolor = btnColors[colorIndex];
    console.log(currcolor);
    if(colorIndex % 2 == 0) {
        $("body .container").append("<div class='row'><div type='button' id='" + currcolor + "' class = 'btn " + currcolor + "'></div></div>");
    } else {
        $(".container .row").last().append("<div type='button' id='" + currcolor +"' class = 'btn " + currcolor + "'></div>");
    }
    console.log(document.querySelector("body .container").innerHTML);
    console.log($(".btn").text());
}


function checkAnswer(currlevel) {
    var correct = true;
    var index = userClickedPattern.length - 1;
    
    //guard against typing during the level up may break the index
    if(index < currlevel && gamePattern[index] != userClickedPattern[index]) { //if the user mistyped
        correct = false;
    }
    
    if(correct && index + 1 == currlevel) { //if the user has finishing the sequence 
        //to next level
        level++;
        setTimeout(function(){ //callback responded 1 second later
            nextSequence(); //level up!
        }, 1000);
        userClickedPattern.length = 0; //clear user input, retype in the next level
    } else if(!correct) {
        $("h1").text("Game Over, Press Any Key to Restart");
        playSound("wrong");
        
        userClickedPattern.length = 0;
        gamePattern.length = 0;
        level = 0;
        color = 4;
        gameStarted = false;

        $("body").addClass("game-over");
        setTimeout(function(){
            $("body").removeClass("game-over");
        }, 200);
    }
}

function playSound(color) {
    var audio = new Audio("./sounds/"+color+".mp3");
    audio.play();
}

function animatePress(color) {
    var elem = $(".btn" + "#" + color);
    elem.addClass("pressed"); //make grey effect
    //src: https://stackoverflow.com/questions/275931/how-do-you-make-an-element-flash-in-jquery
    elem.fadeOut(100).fadeIn(100).fadeOut(100).fadeIn(100);
    elem.removeClass("pressed"); //release grey effect
}
