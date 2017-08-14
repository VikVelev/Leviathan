//trying to get other maps
$('input[type="range"]').change(function() {
    $(".sideBar").animate({ "width": "0" }, animationLength);

    currentJSON = $('input[type="range"').val();
    let currentJSON_Int = parseInt(currentJSON);

    if (/^\d+$/.test(currentJSON)) {
        if (currentJSON_Int < 1789) {
            renderMap(1789);
            console.log("The US didn't exist back then.");
        } else if (currentJSON_Int > 1959) {
            renderMap(1959);
            console.log("There has been no changes since 1959.");
        } else if (!renderMap(currentJSON_Int)) {
            while (doesFileExist("/GeoJSON/" + currentJSON_Int) != true) {
                currentJSON_Int--;
            }
            renderMap(currentJSON_Int);
        } else {
            renderMap(currentJSON_Int);
            console.log(currentJSON_Int + "rendered.");
        }
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