//trying to get other maps
$(".input").change(function() {
    currentJSON = $(".input").val();
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

$(window).resize(resizeMap);

$('.odometer').mousewheel(function(event) {

    $(".sideBar").animate({ "width": "0" });
    sideBarHidden = true;

    currentJSON = parseInt(currentJSON);
    currentJSON += parseInt(event.deltaY / 2);

    if (currentJSON < 1789) {
        currentJSON = 1789;
        console.log("The US didn't exist back then.");
    } else if (currentJSON > 1959) {
        currentJSON = 1959;
        console.log("There has been no changes since 1959.");
    } else if (!renderMap(currentJSON)) {
        setTimeout(function() {
            while (doesFileExist("/GeoJSON/" + currentJSON) != true) {
                currentJSON--;
            }
        }, 500);
    } else {
        console.log(currentJSON + "rendered.");
    }

    renderMap(currentJSON);
    $('.odometer').html(currentJSON);
});