const axios = require('axios')
const process = require('process')

const apiBase = process.env.apibase
const apikey = process.env.apikey
const origin = process.env.origin

/**
 *
 * Event doc: https://docs.aws.amazon.com/apigateway/latest/developerguide/set-up-lambda-proxy-integrations.html#api-gateway-simple-proxy-for-lambda-input-format
 * @param {Object} event - API Gateway Lambda Proxy Input Format
 *
 * Return doc: https://docs.aws.amazon.com/apigateway/latest/developerguide/set-up-lambda-proxy-integrations.html
 * @returns {Object} object - API Gateway Lambda Proxy Output Format
 * 
 */
exports.lambdaHandler = async (event, context) => {
    try {               

      let params = {
        "apikey": apikey
      }
      for (let param in event.queryStringParameters) {
        params[param] = event.queryStringParameters[param]
      }

      const res = await axios({
        url: event.pathParameters.proxy,
        method: event.httpMethod,
        baseURL: apiBase,
        params: params
      })
      return {
        'statusCode': res.data.message.header.status_code,
        'headers': {
          "Access-Control-Allow-Origin" : origin
        },
        'body': JSON.stringify(res.data.message.body)
      }

    } catch (err) {
      console.log(err);
      return {
        statusCode: 400,
        body: JSON.stringify(err)
      }
    }

};