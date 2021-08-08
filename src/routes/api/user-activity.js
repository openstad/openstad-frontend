const Sequelize = require('sequelize');
const express = require('express');
const createError = require('http-errors');
const config = require('config');
const db = require('../../db');
const auth = require('../../middleware/sequelize-authorization-middleware');
const pagination = require('../../middleware/pagination');
const {Op} = require('sequelize');
const merge = require('merge');

const router = express.Router({mergeParams: true});

router
  .all('*', function (req, res, next) {
    // req.scope = ['includeSite'];
    next();
  });

// list user ideas, arguments, articles, votes
// -------------------------------------------
router.route('/')

// what to include
  .get(function (req, res, next) {
    req.activities = [];
    ['ideas', 'articles', 'arguments', 'votes'].forEach(key => {
      let include = 'include' + key.charAt(0).toUpperCase() + key.slice(1);;
      if (req.query[include]) {
        req.activities.push(key)
      }
    });
    if ( req.activities.length == 0 ) req.activities = ['ideas', 'articles', 'arguments', 'votes', 'sites'];

    if (req.query.includeOtherSites == 'false' || req.query.includeOtherSites == '0') req.query.includeOtherSites = false;
    req.includeOtherSites = typeof req.query.includeOtherSites != 'undefined' ? !!req.query.includeOtherSites : true;
    req.results = {};
    next();
  })

// this user on other sites
  .get(function(req, res, next) {
    req.userIds = [ parseInt(req.params.userId) ];
    if (!req.includeOtherSites) return next();
    return db.User
      .findOne({
        where: {
          id: req.params.userId,
        },
      })
      .then(function (user) {
        if (!user.externalUserId) return next();
        return user
          .getThisUserOnOtherSites()
          .then(users => {
            users.forEach((user) => {
              req.userIds.push(user.id);
            });

            req.users =  users;



            return next()
          })
      });
  })
  // sites
  .get(function(req, res, next) {

    if (!req.activities.includes('sites')) return next();
    return auth.can('Site', 'list')(req, res, next);
  })
  .get(function(req, res, next) {

    if (!req.activities.includes('sites')) return next();
    const siteIds = req.users.map(user => user.siteId);
    let where = { id: siteIds };

    return db.Site
      .findAll({ where })
      .then(function(rows) {
        // sites should only contain non sensitve fields
        // config contains keys, the standard library should prevent this
        // in case a bug makes that fails, we only cherry pick the fields to be sure
        req.results.sites = rows.map(site => {
          return {
            id: site.id,
            domain: site.domain,
            title: site.title,
            createdAt: site.createdAt,
            updatedAt: site.updatedAt,
          }
        });
        return next();
      })
  })
// ideas
  .get(function(req, res, next) {
    if (!req.activities.includes('ideas')) return next();
    return auth.can('Idea', 'list')(req, res, next);
  })
  .get(function(req, res, next) {
    if (!req.activities.includes('ideas')) return next();
    let where = { userId: req.userIds };
    return db.Idea
      .findAll({ where })
      .then(function(rows) {
        req.results.ideas = rows;
        return next();
      })
  })

// articles
  .get(function(req, res, next) {
    if (!req.activities.includes('articles')) return next();
    return auth.can('Article', 'list')(req, res, next);
  })
  .get(function(req, res, next) {
    if (!req.activities.includes('articles')) return next();
    let where = { userId: req.userIds };
    return db.Article
      .findAll({ where })
      .then(function(rows) {
        req.results.articles = rows;
        return next();
      })
  })

// arguments
  .get(function(req, res, next) {
    if (!req.activities.includes('arguments')) return next();
    return auth.can('Argument', 'list')(req, res, next);
  })
  .get(function(req, res, next) {
    if (!req.activities.includes('arguments')) return next();
    let where = { userId: req.userIds };
    return db.Argument
      .findAll({ where })
      .then(function(rows) {
        req.results.arguments = rows;
        return next();
      })
  })

// votes
  .get(function(req, res, next) {
    if (!req.activities.includes('votes')) return next();
    return auth.can('Vote', 'list')(req, res, next);
  })
  .get(function(req, res, next) {
    if (!req.activities.includes('votes')) return next();
    let where = { userId: req.userIds };
    return db.Vote
      .findAll({ where })
      .then(function(rows) {
        req.results.votes = rows;
        return next();
      })
  })

  .get(function (req, res, next) {
    // customized version of auth.useReqUser
    req.activities.forEach(which => {
      req.results[which] && req.results[which].forEach( result => {
        result.auth = result.auth || {};
        result.auth.user = req.user;
      });
    });
    return next();
  })
  .get(function (req, res, next) {
    // console.log({
    //   ideas: req.results.ideas && req.results.ideas.length,
    //   articles: req.results.articles && req.results.articles.length,
    //   arguments: req.results.arguments && req.results.arguments.length,
    //   votes: req.results.votes && req.results.votes.length,
    // });

    res.json(req.results);
  })

module.exports = router;
