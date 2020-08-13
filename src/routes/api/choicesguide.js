const express = require('express');
const createError = require('http-errors');
const db = require('../../db');
const auth= require('../../middleware/sequelize-authorization-middleware');

// TODO: deze is nog niet verbouwd naar het nieuwe auth model, met name de json opbouw niet

const router = express.Router({ mergeParams: true });

// scopes: for all get requests
router
  .all('*', function(req, res, next) {

    req.scope = [{ method: ['forSiteId', req.site.id] }];

    if (req.query.includeChoices) {
      req.scope.push('includeChoices');
    }

    if (req.query.includeQuestionGroups) {
      req.scope.push('includeQuestionGroups');
    }

    if (req.query.includeQuestions) { // implies includeQuestionGroups
      req.scope.push('includeQuestions');
    }

    return next();
  });

// ================================================================================
// choicesguides
// ================================================================================

router.route('/$')

// list choiceguides
// -----------------
  .get(auth.can('ChoicesGuide', 'list'))
	.get(auth.useReqUser)
  .get(function(req, res, next) {
    let where = {};
    db.ChoicesGuide
      .scope(...req.scope)
      .findAll({ where })
      .then( (found) => {
        return found.map( (entry) => {
          let json = {
            id: entry.id,
            siteId: entry.siteId,
            title: entry.title,
            description: entry.description,
            images: entry.images,
          };
          return json;
        });
      })
      .then(function( found ) {
        res.json(found);
      })
      .catch(next);
  })

// create choicesguide
// -------------------
  .post(auth.can('ChoicesGuide', 'create'))
	.post(auth.useReqUser)
  .post(function(req, res, next) {
    if (!req.site) return next(createError(404, 'Site niet gevonden'));
    return next();
  })
  .post(function( req, res, next ) {
    let data = {
      siteId: req.site.id,
      title: req.body.title,
      description: req.body.description,
      images: req.body.images,
    };
    db.ChoicesGuide
			.authorizeData(data, 'create', req.user)
      .create(data)
      .then((result) => {
        res.json(result);
      })
      .catch(next);
  });

// one choicesguide
// ----------------
router.route('/:choicesGuideId(\\d+)$')
  .all(auth.can('ChoicesGuide', 'view'))
	.all(auth.useReqUser)
  .all(function(req, res, next) {
    let choicesGuideId = parseInt(req.params.choicesGuideId);
    if (!choicesGuideId) throw createError(404, 'choicesGuide not found');
    db.ChoicesGuide
      .scope(...req.scope)
      .findOne({
        where: { id: choicesGuideId, siteId: req.site.id }
      })
      .then((found) => {
        if ( !found ) throw createError(404, 'choicesGuide not found');
        req.choicesguide = found;
        next();
      })
      .catch(next);
  })
  .get(function(req, res, next) {
    // parse
    let json = {
      id: req.choicesguide.id,
      siteId: req.choicesguide.siteId,
      title: req.choicesguide.title,
      description: req.choicesguide.description,
      images: req.choicesguide.images,
    };

    if (req.choicesguide.choicesGuideChoices) {
      json.choices = [];
      req.choicesguide.choicesGuideChoices.sort((a,b) => a.seqnr > b.seqnr).forEach((choice) => {
        json.choices.push({
          id: choice.id,
          choicesGuideId: choice.choicesGuideId,
          title: choice.title,
          description: choice.description,
          images: req.choice.images,
          answers: choice.answers,
          seqnr: choice.seqnr,
        });
      });
    }

    if (req.choicesguide.choicesGuideQuestionGroups) {
      json.questiongroups = [];
      req.choicesguide.choicesGuideQuestionGroups.sort((a,b) => a.seqnr > b.seqnr).forEach((group) => {
        let choices;
        if (group.choicesGuideChoices) {
          choices = [];
          group.choicesGuideChoices.sort((a,b) => a.seqnr > b.seqnr).forEach((choice) => {
            choices.push({
              id: choice.id,
              choicesGuideId: choice.choicesGuideId,
              title: choice.title,
              description: choice.description,
              images: choice.images,
              answers: choice.answers,
              seqnr: choice.seqnr,
            });
          });
        }
        let questions;
        if (group.choicesGuideQuestions) {
          questions = [];
          group.choicesGuideQuestions.sort((a,b) => a.seqnr > b.seqnr).forEach((question) => {
            questions.push({
              id: question.id,
              questionGroupId: question.questionGroupId,
              title: question.title,
              description: question.description,
              images: question.images,
              type: question.type,
              values: question.values,
              minLabel: question.minLabel,
              maxLabel: question.maxLabel,
              seqnr: question.seqnr,
            });
          });
        }
        json.questiongroups.push({
          id: group.id,
          choicesGuideId: group.choicesGuideId,
          answerDimensions: group.answerDimensions,
          title: group.title,
          description: group.description,
          images: group.images,
          questions: questions,
          choices: choices,
          seqnr: group.seqnr,
        });
      });
    }

    return res.json(json);

  })

