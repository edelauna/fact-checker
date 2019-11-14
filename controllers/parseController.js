const factCheckController = require('./factCheckController');
const evalController = require('./evalController');
const regexController = require('./regexController');

const async = require('async');

exports.parseInput = function (input, callback){
  //TODO - update for status updates

  //removing punction for simplicity
  let str = input.data.replace(regexController.puncRemovalRegex(),"");
  console.log(str);

  //extract claims from input
  let regex = regexController.claimRegex();
  let claims = str.match(regex);
  let master = "";
  const SEP = ".";
  
  try {
    claims.forEach(function(e, index){ 
      master += claims[index] + SEP;    
    });
  } catch(error){
    callback("No Claims founds");
  }

  //extracting named entities
  let namedEntities = parseNamedEntities(master);
  if(namedEntities==null){
    callback("No Claims found: Error Code NMS")
  }
  
  //find common words - not case sensitive
  master = master.split(" ").sort();
  let commonWords = master.filter(function(elem, pos) {
    return master.indexOf(elem) === pos && master.lastIndexOf(elem) !== pos;
  });

  //remove named entities and common words from claims
  //touching claims twice...
  claims.forEach(function(e, index){
    claims[index] = removeNamedAndCommon(e, commonWords, namedEntities);
    console.log(`Claim After ${claims[index]}`);
  });

  async.waterfall([
    //factcheck
      factCheckController.factCheckGet(namedEntities, claims),
      evalController.evalFacts
  ], 
  function(err, results){
    if(err){
      console.log('FINAL ERR: ' + err);
      callback(err);
    } else {
      console.log('Parse Completed: ' + results);
      //send response
      callback(null, results);
    }
  });
};

function parseNamedEntities(input){
  let regex = regexController.namedEntities();
  return input.match(regex);
}

function removeNamedAndCommon(input, common, names){
  console.log(`Claim before: ${input}`);
  //removing any claim keywords
  let regexC = regexController.claimsUsed();
  input = input.replace(regexC, "");

  //turns common and names array into a string for regex below
  let master = "";
  let SEP = " ";
  try{
    common.forEach(function(e, index){ 
      master += common[index].trim() + SEP;    
    });
    names.forEach(function(e, index){ 
      master += names[index].trim() + SEP;    
    });
  } catch(error){
    console.log(error);
  }

  //requires spacing between all words (this was done with SEP earlier)
  let regex = regexController.matchWholeWords(master);
  
  return input.replace(regex, "");
}

exports.parseTitles =  function (error, response, body){
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