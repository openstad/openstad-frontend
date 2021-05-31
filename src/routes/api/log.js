const Promise = require('bluebird');
const express = require('express');
const db      = require('../../db');
const auth = require('../../middleware/sequelize-authorization-middleware');
const pagination = require('../../middleware/pagination');

let router = express.Router({mergeParams: true});

router
    .all('*', function(req, res, next) {
        req.scope = [];
        req.scope.push('includeSite');
        next();
    });

router.route('/')

    // list Actions
    // --------------
    .get(auth.can('Log', 'list'))
    .get(auth.useReqUser)
    .get(pagination.init)
    .get(function(req, res, next) {
        let { dbQuery } = req;

        req.scope.push({method: ['forSiteId', req.params.siteId]});

        db.Log
            .scope(...req.scope)
            .findAndCountAll(dbQuery)
            .then(result => {
                req.results = result.rows;
                req.dbQuery.count = result.count;
                next();
            })
            .catch(next);
    })
    .get(auth.useReqUser)
    .get(pagination.paginateResults)
    .get(function(req, res, next) {
        res.json(req.results);
    })

    // create Log
    // ---------------
    .post(auth.can('Log', 'create'))
    .post(function(req, res, next) {
        const data = {
            name   : req.body.name,
            siteId : req.params.siteId,
        };

        db.Log
            .authorizeData(data, 'create', req.user)
            .create(data)
            .then(result => {
                res.json(result);
            })
            .catch(next);
    })

// with one existing Log
// --------------------------
router.route('/:logId(\\d+)')
    .all(auth.useReqUser)
    .all(function(req, res, next) {
        const logId = parseInt(req.params.logId);
        if (!logId) next('No log id found');

        req.scope = ['defaultScope'];
        req.scope.push({method: ['forSiteId', req.params.siteId]});

        db.Log
            .scope(...req.scope)
            .findOne({ where: { id: logId } })
            .then(found => {
                if ( !found ) throw new Error('Log not found');
                req.results = found;
                next();
            })
            .catch(next);
    })

    // view log
    // -------------
    .get(auth.can('Log', 'view'))
    .get(auth.useReqUser)
    .get(function(req, res, next) {
        res.json(req.results);
    })

    // update log
    // ---------------
    .put(auth.useReqUser)
    .put(function(req, res, next) {
        const log = req.results;
        if (!( log && log.can && log.can('update') )) return next( new Error('You cannot update this log') );
        log
            .authorizeData(req.body, 'update')
            .update(req.body)
            .then(result => {
                res.json(result);
            })
            .catch(next);
    })

    // delete log
    // ---------------
    .delete(auth.can('Log', 'delete'))
    .delete(function(req, res, next) {
        req.results
            .destroy()
            .then(() => {
                res.json({ "log": "deleted" });
            })
            .catch(next);
    })

module.exports = router;
