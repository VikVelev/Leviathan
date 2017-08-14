$(".sideBar").width(0);

$("#tooltip-container").hide();
$("#tooltip-container").parent().css({ position: 'relative' });

$('input[type="range"]').rangeslider({
    polyfill: false,
    onInit: function() {
        $(".input-output").text(currentJSON);
    },
    onSlide: function(position, value) {
        $(".input-output").text(value);
    }
});