//initializing the map code was obtained from:
//https://www.klaasnotfound.com/2016/11/06/making-google-maps-work-with-react/

import React, { Component } from 'react';
import './App.css';

class App extends Component {

  //use the constructor to make the state accessible.
  constructor(props) {
    super(props);
    this.state = {
      map: '',
      neighborhoodLocations: require('./NeighborhoodLocations.json'), //json needs to be small case in .json extension
      content: '',
    };

    // retain object instance when used in the function
    this.initMap = this.initMap.bind(this);
    this.populateInfoWindow = this.populateInfoWindow.bind(this);
    this.get4SContent = this.get4SContent.bind(this);
  }


  componentDidMount(){
        // Connect the initMap() function within this class to the global window context,
        // so Google Maps can invoke it
        window.initMap = this.initMap;
        // Asynchronously load the Google Maps script, passing in the callback reference
        loadJS('https://maps.googleapis.com/maps/api/js?key=AIzaSyA32vABX6bd38gkheIm3O4ocWekMfrfzu0&callback=initMap');
    }



  initMap() {
    var self = this;
    // Constructor creates a new map - only center and zoom are required.
    var map = new window.google.maps.Map(document.getElementById('map'), {
      center: {lat: 26.574798, lng: 49.997698},
      zoom: 13
    });
    var locations = [];
    var markers = [];
    var locationInfoWindow = new window.google.maps.InfoWindow();
    var bounds = new window.google.maps.LatLngBounds();
    locations = this.state.neighborhoodLocations;
    for (var i = 0; i < locations.length; i++) {
          // Get the position from the location array.
          var position = locations[i].location;
          var title = locations[i].name;
          // Create a marker per location, and put into markers array.
          var marker = new window.google.maps.Marker({
            map: map,
            position: new window.google.maps.LatLng(position),
            title: title,
            animation: window.google.maps.Animation.DROP,
            id: i
          });
          //marker.setVisible(true);
          marker.addListener('click', function() {
            self.populateInfoWindow(this, locationInfoWindow, self.map);
          });
          // Push the marker to our array of markers.
          markers.push(marker);
          bounds.extend(markers[i].position);
     }
     map.fitBounds(bounds);
     this.setState({map: map})
  }

  populateInfoWindow(marker, infowindow, map) {
    infowindow.setContent('');
    var self = this;
    if (infowindow.marker !== marker) {
        infowindow.marker = marker;

        //set the content of the info window from four square API
        self.get4SContent(marker, infowindow);
        infowindow.open(map, marker);
        // Make sure the marker property is cleared if the infowindow is closed.
        infowindow.addListener('closeclick',function(){
          infowindow.setMarker = null;
        });
      }
  }

  get4SContent(marker, infowindow) {
    var self = this;
    //set the request for the api
    let request = `https://api.foursquare.com/v2/venues/search?` +
    `client_id=` + 'YDRHIIJHXFVM0AJUNHU14FMMKSASBCXAK3SDYCUOXNYFG4WU' +
    `&client_secret=` + 'BEF01AIDLJ3YZR1S3DKXNKTVEGVI2TFENLKT1RCQK4VJEFTC' +
    `&ll=` + marker.getPosition().lat() +`,` + marker.getPosition().lng() +
    `&v=20180527`;

    var content = null;
    //fetch the request using fitch API
    fetch(request)
    .then((response) => {

      //check if the response was not successful
      if (response.status !== 200) {

        console.log('Fetch request to foursquare was not successful!');
        return(<span>Failed to load location details</span>);
      }
      //otherwise successful
      return response.json();
    }).then((data) => {
        if (data.response.venues){
        //the list of venues returned by the search query.
        var venues = data.response.venues;
        //first venue
        var theVenue = venues[0];
        //properties of the first venue
        var id = theVenue.id;
        var name = theVenue.name;
        var formattedAddress = '';
        //construct the address from the array in formattedAddress JSON.
        if (theVenue.location.formattedAddress) {
          for (let line of theVenue.location.formattedAddress) {
            formattedAddress += line + '</br>'; //new line in html to be used inside <p> element
          }
        }
        var foursquareUrl = `https://foursquare.com/v/${id}`;

        infowindow.setContent(`<p><strong>Title: </strong>${name}</p>
                <p><strong>Address: </strong>${formattedAddress}</p>
                <a href=${foursquareUrl}>Location on Foursquare</a>`);
        console.log(data.response.venues[0]);
      }
    })
  }

  render() {
    return (
      <div className="App">
        <div id="map" ></div>
      </div>
    );
  }
}



export default App;

function loadJS(src) {
    var ref = window.document.getElementsByTagName("script")[0];
    var script = window.document.createElement("script");
    script.src = src;
    script.async = true;
    ref.parentNode.insertBefore(script, ref);
}
