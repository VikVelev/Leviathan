function getYear(id) {
    return id.toString().slice(0, 4);
}
// function to check if it's been clicked for zooming

function renderMap(id) {

    $("svg").remove();

    svg = d3.select(".container")
        .append("svg")
        //responsive SVG needs these 2 attributes and no width and height attr
        .attr("viewBox", "0 0 " + width + " " + height)
        //class to make it responsive
        .classed("svg-content-responsive", true)
        //.attr("preserveAspectRatio", "xMinYMin")
        .attr("width", width)
        .attr("height", height)
        .attr("id", "mainMap");

    g = svg.append("g");

    if (id < 1789) {
        id = 1789;
        console.log("The US didn't exist back then.");
    } else if (id > 1959) {
        id = 1959;
        console.log("There has been no changes since 1959.");
    } else {
        for (let i = 0; i < possibleYears.length; i++) {
            if (id > possibleYears[i] && id < possibleYears[i + 1]) {
                id = possibleYears[i];
                break;
            }
        }
    }

    d3.json("GeoJSON/" + id, function(error, map) {
        if (error) {
            return false;
        } else {
            $("svg").hide();
            g.selectAll("path")
                .data(map.features)
                .enter()
                .append("path")
                .attr("d", path)
                .attr("class", "states")
                .attr("country", function(map) { return map.properties.LABEL + (map.properties.COUNTRY ? ", " + map.properties.COUNTRY : " "); })
                .on("click", clicked)
                .on("mouseout", mouseOut)
                .on("mouseover", showInfo);
            $("svg").fadeIn(200);
        }
    });
}

function clicked(d) {

    currentState = d;

    clickedDOM = this;
    $("path").css({ "fill": defaultcolor });
    if (currentState == centered) {
        $("path").css({ "fill": defaultcolor });
    } else {
        $(this).css({ "fill": "#ff8a00" });
        $(this).css({ "box-shadow": "inset 10px 10px 10px 10px #666" });
    }

    let x, y, k;

    if (currentState && centered !== currentState) {

        let centroid = path.centroid(currentState);

        //console.log(centroid);

        x = centroid[0];
        y = centroid[1];

        //console.log(x, y);

        k = 4;

        centered = currentState;
        zoomedIn = true;

        $(".sideBar").animate({ "width": "250" }, animationLength);
        $("#tooltip-container").hide();

        sideBarHidden = false;
    } else {

        if (hoveredOld) {
            $(this).css({ "fill": "#DDD" });
        }

        currentState = undefined;
        centered = null;

        x = width / 2;
        y = height / 2;
        k = 1;
        zoomedIn = false;
        $(".sideBar").animate({ "width": "0" }, animationLength);

        $(".title").fadeOut(100);
        $(".description").fadeOut(100);

        sideBarHidden = true;
    }

    g.selectAll("path")
        .classed("active", centered && function(d) { return d === centered; });

    g.transition()
        .duration(750)
        //black magic(not really) that centers the state you clicked on
        //todo optimize translation for bigger states
        .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")scale(" + k + ")translate(" + -x + "," + -y + ")")

    //the border looks too big when zoomed
    .style("stroke-width", 1 / k + "px");

    let wikiData;
    let LABEL = currentState != undefined ? currentState.properties.LABEL.toString().replace(/ /g, "_ ") : "";
    //this is shit
    let regex = /^(AL|Alabama|alabama|AK|Alaska|alaska|AZ|Arizona|arizona|AR|Arkansas|arkansas|CA|California|california|CO|Colorado|colorado|CT|Connecticut|connecticut|DE|Delaware|delaware|FL|Florida|florida|GA|Georgia|georgia|HI|Hawaii|hawaii|ID|Idaho|idaho|IL|Illinois|illinois|IN|Indiana|indiana|IA|Iowa|iowa|KS|Kansas|kansas|KY|Kentucky|kentucky|LA|Louisiana|louisiana|ME|Maine|maine|MD|Maryland|maryland|MA|Massachusetts|massachusetts|MI|Michigan|michigan|MN|Minnesota|minnesota|MS|Mississippi|mississippi|MO|Missouri|missouri|MT|Montana|montana|NE|Nebraska|nebraska|NV|Nevada|nevada|NH|New Hampshire|new hampshire|NJ|New Jersey|new jersey|NM|New Mexico|new mexico|NY|New York|new york|NC|North Carolina|new carolina|ND|North Dakota|north dakota|OH|Ohio|ohio|OK|Oklahoma|oklahoma|OR|Oregon|oregon|PA|Pennsylvania|pennsylvania|RI|Rhode Island|rhode island|SC|South Carolina|south carolina|SD|South Dakota|south dakota|TN|Tennessee|tennessee|TX|Texas|texas|UT|Utah|utah|VT|Vermont|vermont|VA|Virginia|virginia|WA|Washington|washington|WV|West Virginia|west virginia|WI|Wisconsin|wisconsin|WY|Wyoming|wyoming)$/;

    if (LABEL == "Georgia") {
        LABEL = "Georgia_ state";
    }
    if (LABEL == "New_ York") {
        LABEL = "New_ York_ (state)";
    }
    if (LABEL == "Colony_ of_ Louisiana") {
        LABEL = "Louisiana_(New_Spain)";
    }
    if (LABEL == "Viceroyalty_ of_ New_ Spain") {
        LABEL = "New_Spain";
    }
    $.ajax({
        //'https://en.wikipedia.org/w/api.php?action=query&prop=revisions&rvprop=content&format=json&formatversion=2&titles=' + LABEL,
        url: "https://en.wikipedia.org/w/api.php?action=query&prop=extracts&exintro&explaintext&exsectionformat=plain&format=json&titles=" + LABEL,
        dataType: "json",
        type: "get",
        success: function(data) {
            for (var id in data.query != undefined ? data.query.pages : "") {
                $(".title,.description").fadeOut(100, function() {
                    $(".description").text("");
                    try {
                        $(".title").text(currentState.properties.LABEL);
                        let content = data.query.pages[id].extract;
                        $(".description").text(content);
                        $(".description").parent().css({ "overflow": "auto" });
                    } catch (ex) {}
                }).fadeIn(200);
            }
            wikiData = data;
        },
    });
}

