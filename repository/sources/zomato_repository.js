'use strict';
const context_common = require('../../helpers/common.js');

const jsonQuery = require('json-query')


module.exports = {
    get_zomato(metadata) {
        // get token from yelp
        let zomato_search_result;
        try {
            let request_get = {
                url: 'https://developers.zomato.com/api/v2.1/search?q=' + metadata.name + '&lat=' + metadata.location.lat + '&lon=' + metadata.location.lng,
                headers: { "user-key": "448f12a4c9e58334058a96bf10c16cbd" }
            };
            let response = context_common.http.request_get(request_get);
            zomato_search_result = JSON.parse(response);
        }
        catch (e) {
            console.log("search failed zomato error " + e.message + e.stack);
            throw e;
        }
        let zomato_restaurant = zomato_search_result.restaurants[0].restaurant;
        let zomato_review_result;
        try {
            let request_get = {
                url: 'https://developers.zomato.com/api/v2.1/reviews?res_id=' + zomato_restaurant.id,
                headers: { "user-key": "448f12a4c9e58334058a96bf10c16cbd" }
            };
            let response = context_common.http.request_get(request_get);
            zomato_review_result = JSON.parse(response);
        }
        catch (e) {
            console.log("review failed zomato error " + e.message + e.stack);
            throw e;
        }
    
        let reviews = [];
        zomato_review_result.user_reviews.forEach(function (element) {
            let review = {
                rating: element.review.rating,
                time: element.review.review_time_friendly,
                text: element.review.review_text
            };
            reviews.push(review);
        });
    
    
        let retval =
            {
                rating: zomato_restaurant.user_rating.aggregate_rating,
                number_of_reviews: zomato_restaurant.user_rating.votes,
                source: 'zomato',
                zomato_id: zomato_restaurant.id,
                reviews: reviews,
                review_article: undefined
            }
        return retval;
    }    
}
