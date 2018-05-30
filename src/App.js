//initializing the map code was obtained from:
//https://www.klaasnotfound.com/2016/11/06/making-google-maps-work-with-react/

import React, { Component } from 'react';
import LocationsList from './LocationsList'
import './App.css';


class App extends Component {

  //use the constructor to make the state accessible.
  constructor(props) {
    super(props);
    this.state = {
      keys: require('./keys.json'), //json file containing the api keys
      map: null,
      neighborhoodLocations: require('./NeighborhoodLocations.json'), //json needs to be small case in .json extension
      infowindow: null,
      currentMarker: null
    };

    // retain object instance when used in the function
    this.initMap = this.initMap.bind(this);
    this.populateInfoWindow = this.populateInfoWindow.bind(this);
    this.get4SContent = this.get4SContent.bind(this);
    this.closeInfowindow = this.closeInfowindow.bind(this);
    this.filterWasApplied = this.filterWasApplied.bind(this);
  }


  componentDidMount(){
        // Connect the initMap() function within this class to the global window context,
        // so Google Maps can invoke it
        window.initMap = this.initMap;
        // Asynchronously load the Google Maps script, passing in the callback reference
        loadJS(`https://maps.googleapis.com/maps/api/js?key=${this.state.keys.googleMapsKey}&callback=initMap`);
    }



  initMap() {
    var self = this;
    // Constructor creates a new map - only center and zoom are required.
    var map = new window.google.maps.Map(document.getElementById('map'), {
      center: {lat: 26.574798, lng: 49.997698},
      zoom: 13
    });
    this.setState({map: map});
    var locations = [];
    var locationsUpdated = [];
    var markers = [];
    var bounds = new window.google.maps.LatLngBounds();
    locations = this.state.neighborhoodLocations;
    for (var i = 0; i < locations.length; i++) {
          // Get the position from the location array.
          var currentLocation = locations[i];
          var position = currentLocation.location;
          var title = currentLocation.name;
          // Create a marker per location, and put into markers array.
          var marker = new window.google.maps.Marker({
            map: map,
            position: new window.google.maps.LatLng(position),
            title: title,
            animation: window.google.maps.Animation.DROP,
            id: i
          });

          //create an info window and add it to state
          var infowindow = new window.google.maps.InfoWindow();
          self.setState({
            infowindow: infowindow
          })
          marker.addListener('click', function() {
            self.populateInfoWindow(this);
          });
          // Push the marker to our array of markers.
          markers.push(marker);
          bounds.extend(markers[i].position);
          currentLocation.marker = marker;

          locationsUpdated.push(currentLocation);
     }
     map.fitBounds(bounds);

  }

  populateInfoWindow(marker) {
    var { infowindow } = this.state
    //clear previous content if any
    infowindow.setContent('');
    //attach info window to the marker
    infowindow.marker = marker;
    //set the content of the info window from four square API
    this.get4SContent(marker, infowindow);
    infowindow.open(this.state.map, marker);
    // Make sure the marker property is cleared if the infowindow is closed.
    infowindow.addListener('closeclick',function(){
      marker.setAnimation(null);
      infowindow.marker = null;
    });
  }

  closeInfowindow() {
    this.state.infowindow.close();
  }

  clickedItem(location) {
    //the marker was clicked before and its bouncing
    if (location.marker.getAnimation() === window.google.maps.Animation.BOUNCE) {
      //stop bouncing
      location.marker.setAnimation(null);
      //close the marker infowindow
      this.closeInfowindow();
      //clear the current opened marker
      this.setState({
        currentMarker: null
      })
    } else {
      //stop bouncing if there is another marker opened before
      if (this.state.currentMarker !== null) {
        this.state.currentMarker.setAnimation(null);
      }
      //set the current opened marker to this marker
      this.setState({
        currentMarker: location.marker
      })
      this.state.map.setCenter(location.marker.position)
      //bounce!
      location.marker.setAnimation(window.google.maps.Animation.BOUNCE);
      //open the info window
      this.populateInfoWindow(location.marker);
    }
  }

  //if filter was applied then check
  filterWasApplied(filterValue, clickedLocation) {
    if (clickedLocation!== null) { //there was a location clicked when the filter was applied
      if (filterValue !== clickedLocation.business && //the filter is different business
                                                      //from clicked location
          filterValue !=='all') {//the filter is not all
        //if so then act like if the location was clicked again to close the
        //info window and stop the bouncing
        clickedLocation.marker.setAnimation(null);
        //close the marker infowindow
        this.closeInfowindow();
        //clear the current opened marker
        this.setState({
          currentMarker: null
        })
      }
    }
  }
  get4SContent(marker, infowindow) {

    //set the request for the api
    let request = `https://api.foursquare.com/v2/venues/search?` +
    `client_id=${this.state.keys.foursquareClientId}
    &client_secret=${this.state.keys.foursquareClientSecret}` +
    `&ll=` + marker.getPosition().lat() +`,` + marker.getPosition().lng() +
    `&v=20180527`;


    //fetch the request using fitch API
    fetch(request)
    .then((response) => {
      //check if the response was not successful
      if (response.status !== 200) {
        console.log('Fetch request to foursquare was not successful!');
        infowindow.setContent(`<strong>Error Loading data</strong>`);
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
      }
    }).catch(exception => {
      alert.show(exception);
    })
  }

  render() {
    return (
      <div className="App" role="main">
        <LocationsList locations={this.state.neighborhoodLocations}
                       closeInfowindow={this.closeInfowindow.bind(this)}
                       clickedItem={this.clickedItem.bind(this)}
                       filterWasApplied={this.filterWasApplied.bind(this)}/>
        <div id="map" role="region" aria-label="Map of the Neighborhood Locations"></div>
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
