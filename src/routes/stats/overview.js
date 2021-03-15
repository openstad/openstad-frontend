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
 * After SQL query only the missing
 *
 * @param results [{counted: INT, date: DATE}]
 * @returns [{counted: INT, date: DATE}]
 */
const addMissingDays = (results) => {
    // in case results are one or less return the results directly
    if (results.length <= 1) {
        return results;
    }

    // just to be sure, sort the order to DESC by date
    // SQL already should have done this, but this makes it a bit more stable
    results = results.sort((a, b) => {
        return new Date(a.date) - new Date(b.date);
    });


    //get first and last date
    const firstDate = results[0].date;
    const lastDate = results[results.length - 1].date;

    // if for some strange reasons they are not found, send back results
    // might be better to throw an error...
    if (!firstDate || !lastDate) {
        return results
    }


    const newResults = [];

    let start = new Date(firstDate);
    const end = new Date(lastDate);

    // loop through every date from start to end add the data from the query
    while (start <= end) {
        // get date in SQL format by turning it to json and cutting it till the day
        // although often done like this, it's not the prettiest way, might be better to move it to moment.js at some point
        const formattedDate = start.toJSON().slice(0, 10);

        const resultForDate = results.find((result) => {
            return result.date === formattedDate;
        });

        newResults.push({
            date: formattedDate,
            counted: resultForDate && resultForDate.counted ? resultForDate.counted : 0
        })

        // set the next day as the start date so we keep the while going untill the last day
        var newDate = start.setDate(start.getDate() + 1);
        start = new Date(newDate);
    }

    return newResults;
}

/**
 * Generic function for outputting all statistic queries
 */

// for all get requests
router
    .all('*', function (req, res, next) {
        return next();
    });


