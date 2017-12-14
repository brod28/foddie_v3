'use strict';
const context_common = require('../helpers/common.js');

const jsonQuery = require('json-query')


module.exports = {
    get_NewYorkTimes(metadata) {
        let retval;
        let array_reviews_NYT = [];
        try {
            let fs = require('fs');
            let json = JSON.parse(fs.readFileSync('./data/NYtimes_in_NYC.json', 'utf8'));
            json.data.forEach(function (element) {
                array_reviews_NYT = array_reviews_NYT.concat(element.results);
            })
            array_reviews_NYT = { data: array_reviews_NYT };
        }
        catch (e) {
            console.log("NYT file doesn't load " + metadata.description);
            throw 'error';
        }
        let NYT_restaurant = jsonQuery('data[**][name=' + metadata.name + ']',
            { data: array_reviews_NYT }
        ).value;
        if (NYT_restaurant) {
            retval = {
                rating: 'N/A',
                number_of_reviews: 'N/A',
                source: 'newyorktimes',
                zomato_id: 0,
                reviews: [],
                review_article: {
                    url: NYT_restaurant.review,
                    summary: NYT_restaurant.summary,
                    by: NYT_restaurant.editors_notes
                }
            }
        }
        return retval;
    }      
}
