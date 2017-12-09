'use strict';
const context_common = require('../../helpers/common.js');

const jsonQuery = require('json-query')


module.exports = {
    get_facebook_instagram(metadata) {
        let access_token;
    
        // get token from facebook
        try {
            let request_get = {
                url: 'https://graph.facebook.com/oauth/access_token?client_id=516944261669392&client_secret=b23a21594bdaf96bbe1e2b4b96f744e0&grant_type=client_credentials'
            };
            let response = context_common.http.request_get(request_get);
            access_token = JSON.parse(response).access_token;
        }
        catch (e) {
            console.log("access token failed facebook error " + e.message + e.stack);
            throw e;
        }
    
        let facebook_id;
        // facebook search for  business id
        try {
            facebook_id = search(metadata.name ,metadata,access_token);
        }
        catch (e) {
            try{
                console.log("search failed for "+metadata.name +" facebook error " + e.message);
                let website=metadata.website.split('://')[1].replace('www.','').split('.co')[0];
                facebook_id = search(website ,metadata,access_token);
            }
            catch (ex) {
                console.log("search failed for "+metadata.website+"facebook error " + e.message + e.stack);
                throw ex;
            }
        }
        let facebook_data;
        try {
            let request_get = {
                url: 'https://graph.facebook.com/v2.11/' + facebook_id + '?fields=name,checkins,picture,overall_star_rating,photos,rating_count&access_token=' + access_token
            };
            let response = context_common.http.request_get(request_get);
            facebook_data = JSON.parse(response);
        }
        catch (e) {
            console.log("get info failed facebook error " + e.message + e.stack);
            throw e;
        }

        metadata.facebook_name=facebook_data.name ;
        
        let retval = [];
        retval.push({
            rating: facebook_data.overall_star_rating,
            number_of_reviews: facebook_data.rating_count,
            source: 'facebook',
            facebook_id: facebook_id,
            reviews: [],
            review_article: undefined
        })
        retval.push({
            rating: undefined,
            number_of_reviews: undefined,
            source: 'instagram',
            instagram_id: facebook_id,
            reviews: [],
            review_article: undefined,
            photos: {
                url: 'https://www.instagram.com/explore/locations/' + facebook_id + '/',
                text:'foto by guests on'
            }
        })
        return retval;
    }
    
      
}


let search=(name,metadata,access_token)=>{
    let request_get = {
        url: 'https://graph.facebook.com/search?type=place&q=' + name + '&center=' + metadata.location.lat + ',' + metadata.location.lng + '&distance=200&fields=name,checkins,picture&access_token=' + access_token
    };
    let response = context_common.http.request_get(request_get);
    return JSON.parse(response).data[0].id;
}