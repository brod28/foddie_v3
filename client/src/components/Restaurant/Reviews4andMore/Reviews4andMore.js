import React, { Component } from 'react';
import Reviews from '../Reviews/Reviews'
import HeaderForPopup from '../../Header/HeaderForPopup'
import RatingFiveStars from '../../Helpers/RatingFiveStars'
import VendorLogo from '../../Helpers/VendorLogo'

import {
  BrowserRouter as Router,
  Route,
  Link
} from 'react-router-dom'

class Reviews4andMore extends Component {
  number_of_times=3;
  offset=0;
  constructor(props) {
    super(props);

    this.state = {
      number_of_more: this.props.reviews.length ,
      reviews: this.props.reviews.slice(this.offset, this.number_of_times),
      andmore: false
    }
  }
  render() {
    let _this = this;
    let rotate= () => {
      _this.offset=_this.offset+this.number_of_times;
      if(_this.offset>=_this.props.reviews.length){
        _this.offset=0;
      }
      _this.setState({
        number_of_more: _this.props.reviews.length ,
        reviews: _this.props.reviews.slice(_this.offset, _this.number_of_times+_this.offset),
        andmore: false
      });
    }
    let add_more = () => {
      _this.setState({
        number_of_more: _this.props.reviews.length ,
        reviews: _this.props.reviews,
        andmore: true
      });
    }
    let remove_more = () => {
      _this.setState({
        number_of_more: _this.props.reviews.length ,
        reviews: _this.props.reviews.slice(_this.offset, _this.number_of_times+_this.offset),
        andmore: false
      });
    }
    let fullClass = '';
    if (this.state.andmore) {
      fullClass = 'popup';
    }
    return (
      <div className={fullClass}>
        <div id="reviews_ancor" className="reviews_4_and_more">
          {this.state.reviews.map(review =>
          <div className="review">
            <ul className="reviews_per_platfrom">
              <li>
                <RatingFiveStars number_of_stars={review.rating} number_of_reviews={review.number_of_reviews}  text_reviews="reviews"/>
                
              </li>
              <li>
                <VendorLogo source={review.source}/>
              </li>
              </ul>
              <div>
                {review.reviews.length > 0 ?
                  (<Link to={window.location.pathname + '/read_reviews/' + review.inner_id}>
                    read reviews
                    {review.reviews[0].photo_url?'(with photos!!!!)':''}
                  </Link>)
                  :
                  (<div>
                     reading reviews is impossible
                  </div>)}
              </div>
              </div>
          )}
          {this.state.number_of_more > 0 ?
            <div className="and_more">
              {!this.state.andmore ?

                <p>
                  <div  onClick={rotate}>
                    <strong> total {this.state.number_of_more} ratings,<span className="clickable"> click to see other >>> </span> </strong>
                  </div>
                </p>
                :
                <HeaderForPopup name="Reviews by :TODO" back={remove_more} />

              }
            </div>
            :
            ''
          }

          <Route path="*/read_reviews/:review_platfrom_inner_id" render={({ match }) => (
            <Reviews reviews={this.state.reviews} review_platfrom_inner_id={match.params.review_platfrom_inner_id} />
          )} />

        </div>
      </div>

    )
  }
}
export default Reviews4andMore;




