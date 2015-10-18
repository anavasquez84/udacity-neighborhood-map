//GLOBAL VARIABLES
"use strict";
var map, infowindow, marker, sunsetLocations;
//FOURSQUARE REFERENCE
var client_id = 'V24CMX5ULGGZAAEWUJU2PKYCAKOARENTL0VDFBLVWD2WCOU5';
var client_secret = 'OYMORCCPFFYLII5GL4UDEH1WPZ4FMGXJX2AINNMSP4OY5GO1';
var version = '20150915';
//ARRAY FOR PUSHING DATA
var markerArray = [];

//DATA
sunsetLocations = [{
    name: 'Tacos El Bronco',
    lat: 40.6502,
    lng: -74.0093,
    markerID: 0,
    venueID: '4c9521df82b56dcbc5fbd5aa'
},
{
    name: 'Green-Wood Cemetery',
    lat: 40.6495,
    lng: -73.9923,
    markerID: 1,
    venueID: '4a8812c8f964a520140520e3'
},
{
    name: 'Brooklyn Public Library',
    lat: 40.6459,
    lng: -74.0135,
    markerID: 2,
    venueID: '4b5a00a7f964a52002a728e3'
},
{
    name:'Thanh Da',
    lat: 40.6366,
    lng: -74.0135,
    markerID: 3,
    venueID: '4aaea05bf964a520aa6220e3'
},
{
    name:'Sunset Park',
    lat: 40.6480,
    lng: -74.0040,
    markerID: 4,
    venueID: '4a4ff7a8f964a520ddaf1fe3'
}];


//CREATE MAP
    var initMap = function(){
        var mapOptions = {
            center: {lat: 40.6456, lng:-74.0119},
            zoom: 13
        };
        map = new google.maps.Map(document.getElementById('map'), mapOptions);
        infowindow = new google.maps.InfoWindow();

//CREATE MARKERS
        for(var i = 0; i < sunsetLocations.length; i++){
                marker = new google.maps.Marker({
                position: new google.maps.LatLng(sunsetLocations[i].lat, + sunsetLocations[i].lng),
                title: '<h5>' + sunsetLocations[i].name + '</h5>',
                map:map
            });

//CREATE CLICK EVENT FOR INFO WINDOWS AND ACTIVE MARKERS
        google.maps.event.addListener(marker,'click',(function(marker){
            return function(){
                marker.setAnimation(google.maps.Animation.BOUNCE); 
                setTimeout(function(){marker.setAnimation(null); }, 800);
                //setTimeout(function(){infowindow.close(); }, 1400);
                infowindow.setContent(marker.title);
                infowindow.open(map, marker);

            };
        })(marker));
//RESIZING MAP
    google.maps.event.addDomListener(window,'resize', function(){
        var center = map.getCenter();
        google.maps.event.trigger(map,'resize');
        map.setCenter(center);
    })
//PUSHES MARKERS INTO markerArray
        markerArray.push(marker);

         }//CLOSES LOOP
    };//CLOSES initMap

//VIEWMODEL
function mapViewModel(){
    var self = this;
    self.locations = ko.observableArray(sunsetLocations);
    self.markerArray = ko.observableArray(markerArray);
    self.filter = ko.observable('');

//FUNCTION FOR CLICKING LISTVIEW
    self.listView = function(locations){
        var list = markerArray[locations.markerID];
        infowindow.open(map, list);
        infowindow.setContent(list.title);
        list.setAnimation(google.maps.Animation.BOUNCE); 
        setTimeout(function(){list.setAnimation(null); }, 800);
        //setTimeout(function(){infowindow.close(); }, 1400);
    };

//FUNCTION FOR TOGGLING MARKERS
    self.markerToggle = function(toggle){
        for(var i = 0; i < markerArray.length; i++){
            markerArray[i].setMap(toggle);
        }
    };
//FUNCTION FOR FILTERING ITEMS IN self.locations
//REFERENCE: http://www.knockmeout.net/2011/04/utility-functions-in-knockoutjs.html 
    self.filterSearch = function(filter){
        return ko.utils.arrayFilter(self.locations(), function(location){
        return location.name.toLowerCase().indexOf(filter) >= 0;
    });
};
//FUNCTION FOR DISPLAYING SELECTED MARKERS ON MAP
    self.selectedMarkers = function(filteredmarkers){
    for(var i = 0; i < filteredmarkers.length; i++){
        markerArray[filteredmarkers[i].markerID].setMap(map);
        }
    };
//FUNCTION FOR FILTERING LISTVIEW AND MARKERS
    self.filterList = function(){
        var filter = self.filter().toLowerCase();
        if (!filter){
            self.markerToggle(map);
            return self.locations();
        }else{
            self.markerToggle(null);
            var filteredmarkers = [];
            filteredmarkers = self.filterSearch(filter);
            self.selectedMarkers(filteredmarkers);
            return filteredmarkers;
        }
    };

};//CLOSES mapViewModel

//LOADS MAP
google.maps.event.addDomListener(window, 'load', initMap);
ko.applyBindings(new mapViewModel());

