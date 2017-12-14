'use strict';
const context_common = require('../helpers/common.js');

const jsonQuery = require('json-query')


module.exports = {
    get_rest(metadata) {
        // get token from yelp
        let google_search_result = { items: [] };
        try {
            //google search 1
            let request_get = {
                url: 'https://www.googleapis.com/customsearch/v1?key=AIzaSyAZnGD9oKSiQxQdBBSDRRMSAqvDg__sfgQ&cx=008786984061848902811:9tp-ocrbvdw&q=' + metadata.description + ' Rating'
            };
            let response = context_common.http.request_get(request_get);
            google_search_result.items = google_search_result.items.concat(JSON.parse(response).items);
        }
        catch (e) {
            console.log("search 1 failed google error " + e.message + e.stack);
            throw e;
        }

        try {
            //google search 2
            let request_get = {
                url: 'https://www.googleapis.com/customsearch/v1?key=AIzaSyAZnGD9oKSiQxQdBBSDRRMSAqvDg__sfgQ&cx=008786984061848902811:eq7nh5o0slm&q=' + metadata.description + ' Rating'
            };
            let response = context_common.http.request_get(request_get);
            google_search_result.items = google_search_result.items.concat(JSON.parse(response).items);

        }
        catch (e) {
            console.log("search 2 failed google error " + e.message + e.stack);
            throw e;
        }

        // in case one of the values is NOT int throw exception 
        let retVal = [];
        let includes = [];
        google_search_result.items.forEach(function (element) {
            try {
                if (!element.displayLink.includes("yelp")
                    && !element.displayLink.includes("zomato")
                    && !includes.includes(element.displayLink)) {
                    let rating;
                    let number_of_reviews = "N/A";
                    let reviews = [];
                    if (element.pagemap) {
                        if (element.pagemap.aggregaterating) {
                            if (element.pagemap.aggregaterating[0]) {
                                rating = element.pagemap.aggregaterating[0].ratingvalue;
                                number_of_reviews = element.pagemap.aggregaterating[0].ratingcount;
                            }
                        }
                        if (element.pagemap.review) {
                            try {
                                element.pagemap.review.forEach(function (element_review) {
                                    if (element_review.reviewbody != '' && element_review.reviewbody) {
                                        let review = {
                                            rating: undefined,
                                            time: element_review.datepublished,
                                            text: element_review.reviewbody
                                        };
                                        reviews.push(review);
                                    }
                                });
                            }
                            catch (e) {
                                console.log('could parse google search review object ' + e.message + e.stack)
                            }
                        }

                    }
                    if (!rating) {
                        try {
                            rating = element.snippet.split('rated ')[1].split(' ')[0];
                            if (!context_common.helper.isFloat(rating)) {
                                rating = undefined;
                            }
                        }
                        catch (e) {
                            console.log("rest htmlSnippet parse rating failed for " + element.displayLink)
                        }
                    }

                    if (number_of_reviews == "N/A") {
                        try {
                            number_of_reviews = element.snippet.split('See ')[1].split(' ')[0];
                            if (!context_common.helper.isFloat(number_of_reviews)) {
                                number_of_reviews = "N/A";
                            }
                        }
                        catch (e) {
                            console.log("rest htmlSnippet parse rating failed for " + element.displayLink)
                        }
                    }

                    if (rating || reviews.length > 0) {
                        includes.push(element.displayLink);
                        let obj = {
                            rating: rating,
                            number_of_reviews: number_of_reviews,
                            source: element.displayLink,
                            id: 0,
                            reviews: reviews,
                            review_article: undefined
                        }
                        retVal.push(obj);
                    }
                }
            }

            catch (e) {
                console.log("rest parse rating failed for " + element.displayLink)
            }

        })
        return retVal;
    }

}
