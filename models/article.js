//used for loading trianing data into MongoDB

var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var ArticleSchema = new Schema(
  {
    title: {type: Number, unique: true, dropDups: true},
    data: {type: String}
  }
);

module.exports = mongoose.model('Article', ArticleSchema);