function resizeMap() {

    // adjust things when the window size changes
    let widthM = $(window).width();
    widthM = widthM - parseInt($("svg").css("marginLeft")) - parseInt($("svg").css("marginRight"));
    let mapRatio = widthM > height ? height / widthM : widthM / height;

    let heightM = widthM * mapRatio;

    // resize the map container
    svg.attr('width', widthM).attr('height', heightM);
}

function doesFileExist(urlToFile) {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', urlToFile, false);
    xhr.send();

    if (xhr.status == "200") {
        return true;
    } else {
        return false;
    }
}

function showInfo() {

    //everything is hidden and default, unless otherwise said.

    $("path").css({ "fill": defaultcolor });
    $("#tooltip-container").hide();

    if (outOfSVG) {
        $("#tooltip-container").hide();
        if (zoomedIn) {
            $(clickedDOM).css({ "fill": "#ff8a00" });
        }
    } else if (hoveredOld != this) {
        if (zoomedIn) {
            $(clickedDOM).css({ "fill": "#ff8a00" });
            $("#tooltip-container").hide();
        } else {
            $("#tooltip-container").show();
            $(".tooltip-text").text($(this).attr("country"));
        }
        //Hovered
        $(this).css({ "fill": "#DDD" });

    } else if (hoveredOld == this && outOfSVG) {
        //Hovered out of the svg
        $(this).css({ "fill": "#DDD" });
    } else {
        //not hovered => at the begining of the function it's filled with default color;
        if (zoomedIn) {
            $(clickedDOM).css({ "fill": "#ff8a00" });
            $("#tooltip-container").hide();
        }
        hoveredOld = null;
    }

    let currentlyClickedState = currentState !== undefined ? currentState.properties.LABEL : "none";

    hoveredOld = this;
    outOfSVG = false;
}

function mouseOut() {
    outOfSVG = true;
    showInfo();
}