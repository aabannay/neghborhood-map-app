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
      neighborhoodLocations: require('./NeighborhoodLocations.json')
    };

    // retain object instance when used in the function
    this.initMap = this.initMap.bind(this);
  }


  componentDidMount(){
        // Connect the initMap() function within this class to the global window context,
        // so Google Maps can invoke it
        window.initMap = this.initMap;
        // Asynchronously load the Google Maps script, passing in the callback reference
        loadJS('https://maps.googleapis.com/maps/api/js?key=AIzaSyA32vABX6bd38gkheIm3O4ocWekMfrfzu0&callback=initMap');
    }



  initMap() {
    // Constructor creates a new map - only center and zoom are required.
    var map = new window.google.maps.Map(document.getElementById('map'), {
      center: {lat: 26.574798, lng: 49.997698},
      zoom: 13
    });
    var locations = [];
    var markers = [];
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
          marker.setVisible(true);
          // Push the marker to our array of markers.
          markers.push(marker);
          bounds.extend(markers[i].position);
     }
     map.fitBounds(bounds);
     this.setState({map: map})
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
