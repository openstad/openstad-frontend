const config    = require('config');
const dbConfig  = config.get('database');
const mysql = require('mysql2');
const express = require('express');
const createError = require('http-errors')

const pool = mysql.createPool({
  host: dbConfig.host,
  user: dbConfig.user,
  password: dbConfig.password,
  database: dbConfig.database,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

let router = express.Router({mergeParams: true});

// for all get requests
router
	.all('*', function(req, res, next) {
    return next();
	})

router.route('/total')

// count arguments
// ---------------
	.get(function(req, res, next) {

    let ideaId = req.query.ideaId;
    let sentiment = req.query.sentiment;

    let query = `SELECT count(arguments.id) AS counted FROM ideas LEFT JOIN arguments ON arguments.ideaId = ideas.id `;
    let bindvars = []
    if (sentiment) {
      query += `AND arguments.sentiment = ? `;
      bindvars.push(sentiment);
    }
    query += "WHERE ideas.deletedAt IS NULL AND ideas.siteId = ? ";
    bindvars.push(req.params.siteId);
    if (ideaId) {
      query += "AND ideas.id = ? ";
      bindvars.push(ideaId);
    }

    pool
      .promise()
      .query(query, bindvars)
      .then( ([rows,fields]) => {
        let counted = rows && rows[0] && rows[0].counted || -1;
        res.json({count: counted})
      })
      .catch(err => {
        next(err);
      })

  })

module.exports = router;
