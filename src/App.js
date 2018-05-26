//initializing the map code was obtained from:
//https://www.klaasnotfound.com/2016/11/06/making-google-maps-work-with-react/

import React, { Component } from 'react';
import './App.css';

class App extends Component {

  state = {

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
