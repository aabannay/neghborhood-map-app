import React, { Component } from 'react';

class LocationsList extends Component {
  constructor(props) {
      super(props);
      this.state = {
        locations: []
      }
  }

  componentDidMount() {
    this.setState({
      locations: this.props.locations
    })
  }
  render () {

    return (
      <div className="filter">
        <span>Apply Filter to Locations  </span>
        <select>
          <option value="" disabled>filter locations</option>
          <option value="all">All</option>
          <option value="restaurants">Restaurants</option>
          <option value="malls">Malls</option>
          <option value="traditional">Traditional Locations</option>
        </select>
        <ul>
        {this.state.locations.map((location, index) => (
            <li key={index}>
              <p>{location.name}</p>
            </li>
          ))}
        </ul>
      </div>

    )
  }
}

export default LocationsList;
