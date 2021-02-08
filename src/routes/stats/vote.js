/**
 * Routes for returning statistics in JSON format
 *
 * For performance reasons MySQL queries are used instead of Sequalize
 */
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

const router = express.Router({mergeParams: true});

/**
 * Generic function for outputting all statistic queries
 */
const runQuery = (req, res, next) => {
  pool
    .promise()
    .query(counted, bindvars)
    .then( ([rows,fields]) => {
      req.rows = rows;
    })
    .catch(err => {
      next(err);
    })
}

// for all get requests
router
	.all('*', function(req, res, next) {
    return next();
	})

/**
 * Return vote info per day for a time period
 *
 * Get Param: ?startDate=2020-01-01
 * Get Param: ?endDate=2020-01-31
 */
router.route('/')
// count votes
// -----------
	.get((req, res, next) => {
    // Get dates, if no time period is set assume last week, start date week ago, end date today
    // format date to myqsl datetime format: 2020-01-31 00:00:00
    const startDate = req.query.startDate ? req.query.startDate : ...weekago;
    const endDate = req.query.endDate ? req.query.endDate : ...today;

    // format list of all dates, mysql will only return date for which votes are made
    req.dates = ...

    req.sqlQuery =  "SELECT count(votes.id) AS counted, formatDay(votes.createdAt) as votedOnDate FROM votes LEFT JOIN ideas ON votes.ideaId = ideas.id WHERE ideas.siteId=? AND votes.deletedAt IS NULL AND ideas.deletedAt IS NULL GROUP BY votedOnDate";
    req.sqlQueryVariables = [startDate, endDAta]
  })
  .get(runQuery)
  .get((req, res, next) => {

    // format rows to days
    const dates = req.dates.map((date) => {
      // find row for date
      const dateRow = req.rows.find(row => votedOnDate === date);

      return {
        date: date,
        // if row is empty no votes are found for that date
        votes: dateRow ? dateRow.counted : 0
      };
    });

    // note: total is for specified time
    // see total route for counter with all total votes
    res.json({
      total:
      dates: {

      }
    })
  });



router.route('/total')

// count votes
// -----------
	.get((req, res, next) => {

    let isViewable = req.site && req.site.config && req.site.config.votes && req.site.config.votes.isViewable;
    isViewable = isViewable || ( req.user && ( req.user.role == 'admin' || req.user.role == 'moderator' ) )
    if (!isViewable) return next(createError(401, 'Je kunt deze stats niet bekijken'));

    let query = "SELECT count(votes.id) AS counted FROM votes LEFT JOIN ideas ON votes.ideaId = ideas.id WHERE votes.deletedAt IS NULL AND ideas.deletedAt IS NULL AND ideas.siteId=?";
    let bindvars = [req.params.siteId]

    if (req.query.opinion) {
      query += " AND votes.opinion=?"
      bindvars.push(req.query.opinion);
    }

    req.sqlQuery = query;
    req.sqlQueryVariables = bindvars;
  })
  .get(runQuery)
  .get((req, res, next) => {
    let counted = req.rows && req.rows[0] && req.rows[0].counted || -1;
    res.json( {count: counted})
  });

router.route('/no-of-users')
// count votes
// -----------
	.get(function(req, res, next) {
    req.sqlQuery = "SELECT count(votes.id) AS counted FROM votes LEFT JOIN ideas ON votes.ideaId = ideas.id WHERE ideas.siteId=? AND votes.deletedAt IS NULL AND ideas.deletedAt IS NULL GROUP BY votes.userId";
    req.sqlQueryVariables = [req.params.siteId];
   })
  .get(runQuery)
  .get((req, res, next) => {
    let counted = req.rows && req.rows.length || -1;
    res.json({count: counted})
  });


module.exports = router;
