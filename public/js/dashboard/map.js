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
    if (markers === undefined || markers.length == 0){
        console.log('pole location information doesnt exist')}else{

    var myLatLng = {
        lat: markers[0][1],
        lng: markers[0][2]
    }; }
    // Create a map object and specify the DOM element for display.
    map = new google.maps.Map(document.getElementById('map'), {
        center: myLatLng,
        scrollwheel: true,
        zoom: 4
    });

    function addMarker(location) {
        var number = (location[0] > 99? '99+' : location[0]);
        var color;
        if (number < 33){color = 'FFBDC7'} else if( number >= 33 && number < 66){color = "FF7578"}
         else {color ='FF5C5D'};
        var image = {
             url: 'http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld='+  number + '|' + color,
        }
        var marker = new google.maps.Marker({
        position: {lat:location[1], lng: location[2]},
            map: map,
            icon: image
        });

    }

    for (var i = 0; i < markers.length; i++) {
        var location = markers[i];
        //var location = {lat: marker[1], lng: marker[2]};
        addMarker(location);
    }
}

google.maps.event.addDomListener(window, 'load', initMap);