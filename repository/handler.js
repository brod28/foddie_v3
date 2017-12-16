'use strict';
const review = require('./review.js');

module.exports.hello = (event, context, callback) => {
  let message;
  console.log("start "+JSON.stringify(event.queryStringParameters));
  try{
    review.get_reviews({name:event.queryStringParameters.name});
    message=event.queryStringParameters.name+' is done';
  }
  catch(err){
    message=event.queryStringParameters.name+ +" "+err
  }
  const response = {
    statusCode: 200,
    body: JSON.stringify({
      message: message,
      awsRequestId:context.awsRequestId,
      logGroupName:context.logGroupName,
      logStreamName:context.logStreamName
    }),
  };

  callback(null, response);

  // Use this code if you don't use the http event with the LAMBDA-PROXY integration
  // callback(null, { message: 'Go Serverless v1.0! Your function executed successfully!', event });
};
