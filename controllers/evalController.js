// Idea - remove vowels when evaluating words to allow for mispellings

const util = require('util');
const async = require('async');

const regexController = require('./regexController');
const calcController = require('./calcController');

exports.evalFacts = function evalFacts(data, cb){

  async.waterfall([
    dataLoad(data),
    setErrorMargin,
    setPopulation,
    goalSeekConfidence
  ], 
  function(error, results){
    if(error){
      console.log(error);
      cb(error);
    } else{
      //prepare results
      console.log(`Results: ${JSON.stringify(results)}`);
      let result = {};
      result.claims = results.claimsLength;
      result.confidence = results.confidence;
      result.errorMargin = results.error;
      console.log(`Results: ${JSON.stringify(result)}`);

      cb(null, result);
    }
  })
};

function goalSeekConfidence(data, cb){
  try{
    let step = calcController.SampleSize(data.error, data.confidence, data.response, data.populationSize);
    if(data.confidence == 99){
      console.log("Goal seek Call back called");
      cb(null, data);
    }
    
    else if(step < data.sampleSize){
      let results = data;
      results.confidence += 1;
      goalSeekConfidence(results,cb);
    
      } else {
      console.log("Goal seek Call back called");
      cb(null, data);
    }
  } catch(error){
    console.log(`Error: ${error}`);
    cb(error);
  }
}

function setErrorMargin(data,cb){
  try{
    //set margin of error - possible candidate for randomness (machine learning) play with differant error margins
    //Percentage
    let results = data;
    if(data.claimsLength == 1){
      results.error = 2.00;
    } else if(data.claimsLength <6){
      results.error = 3.00;
    }else if(data.claimsLength <10){
      results.error = 4.00;
    } else {
      results.error = 5.00
    }
    cb(null, results);
  } catch(error){
    cb(error);
  }
}
function setPopulation(data, cb){
  try{
    let regexToRemoveNames = regexController.matchWholeWords(data.names);
    console.log(`Regex To Remove Names: ${regexToRemoveNames}\nTitles length: ${data.titles.length}`);
    let wordCount = 0;
    for(let i = 0; i < data.titles.length; i++){
      //removing named entities in case high popularity could skew numbers
      data.titles[i] = data.titles[i].replace(regexToRemoveNames, "");
      let matches = data.titles[i].match(/\S+/g);
      wordCount += (matches==null) ? 0 : matches.length;
    }
    let results = data
    results.populationSize = wordCount 
    cb(null, results)  
  } catch(error){
    cb(error);
  }
}
function dataLoad(data){
  return function(cb){
    //set response distribution - leaving at 50% - possible candidate for randomness
    const RESPONSEDISTRIBUTION = 50;
    //required for goalseek later on
    const BASECONF = 0;
    try{ 
      const SEP = " ";
      let names = "";
      let titles = []
      let claimCount = 0;
      for(let el of data) {
        names += el.name + SEP;
        for(let claim of el.claims){
          let regexClaim = claim.claim.toUpperCase();
          let regexClaimUpper = regexController.matchWholeWords(regexClaim+SEP);
          for(let title of claim.titles){
            titles.push(title+SEP);
            let pattern = title.toUpperCase().replace(regexController.puncRemovalRegex(),"");
            let matches = (pattern+SEP).match(regexClaimUpper);
            claimCount += (matches==null) ? 0 : matches.length;
          }
        }
      }
      //Transform data
      let results = {
        response: RESPONSEDISTRIBUTION,
        confidence: BASECONF,
        claimsLength: data[0].claims.length,
        names: names,
        titles: titles,
        sampleSize: claimCount
      };
      cb(null,results);
    } catch(error){
      cb(error);
    }
  }
}
