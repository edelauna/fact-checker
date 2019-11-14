
exports.index_postTest = function(req, res, next) {
  let input = { data: "input"};
  let err = null;
  let response = { claims: 3, confidence: 43, errorMargin: 2};
  res.render('response', { title: 'Test', input: input, errors: err, output: response});
};