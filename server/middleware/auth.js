const models = require('../models');
const Promise = require('bluebird');
var cookieParser = require('./cookieParser.js');

module.exports.createSession = (req, res, next) => {
  cookieParser(req, res, () => {
    if (Object.keys(req.cookies).length === 0) {
      models.Sessions.create()
        .then( (data) => {
          //get request on data.insertId
          models.Sessions.get({id: data.insertId})
            .then( (data) => {
              req.session = {};
              req.session.hash = data.hash;
              res.cookies['shortlyid'] = data.hash;
              console.log('RES.COOKIES: ', res.cookies);
              next();
            });
        });
    }
  });
};

/************************************************************/
// Add additional authentication middleware functions below
/************************************************************/


//call parser, if !cookieParser, create new cookie via session.create


