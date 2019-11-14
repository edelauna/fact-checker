const request = require('request');

//for debug
const util = require('util');
const fs = require("fs");

exports.factCheckGet = function factCheckGet(names, claims){
  return function (cb) {
    let errors = [];
    let nameTitleData = [];
    let namesProcessed = 0;
    for(let name of names){
      let awaitReqs = new Promise(function(resolve, reject){
        getNameClaims(name, claims, claimsCB);
        function claimsCB(err, data){
          if(err){
            reject(err);
          } else {
            namesProcessed++;
            resolve(data);
          }      
        }
      }); 
      awaitReqs.then(function(data){
        nameTitleData.push({name: name, claims : data});
        if(namesProcessed == names.length){
          
          //required for debug
          fs.writeFile('../logs/data.json', JSON.stringify(nameTitleData), (err) =>{
            if(err) console.log(err);
            console.log('Success- Log');
          });
          
          cb(null, nameTitleData);
        }
      }, error => {
        errors.push(error);
        if(namesProcessed == names.length){
          cb(errors);
        }  
      }); 
    }
  }
}

//need to add error handling
function getNameClaims(name, claims, cb){
  //gets results of fact checking
  let parsedData = [];
  let titles = [];
  let claimsProcessed = 0;
  for(let j = 0; j < claims.length; j ++){
    let query = `${name} ${claims[j]}`;
    
    //limit to 3 per second
    setTimeout(function(){
      bingQuery(query, claimsCB);
    },350);
    
    function claimsCB(error, data){ 
      claimsProcessed++;
      titles = data;
      parsedData.push({claim: claims[j], titles: titles});
      if(claimsProcessed == claims.length){
        if(!error){
          console.log(`Inside Claim: ${claims[j]} done`);
          cb(null, parsedData);
        } else{
          console.log(util.inspect(error))
          cb("FactChecking could not finish")
        }
      }
    }
  }   
}

function bingQuery(query, cb){
  console.log(`Query String: ${query}`);
  const SUBSCRIPTION_KEY = '31c82762c9194fd49db49b83863493a1';
  //this actually makes a huge differance!
  const mkt = "en-CA";
  const options = {
    url: `https://api.cognitive.microsoft.com/bing/v7.0/search?q=${encodeURIComponent(query)}&mkt=${mkt}`,
    headers:  { 'Ocp-Apim-Subscription-Key': SUBSCRIPTION_KEY }
  };
  try{
    //does this crach cuz too many requests?
    request(options, callback);
  } catch(err){
    console.log(`Error making request: ${err}`);
  }
  
  function callback(error, response, body){
    if(!error){
      try{
        if(response.statusCode!==200){
          console.log(`Inside request: ${response.statusCode}`);
          setTimeout(function(){
            bingQuery(query, cb);
          },350);
        } else {
          let data = JSON.parse(body);
          //console.log(data.webPages.value);
          let titleCount = 0;
          let titles = [];
          data.webPages.value.forEach((e, i, a) =>{
            titles.push(e.snippet);
            titleCount++;
            if(titleCount == a.length){
              console.log('Inside Titles done');
              cb(null, titles)
            }
          });
  
        }
      } catch(err){
        console.log(`No search results: ${JSON.stringify(err)}`);
      }
    } else {
      console.log(`Errors connecting: ${error}`)
    }
  }
}