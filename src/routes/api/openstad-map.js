const Promise = require('bluebird');
const express = require('express');
const db      = require('../../db');
const auth    = require('../../middleware/sequelize-authorization-middleware');
const config  = require('config');

let router = express.Router({mergeParams: true});

// scopes: for all get requests
router
	.all('*', function(req, res, next) {
		req.scope = ['api'];
		req.scope.push('mapMarkers');
		req.scope.push('selectRunning');
		req.scope.push({ method: ['sort', 'createdate_desc']});
		next();
	})

router.route('/idea-marker')

// list ideas as map markers
// -------------------------
	.get(auth.can('Idea', 'list'))
	.get(function(req, res, next) {

		db.Idea
			.scope(...req.scope)
			.findAll({ where: { siteId: req.params.siteId } })
			.then( found => {
				let maxMarkers = ( req.site && req.site.config.openStadMap && req.site.config.openStadMap.maxMarkers ) || ( config.openStadMap && config.openStadMap.maxMarkers ) || 20;
				if (found.length > maxMarkers) found = found.slice(0, maxMarkers)
				return found.map( entry => createMarker(entry) );
			})
			.then(function( found ) {
				res.json(found);
			})
			.catch(next);
	})

// one idea as map marker
// ----------------------
router.route('/idea-marker/:ideaId(\\d+)')

	.all(function(req, res, next) {
		var ideaId = parseInt(req.params.ideaId) || 1;
		
		db.Idea
			.scope(...req.scope)
			.findOne({
				where: { id: ideaId, siteId: req.params.siteId }
			})
			.then(found => {
				if ( !found ) throw new Error('Idea not found');
				req.idea = found;
				next();
			})
			.catch(next);
	})

// view idea
// ---------
	.get(auth.can('Idea', 'view'))
	.get(function(req, res, next) {
		res.json(createMarker(req.idea));
	})

// polygon

router.route('/polygon')

// the polygon as defined for this site
// ------------------------------------
	.get(auth.can('Idea', 'list'))
	.get(function(req, res, next) {

		// use from site config
		let polygon = req.site && req.site.config.openStadMap && req.site.config.openStadMap.polygon;

		// fallback to generic config 
		polygon = polygon || ( config.openStadMap && config.openStadMap.polygons && ( ( config.openStadMap.usePolygon && config.openStadMap.polygons[config.openStadMap.usePolygon] ) || ( config.siteId && config.openStadMap.polygons[config.siteId] ) ) );
		
		res.json(polygon || null);

	})


// helper functions
// ----------------

function createMarker(idea) {
	return {
		id: idea.id,
		location: idea.location,
		position: idea.position,
		icon     : {
			url    : idea.status == 'DONE' || idea.status == 'ACCEPTED' || idea.status == 'BUSY' ? '/img/idea/flag-blue.svg' : ( idea.status == 'CLOSED' || idea.status == 'DENIED' ? '/img/idea/flag-gray.svg' : '/img/idea/flag-red.svg' ),
			size   : [22, 24],
			anchor : [ 4, 21],
		},
		href: `/plan/${idea.id}`,
		status: idea.status,
		endDate: idea.endDate,
	}

}

module.exports = router;
