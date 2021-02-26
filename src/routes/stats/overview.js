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

    // Check if user is allowed to see the statistics
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

    //    const dateWhere = "";


        // key: is used in fronted logic, so be careful to change
        // description: describe type of statisic, might be used for displaying, but not for logic, can more easily be changed
        // query, not send to frontend
        // queryVariables
        //  resultType
        const queries = [{
            key: 'ideaVotesCountForTotal',
            description: 'Votes on ideas, total count',
            sql: "SELECT count(votes.id) AS counted FROM votes LEFT JOIN ideas ON votes.ideaId = ideas.id WHERE votes.deletedAt IS NULL AND ideas.deletedAt IS NULL AND ideas.siteId=?",
            variables: [req.params.siteId],
            resultType: 'count',
            // will be filled after running the query
            results: [],
        },
        {
            key: 'ideaVotesCountForTotal',
            description: 'Votes for ideas, total count',
            sql: "SELECT count(votes.id) AS counted FROM votes LEFT JOIN ideas ON votes.ideaId = ideas.id WHERE votes.deletedAt IS NULL AND ideas.deletedAt IS NULL AND ideas.siteId=? AND votes.opinion = 'yes'",
            variables: [req.params.siteId],
            resultType: 'count',
            // will be filled after running the query
            results: [],
        },
        {
            key: 'ideaVotesCountAgainstTotal',
            description: 'Votes againts ideas, total count',
            sql: "SELECT count(votes.id) AS counted FROM votes LEFT JOIN ideas ON votes.ideaId = ideas.id WHERE votes.deletedAt IS NULL AND ideas.deletedAt IS NULL AND ideas.siteId=?  AND votes.opinion = 'no'",
            variables: [req.params.siteId],
            resultType: 'count',
            // will be filled after running the query
            results: [],
        },
        {
            key: 'usersVotedPerDay',
            description: 'Amount of users that voted per day. ',
            help: 'This is not the same as total votes per days, since a user can often vote on more then one idea.',
            sql: "SELECT count(votes.id) AS counted FROM votes LEFT JOIN ideas ON votes.ideaId = ideas.id WHERE votes.deletedAt IS NULL AND ideas.deletedAt IS NULL AND ideas.siteId=?",
            variables: [req.params.siteId],
            resultType: 'count',
            // will be filled after running the query
            results: [],
        },
        {
            key: 'argumentCountTotal',
            description: 'Amount of arguments, total count',
            sql: "SELECT count(arguments.id) AS counted FROM arguments LEFT JOIN ideas ON ideas.id = arguments.ideaId LEFT JOIN sites ON sites.id = ideas.siteId WHERE arguments.deletedAt IS NULL AND ideas.deletedAt IS NULL AND ideas.siteId=?",
            variables: [req.params.siteId],
            resultType: 'count',
            // will be filled after running the query
            results: [],
        },
        {
            key: 'argumentForCountTotal',
            description: 'Amount of arguments for an idea, total count',
            sql: "SELECT count(arguments.id) AS counted FROM arguments LEFT JOIN ideas ON ideas.id = arguments.ideaId LEFT JOIN sites ON sites.id = ideas.siteId WHERE arguments.deletedAt IS NULL AND ideas.deletedAt IS NULL AND ideas.siteId=? AND arguments.sentiment = 'for'",
            variables: [req.params.siteId],
            resultType: 'count',
            // will be filled after running the query
            results: [],
        },
        {
            key: 'argumentAgainstCountTotal',
            description: 'Amount of arguments against an idea, total count',
            sql: "SELECT count(arguments.id) AS counted FROM arguments LEFT JOIN ideas ON ideas.id = arguments.ideaId LEFT JOIN sites ON sites.id = ideas.siteId WHERE arguments.deletedAt IS NULL AND ideas.deletedAt IS NULL AND ideas.siteId=? AND arguments.sentiment = 'against'",
            variables: [req.params.siteId],
            resultType: 'count',
            // will be filled after running the query
            results: [],
        },

        ];

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

    .get( (req, res, next) => {
        queries = req.queries.map(async (query) => {
            let result, fields;

            try {
                [result, fields] = await req.mysqlConnection.execute(query.sql, query.variables);
            } catch (e) {
                console.log('Error while executing statistic query: ', JSON.stringify(query), ' with error: ', e);
                return next(createError(401, 'Error while executing statistic query: ' + e));
            }

            return {
                key: query.key,
                description: query.description,
                result: result
            }
        });

        Promise.all(queries)
            .then((result) => {
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
