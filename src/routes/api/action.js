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
    .get(auth.can('Action', 'list'))
    .get(auth.useReqUser)
    .get(pagination.init)
    .get(function(req, res, next) {
        let { dbQuery } = req;
        dbQuery.where = dbQuery.where ? dbQuery.where : {};

        dbQuery.where.siteId = req.params.siteId;
        
        db.Action
         //   .scope(...req.scope)
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

    // create Action
    // ---------------
    .post(auth.can('Action', 'create'))
    .post(function(req, res, next) {
        const data = req.body;

        data.siteId = req.params.siteId;

        db.Action
            .authorizeData(data, 'create', req.user)
            .create(data)
            .then(result => {
                res.json(result);
            })
            .catch(next);
    })

// with one existing Action
// --------------------------
router.route('/:actionId(\\d+)')
    .all(auth.useReqUser)
    .all(function(req, res, next) {
        const actionId = parseInt(req.params.actionId);
        if (!actionId) next('No action id found');

        db.Action
         //   .scope(...req.scope)
            .findOne({ where: { id: actionId } })
            .then(found => {
                if ( !found ) throw new Error('Action not found');
                req.results = found;
                next();
            })
            .catch(next);
    })

    // view action
    // -------------
    .get(auth.can('Action', 'view'))
    .get(auth.useReqUser)
    .get(function(req, res, next) {
        res.json(req.results);
    })

    // update action
    // ---------------
    .put(auth.useReqUser)
    .put(function(req, res, next) {
        const action = req.results;

        if (!( action && action.can && action.can('update') )) return next( new Error('You cannot update this action') );

        action
            .authorizeData(req.body, 'update')
            .update(req.body)
            .then(result => {
                res.json(result);
            })
            .catch(next);
    })

    // delete action
    // ---------------
  .delete(auth.useReqUser)
  .delete(function(req, res, next) {
    const result = req.results;
    if (!(result && result.can && result.can('delete'))) return next(new Error('You cannot delete this action'));


        req.results
            .destroy()
            .then(() => {
                res.json({ "action": "deleted" });
            })
            .catch(next);
    })

module.exports = router;
