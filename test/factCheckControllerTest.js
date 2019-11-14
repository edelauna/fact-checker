const fs = require('fs');
const util = require('util');

const request = require('request');


const SUBSCRIPTION_KEY = '31c82762c9194fd49db49b83863493a1';
if (!SUBSCRIPTION_KEY) {
  throw new Error('AZURE_SUBSCRIPTION_KEY is not set.')
}
let errors = [];

console.log("\n *STARTING* \n");

let contents = fs.readFileSync("../../logs/data.json");

let jsonContent = JSON.parse(contents);

let claim = jsonContent[0].claims[0].claim;
let name = jsonContent[0].name;

let searchTerms = `${name} ${claim}`;
bingWebSearch(searchTerms);

function bingWebSearch(query) {
  const options = {
    url: `https://api.cognitive.microsoft.com/bing/v7.0/search?q=${encodeURIComponent(query)}`,
    headers:  { 'Ocp-Apim-Subscription-Key': SUBSCRIPTION_KEY }
  };
  request(options, callback);
}

function callback(error, response, body){
  let parsedData = [];
  let claimsProcessed = 0;
  if(!error){
    let data = JSON.parse(body);
    data.webPages.value.forEach((e, i, a) =>{
      claimsProcessed++;
      parsedData.push(e.name);
      if(claimsProcessed == a.length){
        cb(parsedData);
      }
    });
  } else {
    console.log(error);
  }
}
function cb(data){
  console.log(`Done with following; ${data}`);
}