// update choicesguide
// -------------------
	.put(auth.useReqUser)
  .put(function(req, res, next) {
    let data = {
      title: req.body.title,
      description: req.body.description,
      images: req.body.images,
      seqnr: req.body.seqnr,
    };
    if (!( req.choicesguide && req.choicesguide.can && req.choicesguide.can('update', req.user) )) return next( new Error('You cannot update this ChoicesGuide') );
    req.choicesguide
			.authorizeData(data, 'update', req.user)
      .update(data)
      .then((result) => {
        res.json(result);
      })
      .catch(next);
  })

// delete choicesguide
// -------------------
  .delete(auth.can('ChoicesGuide', 'delete'))
  .delete(function(req, res, next) {
    req.choicesguide
      .destroy()
      .then(() => {
        res.json({ choicesguide: 'deleted' });
      })
      .catch(next);
  });

// ================================================================================
// choiceguide choices
// ================================================================================

router.route('/:choicesGuideId(\\d+)(/questiongroup/:questionGroupId(\\d+))?/choice$')
  .all(function(req, res, next) {

    req.scope = [{ method: ['forSiteId', req.site.id] }];

    if (0) {
      req.scope.push();
    }

    return next();
  })
  .all(function(req, res, next) {
    let choicesGuideId = parseInt(req.params.choicesGuideId);
    if (!choicesGuideId) throw createError(404, 'choicesGuide not found');
    db.ChoicesGuide
      .scope(...req.scope)
      .findOne({
        where: { id: choicesGuideId, siteId: req.site.id }
      })
      .then((found) => {
        if ( !found ) throw createError(404, 'choicesGuide not found');
        req.choicesguide = found;
        next();
      })
      .catch(next);
  })

// create choicesguidechoice
// --------------------------------
  .post(auth.can('ChoicesGuideChoice', 'create'))
	.post(auth.useReqUser)
  .post(function( req, res, next ) {
    let data = {
      title: req.body.title,
      description: req.body.description,
      images: req.body.images,
      answers: req.body.answers,
      seqnr: req.body.seqnr,
    };
    let questionGroupId = parseInt(req.params.questionGroupId);
    if (questionGroupId) {
      data.questionGroupId = questionGroupId;
    } else {
      data.choicesGuideId = req.choicesguide.id;
    }
    db.ChoicesGuideChoice
			.authorizeData(data, 'create', req.user)
      .create(data)
      .then((result) => {
        res.json(result);
      })
      .catch(next);
  });

// with one choicesguidechoice
// ----------------------------------
router.route('/:choicesGuideId(\\d+)(/questiongroup/:questionGroupId(\\d+))?/choice/:choiceId(\\d+)$')
  .all(function(req, res, next) {
    let choicesGuideId = parseInt(req.params.choicesGuideId);
    let questionGroupId = parseInt(req.params.questionGroupId);
    if (!choicesGuideId && !questionGroupId) throw createError(404, 'choicesGuide or choicesGuideQuestionGroup not found');
    let choiceId = parseInt(req.params.choiceId);
    if (!choiceId) throw createError(404, 'choice not found');
    let where = { id: choiceId };
    if (questionGroupId) {
      where.questionGroupId = questionGroupId;
    } else {
      where.choicesGuideId = choicesGuideId;
    }
    db.ChoicesGuideChoice
      .scope(...req.scope)
      .findOne({
        where: where
      })
      .then((found) => {
        if ( !found ) throw createError(404, 'choice not found');
        req.choice = found;
        next();
      })
      .catch(next);
  })

// update choicesguidechoice
// --------------------------------
	.put(auth.useReqUser)
 .put(function(req, res, next) {
    if (!( req.choice && req.choice.can && req.choice.can('update', req.user) )) return next( new Error('You cannot update this Choice') );
    let data = {
      title: req.body.title,
      description: req.body.description,
      images: req.body.images,
      answers: req.body.answers,
      seqnr: req.body.seqnr,
    };
    req.choice
			.authorizeData(req.body, 'update', req.user)
      .update(data)
      .then((result) => {
        res.json(result);
      })
      .catch(next);
  })

