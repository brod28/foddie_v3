'use strict';
const context_common = require('./helpers/common.js');
const DAL = require('./DAL/DAL.js');
const locationRepository = require('./location.js');
const jsonQuery = require('json-query')

const zomato_repository = require('./sources/zomato_repository.js');
const yelp_repository = require('./sources/yelp_repository');
const newYorkTimes_repository = require('./sources/newYorkTimes_repository');
const foursquare_repository = require('./sources/foursquare_repository');
const rest_repository = require('./sources/rest_repository');
const facebook_instagram_repository = require('./sources/facebook_instagram_repository');
const google_repository = require('./sources/google_repository');
const tripexpert_repository = require('./sources/tripexpert_repository');
const log = require("./helpers/common.js").log;

const cache = [];

/*
const promiseTimeout = function(ms, promise){
    
      // Create a promise that rejects in <ms> milliseconds
      let timeout = new Promise((resolve, reject) => {
        let id = setTimeout(() => {
          clearTimeout(id);
          resolve('Timed out in '+ ms + 'ms.')
        }, ms)
      })
    
      // Returns a race between our timeout and the passed in promise
      return Promise.race([
        promise,
        timeout
      ])
    }

*/
module.exports = {
    ParseCacheName(name){
        return name;//.toLowerCase().replace(/,/g,'-').replace(/./g,'-').replace(/ /g,'-');
    },
    IsInCache(name) {
        name=this.ParseCacheName(name);
        let retVal=DAL.GetPlace(name);
        return retVal;
    },
    PushToCache(name, obj) {
        name=this.ParseCacheName(name);
        if(obj){
            obj=JSON.parse(JSON.stringify(obj).replaceAll('""','" "'));
            let model={
                reviews:obj,
                place_full_name:name
            }
            DAL.AddPlace(model);
        }
    },
    get_cache_reviews(request) {
        let retVal = this.IsInCache(request.name);
        return retVal;
    },
    get_reviews(request) {
        console.log('start get data ' + new Date().getSeconds());

        let retVal = this.IsInCache(request.name);

        // creating object to return
        if (!retVal) {
            log.information("start get data for " + request.name);


            // making search for sepecific location
            let GoogleLocationInformation;
            let GoogleLocationBasicInformation;
            try {
                GoogleLocationBasicInformation = locationRepository.search({ name: request.name })[0];
                log.information("passed google search" + GoogleLocationBasicInformation);
            }
            catch (e) {
                console.log("google for " + request.name + " search did work error:" + e.message + e.stack)
            }
            //get all the reviews
            if (GoogleLocationBasicInformation) {
                retVal = this.IsInCache(GoogleLocationBasicInformation.description);
                if (!retVal) {

                    retVal = {
                        metadata: undefined,
                        reviews: []
                    }
                    // get google reviews
                    try {
                        // update not just review but also metadata
                        GoogleLocationInformation = google_repository.get_google(GoogleLocationBasicInformation);
                        retVal.metadata = GoogleLocationInformation.metadata;
                        retVal.reviews.push(GoogleLocationInformation.reviews);
                    }
                    catch (e) {
                        console.log("google for " + request.name + " reviews did work error:" + e.message + e.stack)
                    }



                    // get facebook/instagram reviews
                    //            promises.push(new Promise(function (resolve, reject) {
                    //                setTimeout(function () {
                    console.log("start facebook" + new Date().getSeconds());
                    try {
                        let facebook_instagram_review = facebook_instagram_repository.get_facebook_instagram(GoogleLocationInformation.metadata)
                        retVal.reviews = retVal.reviews.concat(facebook_instagram_review);
                    }
                    catch (e) {
                        console.log("facebook for " + request.name + "reviews did work error:" + e.message + e.stack)
                    }
                    console.log("end facebook" + new Date().getSeconds());
                    //                    resolve('Success!');
                    //                }, 150)
                    //            }));

                    console.log('start promises get data ' + new Date().getSeconds());

                    let promises = [];
                    let IsPromisesDone = false;
                    // get yelp reviews
                    promises.push(new Promise(function (resolve, reject) {
                        setTimeout(function () {
                            console.log("start yelp" + new Date().getSeconds());
                            try {
                                let yelp_review = yelp_repository.get_yelp(GoogleLocationInformation.metadata)
                                retVal.reviews.push(yelp_review);
                            }
                            catch (e) {
                                console.log("yelp for " + request.name + "reviews did work error:" + e.message + e.stack)
                            }
                            console.log("end yelp" + new Date().getSeconds());
                            resolve('Success!');
                        }, 100)
                    }));

                    // get  zomato reviews
                    promises.push(new Promise(function (resolve, reject) {
                        setTimeout(function () {
                            console.log("start zomato" + new Date().getSeconds());
                            try {
                                let zomato_review = zomato_repository.get_zomato(GoogleLocationInformation.metadata)
                                retVal.reviews.push(zomato_review);
                            }
                            catch (e) {
                                console.log("zomato for " + request.name + "reviews did work error:" + e.message + e.stack)
                            }
                            resolve('Success!');
                            console.log("end zomato" + new Date().getSeconds());
                        }, 100)
                    }));

                    /*
                    promises.push(new Promise(function (resolve, reject) {
                        setTimeout(function () {
                            console.log("start rest"+ new Date().getSeconds());
                            try {
                                let rest_review = rest_repository.get_rest(GoogleLocationInformation.metadata)
                                retVal.reviews = retVal.reviews.concat(rest_review);
                            }
                            catch (e) {
                                console.log("rest for " + request.name + "reviews did work error:" + e.message + e.stack)
                            }
                            console.log("end rest"+ new Date().getSeconds());
                            resolve('Success!');
                        }, 80)
                    }));
                    */
                    promises.push(new Promise(function (resolve, reject) {
                        setTimeout(function () {
                            console.log("start tripexpert" + new Date().getSeconds());
                            try {
                                let tripexport_review = tripexpert_repository.get_tripexpert(GoogleLocationInformation.metadata)
                                retVal.reviews = retVal.reviews.concat(tripexport_review);
                            }
                            catch (e) {
                                console.log("tripexpert for " + request.name + "reviews did work error:" + e.message + e.stack)
                            }
                            console.log("end tripexpert" + new Date().getSeconds());
                            resolve('Success!');
                        }, 123)
                    }));

                    /*  promises.push(new Promise(function (resolve, reject) {
                          setTimeout(function () {
                              console.log("start NYC");
                              try {
                                  let NYC_review = newYorkTimes_repository.get_NewYorkTimes(GoogleLocationInformation.metadata);
                                  if (NYC_review) {
                                      retVal.reviews.push(NYC_review);
                                  }
                              }
                              catch (e) {
                                  console.log("NYT for " + request.name + "reviews did work error:" + e.message + e.stack)
                              }
                              resolve('Success!');
                              console.log("end NYC");
                          }, 150)
                      }));*/

                    promises.push(new Promise(function (resolve, reject) {
                        setTimeout(function () {

                            console.log("start foursquare" + new Date().getSeconds());
                            try {
                                let foursquare_review = foursquare_repository.get_foursquare(GoogleLocationInformation.metadata);
                                retVal.reviews = retVal.reviews.concat(foursquare_review);
                            }
                            catch (e) {
                                console.log("foursquare for " + request.name + "reviews did work error:" + e.message + e.stack)
                            }
                            resolve('Success!');
                            console.log("end foursquare" + new Date().getSeconds());

                        }, 151)
                    }));



                    Promise.all(promises).then(function (results) {
                        IsPromisesDone = true;
                    })

                    require('deasync').loopWhile(()=>{
                        return !IsPromisesDone;
                    });

                    console.log('end  get data ' + new Date().getSeconds());
                    this.PushToCache(request.name, retVal);
                    this.PushToCache(GoogleLocationInformation.metadata.description, retVal);
                }
                else {
                    console.log("found in the cache for " + retVal.metadata.description )
                    this.PushToCache(request.name, retVal);
                    
                }
            }
            else {
                console.log("google for " + request.name + " didn't find anything")
            }
        }

        return retVal;
    }
}



/*

//not in use
function get_tripadviser() {
    let tripadviser_id = google_search_result.items[0].formattedUrl.split("g")[1].split('-')[0];
    let tripadviser_result;
    try {
        let request_get = {
            url: 'http://api.tripadvisor.com/api/partner/2.0/location/' + tripadviser_id + '?key=',
            headers: { "X-TripAdvisor-API-Key": "" }

        };
        let response = context_common.http.request_get(request_get);
        tripadviser_result = JSON.parse(response);
    }
    catch (e) {
        console.log("failed tripadviser error " + e.message + e.stack);
        throw e;
    }
}

        //idea
            let request_get = {
                url: 'https://www.viamichelin.com/web/Restaurants/Restaurants-New_York-_-New_York-United_States?page=3'
            };
            let response = context_common.http.request_get(request_get);
            parser = new DOMParser();
            xmlDoc = parser.parseFromString(text,"text/xml");
            
        
        return 1;
        */
