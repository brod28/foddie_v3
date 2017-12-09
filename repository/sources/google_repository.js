'use strict';
const context_common = require('../../helpers/common.js');

const jsonQuery = require('json-query')


module.exports = {
    get_google(GoogleLocationInformation) {
        // get information for location from google 
        let get_request = {
            url: 'https://maps.googleapis.com/maps/api/place/details/json?placeid=' + GoogleLocationInformation.place_id + '&key=AIzaSyDvPk7IVCdmEVXDHF9urU9DEB-FYnTpkcE'
        };
    
        let response;
        let json;
        try {
            response = context_common.http.request_get(get_request)
    
        }
        catch (e) {
            console.log("call to google failed url " + get_request.url + " error " + e.message + e.stack);
            throw e;
        }
        try {
            json = JSON.parse(response);
        }
        catch (e) {
            console.log("failed to parse google response " + response + " error " + e.message + e.stack);
            throw e;
        }
        // parse reviews to correct structure
        let reviews = [];
        json.result.reviews.forEach(function (element) {
            let review = {
                rating: element.rating,
                time: element.relative_time_description,
                text: element.text
            };
            reviews.push(review);
        });
    
    
        // build return object
        let retval =
            {
                reviews: {
                    rating: json.result.rating,
                    number_of_reviews: 'N/A',
                    source: 'google',
                    reviews: reviews,
                    review_article: undefined
                },
                metadata: {
                    google_id: GoogleLocationInformation.place_id,
                    address: json.result.formatted_address,
                    name: json.result.name,
                    phone_number: json.result.formatted_phone_number,
                    area_near: json.result.vicinity,
                    description: GoogleLocationInformation.description,
                    website: json.result.website,
                    location: {
                        lat: json.result.geometry.location.lat,
                        lng: json.result.geometry.location.lng
                    }
                }
            }
        return retval;
    }
    
    
      
}