// delete choicesguidechoice
// --------------------------------
  .delete(auth.can('ChoicesGuideChoice', 'delete'))
  .delete(function(req, res, next) {
    req.choice
      .destroy()
      .then(() => {
        res.json({ choice: 'deleted' });
      })
      .catch(next);
  });

// ================================================================================
// choiceguide question groups
// ================================================================================

router.route('/:choicesGuideId(\\d+)/questiongroup$')
  .all(function(req, res, next) {

    req.scope = [{ method: ['forSiteId', req.site.id] }];

    if (0) {
      req.scope.push();
    }

    return next();
  })
  .all(function(req, res, next) {
    let choicesGuideId = parseInt(req.params.choicesGuideId);
    if (!choicesGuideId) throw createError(404, 'choicesGuide not found');
    db.ChoicesGuide
      .scope(...req.scope)
      .findOne({
        where: { id: choicesGuideId, siteId: req.site.id }
      })
      .then((found) => {
        if ( !found ) throw createError(404, 'choicesGuide not found');
        req.choicesguide = found;
        next();
      })
      .catch(next);
  })

// create choicesguidequestiongroup
// --------------------------------
  .post(auth.can('ChoicesGuideQuestionGroup', 'create'))
	.post(auth.useReqUser)
  .post(function( req, res, next ) {
    let data = {
      choicesGuideId: req.choicesguide.id,
      answerDimensions: req.body.answerDimensions,
      title: req.body.title,
      description: req.body.description,
      images: req.body.images,
      seqnr: req.body.seqnr,
    };
    db.ChoicesGuideQuestionGroup
			.authorizeData(data, 'create', req.user)
      .create(data)
      .then((result) => {
        res.json(result);
      })
      .catch(next);
  });

// with one choicesguidequestiongroup
// ----------------------------------
router.route('/:choicesGuideId(\\d+)/questiongroup/:questionGroupId(\\d+)$')
  .all(function(req, res, next) {
    let choicesGuideId = parseInt(req.params.choicesGuideId);
    if (!choicesGuideId) throw createError(404, 'choicesGuide not found');
    let questionGroupId = parseInt(req.params.questionGroupId);
    if (!questionGroupId) throw createError(404, 'questionGroup not found');
    db.ChoicesGuideQuestionGroup
      .scope(...req.scope)
      .findOne({
        where: { id: questionGroupId, choicesGuideId: choicesGuideId }
      })
      .then((found) => {
        if ( !found ) throw createError(404, 'choicesGuide not found');
        req.questiongroup = found;
        next();
      })
      .catch(next);
  })

// update choicesguidequestiongroup
// --------------------------------
	.all(auth.useReqUser)
  .put(function(req, res, next) {
    if (!( req.questiongroup && req.questiongroup.can && req.questiongroup.can('update', req.user) )) return next( new Error('You cannot update this Question') );
    let data = {
      answerDimensions: req.body.answerDimensions,
      title: req.body.title,
      description: req.body.description,
      images: req.body.images,
      seqnr: req.body.seqnr,
    };
    req.questiongroup
			.authorizeData(data, 'update')
      .update(data)
      .then((result) => {
        res.json(result);
      })
      .catch(next);
  })

// delete choicesguidequestiongroup
// --------------------------------
  .delete(auth.can('ChoicesGuideQuestionGroup', 'delete'))
  .delete(function(req, res, next) {
    req.questiongroup
      .destroy()
      .then(() => {
        res.json({ questiongroup: 'deleted' });
      })
      .catch(next);
  });


// ================================================================================
// choiceguide questions
// ================================================================================

// TODO: haal de group op, al was het maar wegens beveiliging
// TODO: missende velden

