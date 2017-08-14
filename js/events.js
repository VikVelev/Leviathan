//trying to get other maps
$('input[type="range"]').change(function() {
    $(".sideBar").animate({ "width": "0" }, animationLength);

    currentJSON = $('input[type="range"').val();
    let currentJSON_Int = parseInt(currentJSON);

    if (/^\d+$/.test(currentJSON)) {
        renderMap(currentJSON);
    } else {
        console.log("Not an year");
    }
});

$(window).on("DOMContentLoaded", function() {
    setTimeout(function() {
        $(".loading").fadeOut(400);
        setTimeout(function() {
            $(".loading").remove();
        }, 400);
    }, 1500);
});

$(window).on("mousemove", function() {
    $("#tooltip-container").css({ top: event.clientY - 45, left: event.clientX + 5, position: 'absolute' });
});