const models = require('../models');
var cookieParser = require('./cookieParser.js');

module.exports.createSession = (req, res, next = () => {}) => {
  req.session = {};
  cookieParser(req, res, () => {
    // if no cookie, create session and add cookie to response, sesssion to req
    if (Object.keys(req.cookies).length === 0) {
      models.Sessions.create()
        .then( (data) => {
          models.Sessions.get({id: data.insertId})
            .then( (data) => {
              req.session.hash = data.hash;
              res.cookies = res.cookies || {};
              res.cookies['shortlyid'] = {value: data.hash};
              next();
            });
        });
    } else { // if cookie, get session info associated with it
      models.Sessions.get({hash: req.cookies.shortlyid})
        .then( (results) => {
          if (results) { // if valid cookie, add info to req session
            req.session.hash = results.hash;
            if (results.userId) { // if user info associated with hash, add user info
              req.session.userId = results.userId;
              req.session.user = results.user;
            }
            next();
          } else { // if invalid cookie, create new session and replace old cookie
            models.Sessions.create()
              .then( (data) => {
                models.Sessions.get({id: data.insertId})
                  .then( (data) => {
                    req.session.hash = data.hash;
                    res.cookies['shortlyid'] = {value: data.hash};
                    next();
                  });
              });
          }
        });
    }
  });
};

/************************************************************/
// Add additional authentication middleware functions below
/************************************************************/