router.route('/:choicesGuideId(\\d+)/questiongroup/:questionGroupId(\\d+)/question$')
  .all(function(req, res, next) {

    req.scope = [{ method: ['forSiteId', req.site.id] }];

    if (0) {
      req.scope.push();
    }

    return next();
  })
  .all(function(req, res, next) {
    let choicesGuideId = parseInt(req.params.choicesGuideId);
    if (!choicesGuideId) throw createError(404, 'choicesGuide not found');
    db.ChoicesGuide
      .scope(...req.scope)
      .findOne({
        where: { id: choicesGuideId, siteId: req.site.id }
      })
      .then((found) => {
        if ( !found ) throw createError(404, 'choicesGuide not found');
        req.choicesguide = found;
        next();
      })
      .catch(next);
  })
  .all(function(req, res, next) {
    let choicesGuideId = parseInt(req.params.choicesGuideId);
    if (!choicesGuideId) throw createError(404, 'choicesGuide not found');
    let questionGroupId = parseInt(req.params.questionGroupId);
    if (!questionGroupId) throw createError(404, 'questionGroup not found');
    db.ChoicesGuideQuestionGroup
      .scope(...req.scope)
      .findOne({
        where: { id: questionGroupId, choicesGuideId: choicesGuideId }
      })
      .then((found) => {
        if ( !found ) throw createError(404, 'questionGroup not found');
        req.questiongroup = found;
        next();
      })
      .catch(next);
  })

// create choicesguidequestion
// --------------------------------
  .post(auth.can('ChoicesGuideQuestion', 'create'))
	.post(auth.useReqUser)
  .post(function( req, res, next ) {
    let data = {
      questionGroupId: req.questiongroup.id,
      title: req.body.title,
      description: req.body.description,
      images: req.body.images,
      type: req.body.type,
      values: req.body.values,
      minLabel: req.body.minLabel,
      maxLabel: req.body.maxLabel,
      seqnr: req.body.seqnr,
    };
    db.ChoicesGuideQuestion
			.authorizeData(data, 'create', req.user)
      .create(data)
      .then((result) => {
        res.json(result);
      })
      .catch(next);
  });

// with one choicesguidequestion
// ----------------------------------
router.route('/:choicesGuideId(\\d+)/questiongroup/:questionGroupId(\\d+)/question/:questionId(\\d+)$')
  .all(function(req, res, next) {
    let questionGroupId = parseInt(req.params.questionGroupId);
    if (!questionGroupId) throw createError(404, 'questionGroup not found');
    let questionId = parseInt(req.params.questionId);
    if (!questionId) throw createError(404, 'question not found');
    db.ChoicesGuideQuestion
      .scope(...req.scope)
      .findOne({
        where: { id: questionId, questionGroupId: questionGroupId }
      })
      .then((found) => {
        if ( !found ) throw createError(404, 'question not found');
        req.question = found;
        next();
      })
      .catch(next);
  })

// update choicesguidequestion
// --------------------------------
	.post(auth.useReqUser)
  .put(function(req, res, next) {
    if (!( req.question && req.question.can && req.question.can('update', req.user) )) return next( new Error('You cannot update this Question') );
    let data = {
      title: req.body.title,
      description: req.body.description,
      images: req.body.images,
      type: req.body.type,
      values: req.body.values,
      minLabel: req.body.minLabel,
      maxLabel: req.body.maxLabel,
      seqnr: req.body.seqnr,
    };
    req.question
			.authorizeData(data, 'update', req.user)
      .update(data)
      .then((result) => {
        res.json(result);
      })
      .catch(next);
  })

// delete choicesguidequestion
// --------------------------------
  .delete(auth.can('ChoicesGuideQuestion', 'delete'))
  .delete(function(req, res, next) {
    req.question
      .destroy()
      .then(() => {
        res.json({ question: 'deleted' });
      })
      .catch(next);
  });

// ================================================================================
// choicesguide results
// ================================================================================

router.route('/:choicesGuideId(\\d+)(/questiongroup/:questionGroupId(\\d+))?/result$')
  .all(function(req, res, next) {

    req.scope = [{ method: ['forSiteId', req.site.id] }];

    if (0) {
      req.scope.push();
    }

    return next();
  })
  .all(function(req, res, next) {
    let choicesGuideId = parseInt(req.params.choicesGuideId);
    if (!choicesGuideId) throw createError(404, 'choicesGuide not found');
    next();
  })

// create choicesguideresult
// --------------------------------
  .post(auth.can('ChoicesGuideResult', 'create'))
	.post(auth.useReqUser)
  .post(function( req, res, next ) {
    let choicesGuideId = parseInt(req.params.choicesGuideId);
    if (!choicesGuideId) throw createError(404, 'choicesGuide not found');

    let data = {
      choicesGuideId,
      userId: req.body.userId,
      extraData: req.body.extraData,
      userFingerprint: req.body.userFingerprint,
      result: req.body.result,
    };

    db.ChoicesGuideResult
			.authorizeData(data, 'create', req.user)
      .create(data)
      .then((result) => {
        res.json(result);
      })
      .catch(next);
  });


module.exports = router;
