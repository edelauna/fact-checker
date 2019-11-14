const fs = require("fs");

const evalController = require('../controllers/evalController');

console.log("\n *STARTING* \n");

let contents = fs.readFileSync("../../logs/data.json");

let jsonContent = JSON.parse(contents);

console.log(jsonContent);

evalController.evalFacts(jsonContent, cb);

function cb(err, results){
  console.log("\n *END* \n");
}
