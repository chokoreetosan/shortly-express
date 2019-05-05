const models = require('../models');
const Promise = require('bluebird');

module.exports.createSession = (req, res, next) => {
  Promise.resolve(req.cookies.shortlyid)
    .then((hash) => {
      if (!hash) {
        // make session in catch
        throw hash;
      }
      return models.Sessions.get({hash});
    }).tap((session) =>{
      //if !exists => make a new session
      if(!session){
        throw session;
      }
    }). catch(() => {
      // make session from throw errors above
      return models.Sessions.create()
        .then(results => {
          return models.Sessions.get({id: results.insertId});
        })
        .tap(session=>{
          res.cookie('shortlyid', session.hash);
        })
    })
    .then((session) => {
      req.session = session;
      next();
    })
};

/************************************************************/
// Add additional authentication middleware functions below
/************************************************************/

