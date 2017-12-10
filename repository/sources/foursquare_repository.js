'use strict';
const context_common = require('../../helpers/common.js');

const jsonQuery = require('json-query')


module.exports = {
    get_foursquare(metadata) {
        let json;
        let request = require('request');
        let foursquare_id;
        try{
            json=getId(metadata,request,metadata.name);
            foursquare_id=json.response.venues[0].id
            console.log("finished foursquare id for "+metadata.name+" "+e.message)
        }
        catch(e){
            try{
                console.log("failed foursquare id for "+metadata.name+" "+e.message)
                json=getId(metadata,request,metadata.facebook_name);
                foursquare_id=json.response.venues[0].id
                console.log("finished with facebook for foursquare id for "+metadata.name+" "+e.message)
            }
            catch(ex){
                console.log("failed foursquare id for "+metadata.website+" "+ex.message+ex.stack)
                throw ex;                
            }                
        }
        
        let json_photos;
        let json_tips;
        request({
            url: 'https://api.foursquare.com/v2/venues/' + foursquare_id + '/photos',
            method: 'GET',
            qs: {
                v: '20170801',
                client_id: 'A32K1QWL1TY4TTFSSQHQHSGWC0LC3QY5MGLDT5ZYFHPWFIDT',
                client_secret: '5HKEFHMEXLRDORXJ0AJEI31UZURUQN3ADTXREZE3FIH13MLT',
                group: "venue",
                limit: 8
            }
        }, function (err, res, body) {
            if (err) {
                console.log('failed foursquare photos ' + err);
            } else {
                json_photos = JSON.parse(body);
            }
        });

        request({
            url: 'https://api.foursquare.com/v2/venues/' + foursquare_id + '/tips',
            method: 'GET',
            qs: {
                v: '20170801',
                client_id: 'A32K1QWL1TY4TTFSSQHQHSGWC0LC3QY5MGLDT5ZYFHPWFIDT',
                client_secret: '5HKEFHMEXLRDORXJ0AJEI31UZURUQN3ADTXREZE3FIH13MLT',
                group: "venue",
                limit: 9
            }
        }, function (err, res, body) {
            if (err) {
                console.log('failed foursquare tips ' + err);
            } else {
                json_tips = JSON.parse(body);
            }
        });

        console.log('detais foursquare is going to wait');
        
        require('deasync').loopWhile(()=>{
            return !json_photos || !json_tips;
        });

        console.log('detais foursquare finished');
        
        let retval = []
        try {
            let menu_url;
            try {
                menu_url = json.response.venues[0].menu.mobileUrl;
            }
            catch (e) {
                try {
                    menu_url = json.response.venues[0].menu.url;
                }
                catch (e) {
                    try {
                        menu_url = json.response.venues[0].menu.externalUrl;
                    }
                    catch (e) {
                        console.log("failed to get menu from foursquare for "+metadata.name)
                    }
                }
            }
            if (menu_url) {
                retval.push({
                    rating: 'N/A',
                    number_of_reviews: 'N/A',
                    source: 'foursquare',
                    foursquare_id: foursquare_id,
                    menu: {
                        url: menu_url
                    }
                });
            }
        }
        catch (e) {
            console.log("failed parse menu foursquare" + e.message + e.stack)
        }


        try {
            let photos = [];
            json_photos.response.photos.items.forEach((photo) => {
                photos.push({
                    url: photo.prefix + 'height250' + photo.suffix
                });
            })

            retval.push({
                rating: 'N/A',
                number_of_reviews: 'N/A',
                source: 'foursquare',
                foursquare_id: foursquare_id,
                photos: {
                    photos: photos
                }
            });
        }
        catch (e) {
            console.log("failed parse photos foursquare" + e.message + e.stack)
        }


        try {
            let reviews = [];
            let reviews_counter = 0;
            json_tips.response.tips.items.slice(5).forEach((tip) => {
                if (tip.photo && reviews_counter < 6) {
                    reviews_counter++;
                    let review = {
                        time: tip.createdAt,
                        text: tip.text,
                        photo_url: tip.photo ? tip.photo.prefix + 'height250' + tip.photo.suffix : undefined
                    };
                    reviews.push(review);
                }
            })
            if(reviews.length>0){
                retval.push({
                    rating: 'N/A',
                    number_of_reviews: 'N/A',
                    source: 'foursquare',
                    foursquare_id: foursquare_id,
                    reviews: reviews
                });
            }

        }
        catch (e) {
            console.log("failed parse reviews foursquare" + e.message + e.stack)
        }

        try {
            if (json.response.venues[0].contact) {
                metadata.contant = json.response.venues[0].contact;
                if (json.response.venues[0].contact.instagram) {
                    retval.push({
                        rating: undefined,
                        number_of_reviews: undefined,
                        source: 'instagram',
                        instagram_id: json.response.venues[0].contact.instagram,
                        reviews: [],
                        review_article: undefined,
                        photos: {
                            url: 'https://www.instagram.com/' + json.response.venues[0].contact.instagram + '/?hl=en',
                            text: 'foto by owners on '
                        }
                    });
                }
            }
            else {
                console.log("failed to get contacts names of business from foursquare")
            }


        }
        catch (e) {
            console.log("failed to get contacts names of business from foursquare" + e.message + e.stack)
        }



        return retval;
    }


}

let getId=(metadata,request,name)=>{
    let json;
    request({
        url: 'https://api.foursquare.com/v2/venues/search',
        method: 'GET',
        qs: {
            client_id: 'A32K1QWL1TY4TTFSSQHQHSGWC0LC3QY5MGLDT5ZYFHPWFIDT',
            client_secret: '5HKEFHMEXLRDORXJ0AJEI31UZURUQN3ADTXREZE3FIH13MLT',
            ll: metadata.location.lat + ',' + metadata.location.lng,
            query: name,
            v: '20170801',
            radius: '200'
        }
    }, function (err, res, body) {
        if (err) {
            console.log('failed foursquare search' + err);
        } else {
            json = JSON.parse(body);
        }
    });
    require('deasync').loopWhile(()=>{
        return !json;
    });
    

    return json;

}