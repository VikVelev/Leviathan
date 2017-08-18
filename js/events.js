//trying to get other maps
$('input[type="range"]').change(function() {
    $(".sideBar").animate({ "width": "0" }, animationLength);

    currentJSON = $("input[type=\"range\"]").val();
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
let i = 0;
document.addEventListener('keydown', function(event) {
    if (currentJSON > possibleYears[i]) {
        while (true) {
            if (currentJSON == possibleYears[i]) {
                break;
            }
            i++;
        }
    } else {
        while (true) {
            if (currentJSON == possibleYears[i]) {
                break;
            }
            i--;
        }
    }

    let currentPossibleYear = i;

    if (event.keyCode == 38) {
        currentPossibleYear++;
        if (currentPossibleYear > 66) {
            currentPossibleYear = 66;
        }

        $('input[type="range"]').val(possibleYears[currentPossibleYear]);
        $('input[type="range"]').trigger('change');

    }
    if (event.keyCode == 40) {
        currentPossibleYear--;
        if (currentPossibleYear < 0) {
            currentPossibleYear = 0;
        }

        $('input[type="range"]').val(possibleYears[currentPossibleYear]);
        $('input[type="range"]').trigger('change');
    }
});