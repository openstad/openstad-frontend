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

    // count votes
    // -----------
    .get(function(req, res, next) {

        let isViewable = req.site && req.site.config && req.site.config.votes && req.site.config.votes.isViewable;
        isViewable = isViewable || ( req.user && ( req.user.role == 'admin' || req.user.role == 'moderator' ) )
        if (!isViewable) return next(createError(401, 'Je kunt deze stats niet bekijken'));

        let query = "SELECT count(votes.id) AS counted FROM votes LEFT JOIN ideas ON votes.ideaId = ideas.id WHERE votes.deletedAt IS NULL AND ideas.deletedAt IS NULL AND ideas.siteId=?";
        let bindvars = [req.params.siteId]

        if (req.query.opinion) {
            query += " AND votes.opinion=?"
            bindvars.push(req.query.opinion);
        }

        pool
            .promise()
            .query(query, bindvars)
            .then( ([rows,fields]) => {
                console.log(rows);
                let counted = rows && rows[0] && rows[0].counted || -1;
                res.json({count: counted})
            })
            .catch(err => {
                next(err);
            })

    })


router.route('/no-of-users')

    // count votes
    // -----------
    .get(function(req, res, next) {

        let query = "SELECT count(votes.id) AS counted FROM votes LEFT JOIN ideas ON votes.ideaId = ideas.id WHERE ideas.siteId=? AND votes.deletedAt IS NULL AND ideas.deletedAt IS NULL GROUP BY votes.userId";
        let bindvars = [req.params.siteId]

        pool
            .promise()
            .query(query, bindvars)
            .then( ([rows,fields]) => {
                console.log(rows);
                let counted = rows && rows.length || -1;
                res.json({count: counted})
            })
            .catch(err => {
                next(err);
            })

    })

module.exports = router;
