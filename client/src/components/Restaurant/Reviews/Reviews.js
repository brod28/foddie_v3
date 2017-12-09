import React, { Component } from 'react';
import {
    BrowserRouter as Router,
    Route,
    Link
} from 'react-router-dom'
import HeaderForPopup from '../../Header/HeaderForPopup'

class Reviews extends Component {
    constructor(props) {
        super(props);
        let reviews=[];
        let review_platfrom_inner_id=this.props.review_platfrom_inner_id;
        this.props.reviews.forEach(function(element) {
            if(element.inner_id==review_platfrom_inner_id){
                reviews=element.reviews;
            }    
        });
        this.state = {
            reviews: reviews
        }
    }
    componentDidMount() {
    }

    render() {
        let back=function(){
            window.history.back();
        }
        return (
            (
                this.state.reviews.length>1 ?
                <div className="popup">
                <div className="reviews">
                    {this.state.reviews.map(review =>
                        <div>
                            {review.photo_url?
                            <div>
                                <img src={review.photo_url} />
                            </div>
                            :
                            ''
                            }
                            <p>
                                {review.text}
                            </p>
                            {review.rating?
                            <p>
                             {review.rating} of 5
                            </p>
                            :
                            ''
                            }
                            <p>
                                {review.time}
                            </p>
                        </div>
                    )}
                    <HeaderForPopup name="Review" back={back}/>

                </div>
                </div>
                :
                <div className="popup">
                    <div>
                    Loading reviews ...
                    <HeaderForPopup name="Review" back={back}/>
                    </div>
                    </div>
            )
        )
    }
}
export default Reviews;
