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
      <div className="filter">
        <span>Apply Filter to Locations  </span>
        <select onChange={(event) => (this.filterLocations(event))}>
          <option value="" disabled>filter locations</option>
          <option value="all">All</option>
          <option value="restaurants">Restaurants</option>
          <option value="malls">Malls</option>
          <option value="traditional">Traditional Locations</option>
        </select>
        <ul>
        {this.state.locations.map((location, index) => (
            <li key={index}>
              <button onClick={() => {this.props.clickedItem(location);
                                      this.setState({clickedLocation: location})}}>{location.name}</button>
            </li>
          ))}
        </ul>
      </div>

    )
  }
}

export default LocationsList;
