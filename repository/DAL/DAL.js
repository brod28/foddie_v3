
module.exports = {
    AddArticle(article){
        addModel={
            validation:article && article.ref_url,
            obj:article,
            TableName:'Articles'
        }
        Add(addModel)
    },
    AddPlace(place){
        addModel={
            validation:place && place.place_full_name,
            obj:place,
            TableName:'Places'  
        }
        Add(addModel)
    },
    GetPlace(placeName){
        getModel={
            Key:{"place_full_name":placeName},
            TableName:'Places'
             
        }
        let retVal=Get(getModel);
        if(retVal){
            retVal=retVal.reviews
        }
        return retVal;
    },
    GetPlacesByLocation(locationName){
        getModel={
            TableName:"Articles",
            IndexName:"location-index",
            KeyConditionExpression:'#location=:locationName',
            ExpressionAttributeNames:{
                '#location':'location'
            },
            ExpressionAttributeValues: {
              ':locationName': locationName
            }        
        }
        let retVal=Get(getModel);
        return retVal;
    }
}

const GetDocClient=()=>{
    let AWS = require("aws-sdk");
    
    
    AWS.config.update({
      region: "us-east-1",
      accessKeyId: process.env.AWSACCESSKEYID,
      secretAccessKey: process.env.AWSSECRETACCESSKEY
    });    
    let docClient = new AWS.DynamoDB.DocumentClient();
    return docClient;
}
const Add=(model)=>{
    if(!model.validation){
        model.validation=true;
    }
    if(model.validation){
        let params = {
            TableName: model.TableName,
            Item: model.obj
        };
        var docClient = GetDocClient();
        docClient.put(params, function(err, data) {
           if (err) {
               console.error(model.TableName+" Add . Error JSON:", JSON.stringify(err, null, 2));
           } else {
               console.log(model.TableName+" Add succeeded");
           }
        });
    }
    else{
        console.error(model.TableName+" Add not valid :"+JSON.stringify(model.obj, null, 2));
    }
}
const Get=(model)=>{
    let retVal;
    let wait=true;
    let callback=(data)=>{
        retVal=data;
        wait=false;
    };
    let docClient=GetDocClient();
    let params = {
        TableName: model.TableName,
    }
    if(!model.IndexName){
        params.Key=model.Key;        
        docClient.get(params, function(err, data) {
            if (err) {
                console.error("Unable to read item. Error JSON:", JSON.stringify(err, null, 2));
            }
            if(data.Item){
                callback(data.Item);
            }
            else if(data.Items){
                callback(data.Items);
            }
            else{
                callback(undefined);
            }
        });    
    }
    else{
        params.IndexName=model.IndexName;
        params.KeyConditionExpression=model.KeyConditionExpression;
        params.ExpressionAttributeNames=model.ExpressionAttributeNames;
        params.ExpressionAttributeValues=model.ExpressionAttributeValues;
        params.Key=undefined;
        docClient.query(params, function(err, data) {
            if (err) {
                console.error("Unable to read item. Error JSON:", JSON.stringify(err, null, 2));
            }
            if(data.Item){
                callback(data.Item);
            }
            else if(data.Items){
                callback(data.Items);
            }
            else{
                callback(undefined);
            }
        });    
    }

    require('deasync').loopWhile(()=>{
        return wait;
    });
    return retVal;
}

/*

var dynamodb = new AWS.DynamoDB();

var params = {
    TableName : "Articles",
    KeySchema: [       
        { AttributeName: "ref_url", KeyType: "HASH"},  //Partition key
        { AttributeName: "place_full_name", KeyType: "RANGE" }  //Sort key
    ],
    AttributeDefinitions: [       
        { AttributeName: "ref_url", AttributeType: "S" },
        { AttributeName: "place_full_name", AttributeType: "S" }
    ],
    ProvisionedThroughput: {       
        ReadCapacityUnits: 5, 
        WriteCapacityUnits: 5
    }
};

dynamodb.createTable(params, function(err, data) {
    if (err) {
        console.error("Unable to create table. Error JSON:", JSON.stringify(err, null, 2));
    } else {
        console.log("Created table. Table description JSON:", JSON.stringify(data, null, 2));
    }
});*/