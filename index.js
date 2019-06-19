var request = require('request');
var AWS = require('aws-sdk');
AWS.config.update({
 region: 'us-east-2',
 endpoint: 'http://dynamodb.us-east-2.amazonaws.com',
 accessKeyId: 'AKIAJWGQKF2E3T4WLYKA',
 secretAccessKey: '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'
});

exports.handler = (event, context, callback) => {
 var url = `https://www.omdbapi.com/?t=${event.queryStringParameters.title}&plot=short&apikey=d750b9a1`
 //addToDynamoDB(event.queryStringParameters.title);
 request(url, (err,apiResponse,body)=>{
   if(err){
     throw err
   }
   //this format is EXTREMELY IMPORTANT
   const res = {
     statusCode: 200,
     body: body,
     headers: {
       "Access-Control-Allow-Origin":"*",
       "Content-Type": "application/json"
     }
   };
   callback(null,res)
 });
};

function addToDynamoDB(title){
 var docClient = new AWS.DynamoDB.DocumentClient();
 var params = {
   TableName:"OMDB_Table",
   Item:{
      name: 'Lambda Entry',
      type : 'HTTP',
      title: title,
      timestamp:String(new Date().getTime())
   }
 };

 docClient.put(params, function(err, data) {
   if (err) {
     console.error('Unable to add item. Error JSON:', JSON.stringify(err, null, 2));
   } else {
     console.log("Added item:", JSON.stringify(data, null, 2));
   }
 });
}