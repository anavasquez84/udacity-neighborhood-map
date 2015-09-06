//GLOBAL VARIABLES
var map, infowindow, marker, sunsetLocations; 

//ARRAY FOR PUSHING DATA
var markerArray = [];

//DATA
sunsetLocations =[{
    name: 'Tacos El Bronco',
    lat: 40.6502,
    lng: -74.0093,
    description:'The greatest tacos with the worst service',
    markerID: 0
},
{
    name: 'Green-Wood Cemetery',
    lat: 40.6495,
    lng: -73.9923,
    description:'Second most popular tourist destination of the 19th century',
    markerID: 1
},
{
    name: 'Brooklyn Public Library',
    lat: 40.6459,
    lng: -74.0135,
    description:'Largest selection of Spanish language occult books',
    markerID: 2
},
{
    name:'Thanh Da',
    lat: 40.6366,
    lng: -74.0135,
    description:'The best bahn mi and iced coffee',
    markerID: 3
},
{
    name:'Sunset Park',
    lat: 40.6480,
    lng: -74.0040,
    description:'Highest point in Brooklyn',
    markerID: 4
}];


//VIEWMODEL
function mapViewModel(){
    "use strict";
    var self = this;

//CREATE MAP
    var initMap =function(){
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
                title: '<h5>' + sunsetLocations[i].name + '</h5>' +
                '<p>' + sunsetLocations[i].description + '</p>',
                map:map
            });
//CREATE CLICK EVENT FOR INFO WINDOWS AND ACTIVE MARKERS
        google.maps.event.addListener(marker,'click',(function(marker){
            return function(){
                marker.setAnimation(google.maps.Animation.BOUNCE); 
                setTimeout(function(){ marker.setAnimation(null); }, 800);
                infowindow.setContent(marker.title + "<div id='content'></div>");
                infowindow.open(map, marker);
            };
        })(marker));
        //PUSHES MARKERS INTO markerArray
        markerArray.push(marker);
         }; //CLOSES LOOP
    };//CLOSES initMap

//FOR SORTING MARKERS
    self.locations = ko.observableArray(sunsetLocations);
    self.filter = ko.observable('');

//FUNCTION FOR TOGGLING MARKERS
    self.markerToggle = function(toggle){
        for(var i = 0; i <markerArray.length; i++){
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
    for(var i = 0; i <filteredmarkers.length; i++){
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

    google.maps.event.addDomListener(window, 'load', initMap);
    google.maps.event.addDomListener(window,'resize', function(){
        var center = map.getCenter();
        google.maps.event.trigger(map,'resize');
        map.setCenter(center);
    }); 

};//CLOSES mapViewModel

ko.applyBindings(new mapViewModel());

