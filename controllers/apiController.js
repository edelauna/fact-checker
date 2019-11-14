const Article = require('../models/article');

exports.apiQueryController = function (req, res){
  try{
    //Init
    let titles = req.query.q.split(' ');
    let result = [];
    for(let i = 0; i < titles.length; i++){
      result[i] = {id: titles[i], content: ''};
    }

    //Callback once all data is grabbed
    function callback(data){
      res.json(data);
    }
    const START = 0;
    findTitles(result, START, callback)

  } catch (e){
    console.log(e);
    res.send("Error occured, query could not be parsed");
  }
};

function findTitles(result, index, cb){
  if(index>=result.length){
    cb(result);
  } else{
    Article.find({title: result[index].id}).lean().exec(function(err, doc){
      if(err) {
        console.log(`Error finding: ${err}`);
      } else if(doc!='') {
        result[index].content = doc[0].data;  
      }
      index++;
      findTitles(result, index, cb);
    })
  }
}