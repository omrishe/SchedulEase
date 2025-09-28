/**
 This code handles AWS Lambda and Express events incompatability.
 aws-serverless-express takes the raw Lambda event (API Gateway request)
 and translates it into a standard Express request/response object.
 This way we can keep using our normal Express routes (app.get, app.post, etc.) without rewriting them for Lambda.
 The handler is what AWS Lambda actually calls.
 Each Lambda event is passed into awsServerlessExpress.proxy(),
 which forwards it to your Express app and returns the response back to API Gateway.
*/
const connectToMongo = require("../database/db");
const serverlessExpress = require("@codegenie/serverless-express");
const app = require("./app");

//instance of the serverless
let serverlessExpressInstance;

//first setup/coldStart when creating a new instance
async function firstSetup(event, context) {
  await connectToMongo();
  serverlessExpressInstance = serverlessExpress({ app });
  return serverlessExpressInstance(event, context);
}

function handler(event, context) {
  //if instance exists returns that instance and setup a new one if it doesnt exists
  return serverlessExpressInstance
    ? serverlessExpressInstance(event, context)
    : firstSetup(event, context);
}

exports.handler = handler;
