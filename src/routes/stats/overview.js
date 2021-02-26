/**
 * Routes for returning statistics in JSON format
 *
 * For performance reasons MySQL queries are used instead of Sequalize
 */
const config = require('config');
const dbConfig = config.get('database');
// get the client
const mysql = require('mysql2/promise');

// get the promise implementation, we will use bluebird
const bluebird = require('bluebird');

const express = require('express');
const createError = require('http-errors')

const router = express.Router({mergeParams: true});

/**
 * Generic function for outputting all statistic queries
 */

// for all get requests
router
    .all('*', function (req, res, next) {
        return next();
    })

router.route('/')

    // count votes
    // -----------
    .get((req, res, next) => {

        let isViewable = req.site && req.site.config && req.site.config.votes && req.site.config.votes.isViewable;
        isViewable = isViewable || (req.user && (req.user.role == 'admin' || req.user.role == 'moderator'))

        if (isViewable) {
            return next();
        } else {
            return next(createError(401, 'Je kunt deze statistieken niet bekijken'));
        }
    })
    .get((req, res, next) => {

        // key: is used in fronted logic, so be careful to change
        // description: describe type of statisic, might be used for displaying, but not for logic, can more easily be changed
        // query, not send to frontend
        // queryVariables
        //  resultType

        // depending on type of query, this will be an array or total key
        // fil
        const queries = [{
            key: 'totalIdeaVotes',

            description: 'Total votes made for ideas',
            sql: "SELECT count(votes.id) AS counted FROM votes LEFT JOIN ideas ON votes.ideaId = ideas.id WHERE votes.deletedAt IS NULL AND ideas.deletedAt IS NULL AND ideas.siteId=?",
            variables: [req.params.siteId],
            resultType: 'array',
            results: [],
        }];

        req.queries = queries;

        next();
    })
    .get(async (req, res, next) => {
        try {
            req.mysqlConnection = await mysql.createConnection({
                host: dbConfig.host,
                user: dbConfig.user,
                password: dbConfig.password,
                database: dbConfig.database,
                Promise: bluebird
            });

            next();
        } catch (e) {
            console.log('Error while initialising SQL connection: ', e);
            return next(createError(401, 'Error while initialising SQL connection: ', e));
        }
    })
    .get(async (req, res, next) => {
        queries = req.queries.map(async (query) => {
            let result, fields;

            try {
                [result, fields] = await req.mysqlConnection.execute(query.sql, query.variables);
            } catch (e) {
                console.log('Error while executing statistic query: ', JSON.stringify(query), ' with error: ', e);
                return next(createError(401, 'Error while executing statistic query: ' + e));
            }

            console.log('fields', fields)
            console.log('result', result)

            return {
                key: query.key,
                description: query.description,
                result: result
            }
        });

        Promise.all(queries)
            .then((result) => {
                console.log('result', result);
                console.log('queries', queries);

                req.stats = result;
                next();
            })
            .catch((e) => {
                next(e);
            })
    })
    .get((req, res, next) => {
        res.json(req.stats);
    });
module.exports = router;
