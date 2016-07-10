/**
 * Created by Crystal on 7/10/16.
 */
var map;
//test data
var markers = [
    [1002, -14.2350040, -51.9252800],
    [2000, -34.028249, 151.157507],
    [123, 39.0119020, -98.4842460],
    [50, 48.8566140, 2.3522220],
    [22, 38.7755940, -9.1353670],
    [12, 12.0733335, 52.8234367],
];
function initMap() {
    if (markers === undefined || markers.length == 0) {
        console.log('pole location information doesnt exist')
    } else {

    }
    // Create a map object and specify the DOM element for display.
    map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: 0, lng: 0},
        scrollwheel: true,
        zoom: 4
    });

    function addMarker(pole) {
        var number = (pole.requests > 99 ? '99+' : pole.requests);
        var color;
        if (number < 33) {
            color = 'FFBDC7'
        } else if (number >= 33 && number < 66) {
            color = "FF7578"
        } else {
            color = 'FF5C5D'
        }
        var image = {
            url: 'http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=' + number + '|' + color,
        };
        var marker = new google.maps.Marker({
            position: {lat: pole.lat, lng: pole.lng},
            map: map,
            icon: image
        });
    }


    function addMarkers(markers) {
        markers.forEach(function (marker) {
            addMarker(marker);
        });
    }

    // Try HTML5 geolocation.
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function (position) {
            var pos = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            };
            map.setCenter(pos);
        }, function () {

        });
    }

    $.post("/api/poles/list", {requests: {$gt: 0}}, function (data) {
        log(data);
        addMarkers(data);
    });
}

google.maps.event.addDomListener(window, 'load', initMap);