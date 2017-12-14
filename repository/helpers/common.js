'use strict';

module.exports = {
    log:{
        information:function (value) {
            if(process.env.LOG_INFOMAION){
                console.log(value);
            }
          }
        },
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
                    require("./common.js").log.information(req.url +" error is"+error)
                    require("./common.js").log.information(req.url +" response is"+response)
                    require("./common.js").log.information(req.url +" body is"+body)
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
                    require("./common.js").log.information(req.url +" error is"+error)
                    require("./common.js").log.information(req.url +" response is"+response)
                    require("./common.js").log.information(req.url +" body is"+body)
                }
            });
            require('deasync').loopWhile(()=>{
                return source === undefined;
            });
    
            return source;
        }
    }
}