router.route('/')

    // Check if user is allowed to see the statistics
    // -----------
    .get((req, res, next) => {

       // let isViewable = req.site && req.site.config && req.site.config.votes && req.site.config.votes.isViewable;
        const isViewable = (req.user && (req.user.role == 'admin' || req.user.role == 'moderator' || req.user.role == 'editor'))

        if (isViewable) {
            return next();
        } else {
            return next(createError(401, 'Je kunt deze statistieken niet bekijken'));
        }
    })
    .get((req, res, next) => {

        /**
         * List of queries with their description
         *
         * Results are automatically send to browser as JSON
         * Made for rendering analytics dashboard per site
         *
         * @type [{
         *      variables: [string],
         *      description: string, Describe type of statistics, might be used for displaying, but not for logic, can be changed
         *      key: string, Should be unique
         *      sql: string, Currently frontend assumes key: counted, and key counted & date for graphs.
         *      formatResults: Optional, function, can be used to parse, change results after SQL query is run.
         *      }]
         */

        const queries = [
            {
                key: 'ideaTotal',
                description: 'Amount of ideas',
                sql: "SELECT count(ideas.id) AS counted FROM ideas WHERE ideas.deletedAt IS NULL AND ideas.siteId=?",
                variables: [req.params.siteId],
                resultType: 'count',
                // will be filled after running the query
            },
            {
                key: 'ideasSubmittedPerDay',
                description: 'Ideas submitted per day',
                sql: `SELECT count(ideas.id) AS counted, DATE_FORMAT(ideas.createdAt, '%Y-%m-%d') as date
                    FROM ideas 
                    WHERE ideas.deletedAt IS NULL 
                    AND ideas.deletedAt IS NULL AND ideas.siteId=?
                    GROUP BY date
                    ORDER BY date ASC`,
                variables: [req.params.siteId],
                formatResults: addMissingDays,
            },
            {
                key: 'userVoteTotal',
                description: 'Amount of users that voted',
                sql: "SELECT count(DISTINCT votes.userId) AS counted FROM votes LEFT JOIN ideas ON votes.ideaId = ideas.id WHERE votes.deletedAt IS NULL AND ideas.deletedAt IS NULL AND ideas.siteId=?",
                variables: [req.params.siteId],
                resultType: 'count',
                // will be filled after running the query
            },
            {
                key: 'ideaVotesCountTotal',
                description: 'Amount of votes on ideas',
                sql: "SELECT count(votes.id) AS counted FROM votes LEFT JOIN ideas ON votes.ideaId = ideas.id WHERE votes.deletedAt IS NULL AND ideas.deletedAt IS NULL AND ideas.siteId=?",
                variables: [req.params.siteId],
                resultType: 'count',
            },
            {
                key: 'ideaVotesCountForTotal',
                description: 'Amount of votes for an idea',
                sql: "SELECT count(votes.id) AS counted FROM votes LEFT JOIN ideas ON votes.ideaId = ideas.id WHERE votes.deletedAt IS NULL AND ideas.deletedAt IS NULL AND ideas.siteId=? AND votes.opinion = 'yes'",
                variables: [req.params.siteId],
                resultType: 'count',
            },
            {
                key: 'ideaVotesCountAgainstTotal',
                description: 'Amount of votes against an idea',
                sql: "SELECT count(votes.id) AS counted FROM votes LEFT JOIN ideas ON votes.ideaId = ideas.id WHERE votes.deletedAt IS NULL AND ideas.deletedAt IS NULL AND ideas.siteId=?  AND votes.opinion = 'no'",
                variables: [req.params.siteId],
                resultType: 'count',
            },
            {
                key: 'usersVotedPerDay',
                description: 'Amount of users that voted per day.',
                help: 'This is not the same as total votes per days, since a user can often vote on more then one idea.',
                sql: `SELECT count(DISTINCT votes.userId) AS counted, DATE_FORMAT(votes.createdAt, '%Y-%m-%d') as date
                    FROM votes 
                    LEFT JOIN ideas ON votes.ideaId = ideas.id 
                    WHERE votes.deletedAt IS NULL 
                    AND ideas.deletedAt IS NULL AND ideas.siteId=?
                    GROUP BY date
                    ORDER BY date ASC`,
                variables: [req.params.siteId],
                formatResults: addMissingDays,
            },
            {
                key: 'votesPerDay',
                description: 'Amount of votes per day',
                sql: `SELECT count(votes.id) AS counted, DATE_FORMAT(ideas.createdAt, '%Y-%m-%d') as date
                    FROM votes 
                    LEFT JOIN ideas ON votes.ideaId = ideas.id 
                    WHERE votes.deletedAt IS NULL 
                    AND ideas.deletedAt IS NULL AND ideas.siteId=?
                    GROUP BY date
                    ORDER BY date ASC`,
                variables: [req.params.siteId],
                formatResults: addMissingDays,
            },
            {
                key: 'argumentCountTotal',
                description: 'Amount of arguments, total count',
                sql: "SELECT count(arguments.id) AS counted FROM arguments LEFT JOIN ideas ON ideas.id = arguments.ideaId WHERE arguments.deletedAt IS NULL AND ideas.deletedAt IS NULL AND ideas.siteId=?",
                variables: [req.params.siteId],
            },
            {
                key: 'argumentForCountTotal',
                description: 'Amount of arguments for an idea, total count',
                sql: "SELECT count(arguments.id) AS counted FROM arguments LEFT JOIN ideas ON ideas.id = arguments.ideaId WHERE arguments.deletedAt IS NULL AND ideas.deletedAt IS NULL AND ideas.siteId=? AND arguments.sentiment = 'for'",
                variables: [req.params.siteId],
            },
            {
                key: 'argumentAgainstCountTotal',
                description: 'Amount of arguments against an idea, total count',
                sql: "SELECT count(arguments.id) AS counted FROM arguments LEFT JOIN ideas ON ideas.id = arguments.ideaId WHERE arguments.deletedAt IS NULL AND ideas.deletedAt IS NULL AND ideas.siteId=? AND arguments.sentiment = 'against'",
                variables: [req.params.siteId],
            },
            {
                key: 'choicesguideresultsCountTotal',
                description: 'Amount of choices guide results',
                sql: "SELECT count(choicesGuideResults.id) AS counted FROM choicesGuideResults LEFT JOIN choicesGuides ON choicesGuides.id = choicesGuideResults.choicesGuideId WHERE choicesGuideResults.deletedAt IS NULL AND choicesGuides.deletedAt IS NULL AND choicesGuides.siteId=?",
                variables: [req.params.siteId],
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
            return next(createError(500, 'Error while initialising SQL connection: ', e));
        }
    })
    .get((req, res, next) => {
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
                result: query.formatResults ? query.formatResults(result) : result
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
