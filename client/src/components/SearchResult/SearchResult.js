import React, { Component } from 'react';
import {
    BrowserRouter as Router,
    Route,
    Link
  } from 'react-router-dom'
class SearchResult extends Component {
  constructor(props) {
    super(props);
    this.state = {restaurants: []}
  }

  componentDidMount() {
    fetch('/api/search?name='+this.props.name)
      .then(res => res.json())
      .then(restaurants => this.setState({ restaurants:restaurants.data }));
  }

  render() {
    return (
      <div className="search_result">
          {this.state.restaurants.map(restaurant =>
            <p>
                <Link to={'/restaurant/'+restaurant.description}>
                    {restaurant.description}
                </Link>
            </p>
          )}
      </div>
    );
  }
}

export default SearchResult;
