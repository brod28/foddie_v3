'use strict';


const express = require('express');
const bodyParser = require('body-parser');

const DAL = require('./repository/DAL/DAL.js');
const repositor_review = require('./repository/review.js');
const repositor_location = require('./repository/location.js');
const context_common = require('./repository/helpers/common.js');
const restService = express();
require('dotenv').config()

restService.use(bodyParser.json());

// use res.render to load up an ejs view file


restService.use('/static', express.static('assets'))

restService.get('/api/check_image', function (req, res) {

    let Tesseract = require('tesseract.js')
    /*
     Tesseract.recognize('assets/image-text1.jpg')
         .then(function (result) {
             console.log(result)
         })
         .catch(function (e) {
             console.log(e)
         })
    */

    Tesseract.recognize("assets/image-text1.jpg", {
        lang: 'eng',
        tessedit_char_blacklist: 'e'
    })
        .progress(function (message) {
            console.log(message)
        })
        .then(function (result) {
            console.log(result)
        })
        .catch(function (e) {
            console.log(e)
        });
});


restService.get('/api/ext_config', function (req, res) {
    let retVal = [{
        type: "include",
        pattern: 'restaurant',
        text: 'Check It'
    }];

    res.json({ data: retVal });
});
restService.get('/api/search', function (req, res) {
    console.log("request search with for " + req.param('name'))
    let request = {
        name: req.param('name'),

    };
    let retVal = repositor_location.search(request);
    res.json({ data: retVal });
});

restService.get('/api/tracker', function (req, res) {
    console.log("request tracker with for " + req.param('places'))
    console.log("request tracker with for " + req.param('location'))
    console.log("request tracker with for " + req.param('refer'))
    console.log("request tracker with for " + req.param('source'))
    let referurl = req.param('refer');

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
    let places_raw = req.param('places');
    let places = req.param('places').split('||');
    places.forEach((element, index) => {
        if (element && element != "" && element.length < 35) {
            places[index] = element.replace(/^([" "]?)+([0-9]{1,5})+([" "]?)+([.]{0,1})+([" "]?)/i, "");
        }
    });
    let source = req.param('source');
    let path;
    if (req.param('path') != "") {
        path = req.param('path');
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
        element = element.replace(/^([" "]?)+([0-9]{1,5})+([" "]?)+([.]{0,1})+([" "]?)/i, "");
        if (location && location != "") {
            element = element + " , " + location
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
    res.json({ data: "ok" });
});



restService.get('/api/reviews', function (req, res) {
    console.log("request review with for " + req.param('name'))
    let myFirstPromise = new Promise((resolve, reject) => {
        console.log("start promise request review with for " + req.param('name'))
        setTimeout(function () {
            console.log("start after time out request review with for " + req.param('name'))
            let request = {
                name: req.param('name')
            };
            repositor_review.get_reviews(request);
            resolve("Success!"); // Yay! Everything went well!
            console.log("end promise request review with for " + req.param('name'))
        }, 250);
    });

    myFirstPromise.then((successMessage) => {
        // successMessage is whatever we passed in the resolve(...) function above.
        // It doesn't have to be a string, but if it is only a succeed message, it probably will be.
        console.log("finalize promise request review with for " + req.param('name'))
    });

    // console.log("request review end with " + JSON.stringify(retVal))
    res.json({ result: "ok" });
});

restService.get('/api/ping_reviews', function (req, res) {
    context_common.log.information("ping_reviews " + req.param('name'))
    let request = {
        name: req.param('name')
    };
    let retVal = repositor_review.get_cache_reviews(request);

    if (retVal) {
        res.json(retVal);
    }
    else {
        res.status(204).send("doesn't have the data yet");
    }
});

const path = require('path');
// Serve static files from the React app
restService.use(express.static(path.join(__dirname, 'client/build')));


// The "catchall" handler: for any request that doesn't
// match one above, send back React's index.html file.
restService.get('*', (req, res) => {
    context_common.log.information("index page ")
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE'); // If needed
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,contenttype'); // If needed
    res.sendFile(path.join(__dirname + '/client/build/index.html'));
});


/* */
restService.listen((process.env.PORT || 5000), function () {
    console.log("Server listening");
    var env = process.env.NODE_ENV || 'dev';
    if (env == 'dev') {
        // if dev envierment call to the test method
        /*        const https = require('https');
                https.get('http//127.0.0.1:5000/hook', (resp) => {        
                }).on("error", (err) => {
                    console.log("Error: " + err.message);
                });        */
    }
});

