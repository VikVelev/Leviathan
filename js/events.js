//trying to get other maps
$(".input").change(function() {
    currentJSON = $(".input").val()
    if (!renderMap(currentJSON)) {
        console.log("Choose the closest year.")
    } else {
        renderMap(currentJSON);
    }
});

$(window).resize(resizeMap);