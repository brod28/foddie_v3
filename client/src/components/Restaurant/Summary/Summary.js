import React, { Component } from 'react';
import {
    BrowserRouter as Router,
    Route,
    Link
  } from 'react-router-dom'

import RatingFiveStars from '../../Helpers/RatingFiveStars'
class Summary extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
  }

  render() {
    return (
        this.props.data?
      <div className="Summary">
          <p>
              Summary
          </p>
          <div className="per_review col-xs-6">
          <RatingFiveStars number_of_stars={this.props.data.rating.per_review.rating} 
          number_of_reviews={this.props.data.rating.per_review.number_of_reviews} text_reviews="reviews"/>
          </div>
          <div className="per_company col-xs-6">
          <RatingFiveStars number_of_stars={this.props.data.rating.per_platform.rating} 
          number_of_reviews={this.props.data.rating.per_platform.number_of_reviews} text_reviews="platforms"/>
          </div>
          <div className="per_company col-xs-4">
          <strong>total {this.props.data.articles.sum} articles</strong>
          </div>
          <div className="per_company col-xs-4">
          <strong>total {this.props.data.photos.sum} photos and much more on instagram</strong>
          </div>
          <div className="per_company col-xs-4">
          <strong>{this.props.data.menus.sum} menu</strong>
          </div>
      </div>
      :
      ''
    );
  }
}

export default Summary;
