import React, { Component } from 'react';

class RatingFiveStars extends Component {
    constructor(props) {
      super(props);
  
    }
    render() {
        let number_of_stars;
        let number_of_reviews;
        try{
          number_of_stars = parseFloat(this.props.number_of_stars) +0.301
        }
        catch(e){
          console.log(e.message + e.stack) 
        }
        try{
          number_of_reviews = parseInt(this.props.number_of_reviews) 
        }
        catch(e){
          console.log(e.message + e.stack) 
        }
        
        let starts = [];
      if(number_of_stars){
        for (let i = 1; i < 6; i++) {
          starts.push(number_of_stars >= i ?
            <img src={require('../../images/star.svg')} />
            :
            (          
              number_of_stars +0.5>=i ?
              <img src={require('../../images/star_half.png')} />
              :
            <img src={require('../../images/star_empty.svg')} />
              ))
        }
      }
      else{
        starts.push(
          <img src={require('../../images/no_rating.png')} />);      
      }
      return (
      <div className={"review_stars "+(!number_of_reviews?'number_reviews_not':'')}>
        {starts.map(star =>
          star
        )}
        {!number_of_reviews?
                ''
                :
                <p>
                  based on {number_of_reviews} {this.props.text_reviews} 
                </p>
                }
      </div>)
  
    }
  }
  
  export default RatingFiveStars;
  