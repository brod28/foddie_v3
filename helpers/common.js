'use strict';

module.exports = {
    helper:{
        isFloat:function (value) {
            return !isNaN(value) && 
                   parseFloat(Number(value)) == value && 
                   !isNaN(parseFloat(value, 10));
          }
    },
    http:{
        request_get(req){
            var source;
            let request = require('request');
            request({ 
                url:req.url,
                headers: req.headers
            }, function (error, response, body) {
                source = body;
                if(error==undefined || body=='' || response.statusCode!=200){
//                    console.log(error);
  //                  console.log(response);
    //                console.log(body);
                }
            });
            require('deasync').loopWhile(()=>{
                return source === undefined;
            });
    
            
            return source;
        },
        request_post(req){
            var source;
            let request = require('request');
            request.post({ 
                headers: req.headers,
                url:req.url,
                body:req.params
            }, function (error, response, body) {
                source = body;
                if(error==undefined || body=='' || response.statusCode!=200){
                 //   console.log(error);
                   // console.log(response);
                    //console.log(body);
                }
            });
            require('deasync').loopWhile(()=>{
                return source === undefined;
            });
    
            return source;
        }
    }
}