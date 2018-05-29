import React, { Component } from 'react';

class LocationsList extends Component {
  constructor(props) {
      super(props);
      this.state = {
        locations: [],
        currentFilter: '',
        clickedLocation: null
      }
      this.filterLocations = this.filterLocations.bind(this);
  }

  componentDidMount() {
    this.setState({
      locations: this.props.locations
    })
  }

 //do this when locations are filtered
  filterLocations(event) {
    //notify app logic that filter was applied to deal with info windows opened and bouncing
    this.props.filterWasApplied(event.target.value, this.state.clickedLocation)
    var shownLocations = [];
    this.props.locations.forEach((location) => {
      if (location.business === event.target.value || event.target.value === 'all') {
        location.marker.setVisible(true);
        shownLocations.push(location);
      } else {
        location.marker.setVisible(false);
      }
    })
    this.setState({
      locations: shownLocations
    })
  }



  render () {
    return (
      <div className="filter" role="heading">
        <span>Apply Filter to Locations  </span>
        <select aria-label="Select location filter" tabIndex={1} onChange={(event) => (this.filterLocations(event))}>
          <option aria-label="select one of the following filters" value="" disabled>filter locations</option>
          <option aria-label="select all locations"value="all">All</option>
          <option aria-label="select restaurants only" value="restaurants">Restaurants</option>
          <option aria-label="select malls only" value="malls">Malls</option>
          <option aria-label="select traditional locations only" value="traditional">Traditional Locations</option>
        </select>
        <ul>
        {this.state.locations.map((location, index) => (
            <li key={index}>
              <button tabIndex={index+2}
              area-label={`View details for ${location.name}`}
              onClick={() => {this.props.clickedItem(location);
                              this.setState({clickedLocation: location})}}>{location.name}</button>
            </li>
          ))}
        </ul>
      </div>

    )
  }
}

export default LocationsList;
