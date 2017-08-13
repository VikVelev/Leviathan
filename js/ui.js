$(".sideBar").width(0);

$('input[type="range"]').rangeslider({
    polyfill: false,
    onInit: function() {
        $(".input-output").text(currentJSON);
    },
    onSlide: function(position, value) {
        $(".input-output").text(value);
    }
});