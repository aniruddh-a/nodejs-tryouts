/*Require works like import 
Import node modules and custom plugins/modules.
*/
var express = require('express');
var plugins = require('./plugins.js');

/*Declare listen port for server as constant*/
const SERVER_LISTEN_PORT = 3000;

var app = express();

var allowCrossDomain = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');    

    // allow options method  - sent by browser to determine allowed methods for URI
    if ('OPTIONS' == req.method) {
        res.send(200);
    }
    else {
        next();
    }
};

app.use(allowCrossDomain);

app.use(express.bodyParser());


app.get('/calc/:operation', function(req, res){	
	var requestObj = getRequestParams(req);	
	if(plugins.hasOwnProperty(requestObj.operation)) {
		var plugin = require(plugins[requestObj.operation]);
		var result = plugin(requestObj.opr1,requestObj.opr2);		
		if(isNaN(result)){
			res.send(406);			
		}else{
			res.send({operation : requestObj.operation, result : result });
		}		
	}else{
		res.send('OPERATION_NOT_SUPPORTED',404);
	}  
});

function getRequestParams(req){	
	return { operation : req.param('operation'), opr1 : req.param('opr1'), opr2 : req.param('opr2')};
}

app.listen(SERVER_LISTEN_PORT);
console.log("Server listening on port :"+SERVER_LISTEN_PORT);