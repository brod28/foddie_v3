'use strict';
const review = require('./review.js');
const DAL = require('./DAL/DAL');

module.exports.hello = (event, context, callback) => {
  let message;
  console.log("start hello" + JSON.stringify(event.queryStringParameters));
  try {
    review.get_reviews({ name: event.queryStringParameters.name });
    message = event.queryStringParameters.name + ' is done';
  }
  catch (err) {
    message = event.queryStringParameters.name + +" " + err
  }
  const response = {
    statusCode: 200,
    body: JSON.stringify({
      message: message,
      awsRequestId: context.awsRequestId,
      logGroupName: context.logGroupName,
      logStreamName: context.logStreamName
    }),
  };

  callback(null, response);

  // Use this code if you don't use the http event with the LAMBDA-PROXY integration
  // callback(null, { message: 'Go Serverless v1.0! Your function executed successfully!', event });
};

module.exports.mapArticlePerPlace = (event, context, callback) => {
  let message;
  let counter = 0;
  try {
    console.log("start mapArticlePerPlace number of records " + event.Records);
    event.Records.forEach(data => {
      console.log("mapArticlePerPlace for" + JSON.stringify(data));
      if (data.eventName == "INSERT") {
        let data = event.Records[0]
        if (data.dynamodb.NewImage.places.L && data.dynamodb.NewImage.tags.L) {
          data.dynamodb.NewImage.places.L.forEach(place => {
            if (place.S && place.S != " ") {
              let tags = [];
              data.dynamodb.NewImage.tags.L.forEach(tag => {
                if (tag.S && tag.S != " ") {
                  tags.push(tag.S);
                }
              })
              let articlePerPlace = {
                ref_url: data.dynamodb.Keys.ref_url.S,
                place: place.S,
                tag: tags
              }
              counter++;
              DAL.AddArticlePerPlace(articlePerPlace);
            }
          })
        }
      }
    });
  }

  catch (err) {
    console.log(err)
    throw err;
  }
  const response = {
    statusCode: 200,
    body: JSON.stringify({
      message: `for ${event.Records[0].dynamodb.Keys.ref_url.S} added ${counter} rows`,
      awsRequestId: context.awsRequestId,
      logGroupName: context.logGroupName,
      logStreamName: context.logStreamName
    }),
  };

  callback(null, response);

  // Use this code if you don't use the http event with the LAMBDA-PROXY integration
  // callback(null, { message: 'Go Serverless v1.0! Your function executed successfully!', event });
};
