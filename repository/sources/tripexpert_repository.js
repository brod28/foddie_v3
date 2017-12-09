'use strict';
const context_common = require('../../helpers/common.js');

const jsonQuery = require('json-query')


module.exports = {
    get_tripexpert(metadata) {
        let venues = [];
        try {
            let get_request = {
                url: 'https://api.tripexpert.com/v1/venues?api_key=832c8b4fdfdb4a1831d04e83b744be7f&limit=20&order_by=distance&latitude=' + metadata.location.lat + '&longitude=' + metadata.location.lng
            };
            let response = context_common.http.request_get(get_request);
            venues = JSON.parse(response).response.venues;
        }
        catch (e) {
            console.log("failed trip export search venues " + e.message + e.stack);
            throw e;
        }

        let venue_id;
        let stringSimilarity = require('string-similarity');
        let old_similarity=0.31;
        venues.forEach(element => {
            let similarity = stringSimilarity.compareTwoStrings(element.name, metadata.name);
            if (similarity > old_similarity) {
                venue_id = element.id;
                old_similarity=similarity;
            }
        })

        if (!venue_id) {
            console.log("no similiraty in  trip export");
            throw "no similiraty in  trip export";
        }

        let venue;
        try {
            let get_request = {
                url: 'https://api.tripexpert.com/v1/venues/' + venue_id + '/?api_key=832c8b4fdfdb4a1831d04e83b744be7f'
            };
            let response = context_common.http.request_get(get_request);
            venue = JSON.parse(response).response.venues[0];
        }
        catch (e) {
            console.log("failed trip export search venues " + e.message + e.stack);
            throw e;
        }

        let retVal = [];
        venue.reviews.sort(function(a, b)
            {return a.publication_id-b.publication_id}
        );
        venue.reviews.forEach(review => {
            try{
                retVal.push(
                    {
                        rating: review.publication_rating_name,
                        number_of_reviews: 'N/A',
                        source: review.publication_name,
                        tripexpert_id: review.id,
                        reviews: [],
                        review_article: {
                            url: review.source_url,
                            summary: review.extract,
                            by: ''
                        }
                    }
                )    
            }
            catch(e){
                console.log("trip export of reviews failed to parsed " + e.message + e.stack);
            }
        })


        return retVal;
    }


}
