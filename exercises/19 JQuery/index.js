$("h1").css("color", "blue"); //select the h1 element and change the color property of css to blue

$(document).keydown(function(event) { //keydown is global so should select the entire document (webpage)
    console.log(event.key);
    $("h1").text(event.key);
});

$("button").on("click", function() {
    console.log($("h1").css("color"));
    //this will update all button, not just the clicked button
    $("h1").animate({margin:"20px", opacity:0.5}); //apply the two effects simultaneously
    //to chain, call animate() twice.
});
