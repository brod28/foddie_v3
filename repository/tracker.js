const context_common = require('./helpers/common.js');
const DAL = require('./DAL/DAL.js');

module.exports = {
    TrackArticle(req) {
        let referurl = req.refer;

        let cities = ["london", "losangeles", "newyork", "paris", "moscow", "telaviv"];

        let location;
        cities.forEach(element => {
            let cityurl = context_common.helper.replaceAll(referurl, "-", "").toLowerCase();
            if (cityurl.includes(element)) {
                location = element;
            }
        })

        let tags = [];
        if (location) {
            tags.push(location);
        }

        try {
            let url_parts = referurl.split("/");
            url_parts.forEach((element, index) => {
                if (index > 2) {
                    if (element) {
                        element.split("-").forEach(element1 => {
                            element1.split("+").forEach(element2 => {
                                element2.split("=").forEach(element3 => {
                                    element3.split("&").forEach(element4 => {
                                        element4.split("_").forEach(element5 => {
                                            tags.push(element5);
                                        })
                                    })
                                })
                            })
                        })
                    }
                }
            })
        }
        catch (err) {
            console.log("tags does find for " + referurl);
        }
        let places_raw = req.places;
        let places = req.places.split('||');
        places.forEach((element, index) => {
            if (element && element != "" && element.length < 35) {
                places[index] = element.replace(/^([" "]?)+([0-9]{1,5})+([" "]?)+([.]{0,1})+([" "]?)/i, "");
                if( location && location!=''){
                    places[index]=places[index]+" , " + location
                }
            }
        });
        let source = req.source;
        let path;
        if (req.path != "") {
            path = req.path;
        }
        let article = {
            ref_url: referurl,
            places: places,
            tags: tags,
            location: location,
            source: source,
            places_raw: places_raw,
            version: "v2"
        }
        article = JSON.parse(context_common.helper.replaceAll(JSON.stringify(article), '""', '" "'));
        DAL.AddArticle(article);
        places.forEach(element => {
            if (location && location != "") {
                element = element 
            }
            let request = require('request');
            console.log('traker : ' + 'https://foodieforfoodie.herokuapp.com/api/ping_reviews?name=' + element);
            request({
                url: 'https://fwwzrx3aa2.execute-api.us-east-1.amazonaws.com/prod/my-service-dev-getdata?name=' + element,
                method: 'GET'
            }, function (err, res, body) {
                console.log('traker ' + element + " for " + body);
                if (err && err != null) {
                    console.log('traker ' + element + " for " + err);
                }
            });
        })
    }
}