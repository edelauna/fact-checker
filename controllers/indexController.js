//for dev
const indexControllerTest = require('../test/indexControllerTest');


const async = require('async');

const {body, validationResult, sanitizeBody} = require('express-validator');
const parseController = require('./parseController');

exports.index = function(req, res, next) {
  res.render('index', { title: '(Mis)Information'});
};

exports.index_post = [
  //Validate input
  body('input', 'Input must not be empty.').isLength({min:1}).trim(),
  body('input', 'Input is too large. Limit is 6,000 characters.').isLength({max:6000}).trim(),

  //Sanitize fields using wildcard
  sanitizeBody('*').trim(),

  (req, res, next) => {
    //get validation errors from request
    const errors = validationResult(req);

    //Create object
    var input = {
      data: req.body.input
    }
    if(!errors.isEmpty()){
      //render again with sanitized values/error messages
      res.render('response', {title: '(Mis)Information', errors: errors.array(), input: input});
    } else {
      //Data received
      parseController.parseInput(input, onComplete);

      function onComplete(err, response){
        if(err){
          console.log(err);
          response = { claims: 0, confidence: 0};
        }
        res.render('response', {title: '(Mis)Information', input: input, output: response});
      }
      
    }
  }
];

//dev only
exports.index_postTest = indexControllerTest.index_postTest;
