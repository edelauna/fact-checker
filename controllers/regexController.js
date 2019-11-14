exports.matchWholeWords = function matchWholeWords(input){
  let splitRegex = /[^\s]+/g;
  return new RegExp("\\b(" + input.match(splitRegex).join("|") + ")\\s", "gm");
};

exports.namedEntities = function namedEntities(){
  return new RegExp(/(?<!^)(?<!([!?\.]))([A-Z]\w{2,}\s?)+/g);
}

exports.claimRegex = function(){
  let regex = claimsUsed();
  //ver 2 - requires that all punction is removed before hand
  return new RegExp("(\\w+\\s){1,10}"+regex.source+"(\\s\\w+){1,10}","gm");
};

function claimsUsed(){
  //look for sentences with when, which, who, whose, whom, what, whatever, where, how
  //decided to remove has
  return new RegExp(/\b([Ww](h(en|ich|o(se|m)?|at(ever)?|ere))|[Hh]ow)\b/gm);
};
exports.claimsUsed = claimsUsed;

exports.puncRemovalRegex = function(){
  return new RegExp(/[^\w\s]|[\n]/gm);
}