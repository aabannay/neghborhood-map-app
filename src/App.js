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
      center: {lat: 40.7413549, lng: -73.9980244},
      zoom: 13
    });
  }



  render() {
    const mapStyle = {
      height: '100vh',
      width: '100vw'
    };
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">Neghborhood Map</h1>
        </header>
        <div id="map" style={mapStyle}></div>
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
