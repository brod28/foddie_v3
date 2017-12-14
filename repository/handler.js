'use strict';
const review = require('./review.js');

module.exports.hello = (event, context, callback) => {
  console.log("start "+JSON.stringify(event.queryStringParameters));
  review.get_reviews({name:event.queryStringParameters.name});
  const response = {
    statusCode: 200,
    body: JSON.stringify({
      message: 'Done ask reviews',
      input: event,
    }),
  };

  callback(null, response);

  // Use this code if you don't use the http event with the LAMBDA-PROXY integration
  // callback(null, { message: 'Go Serverless v1.0! Your function executed successfully!', event });
};
