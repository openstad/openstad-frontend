var fs      = require('fs');
var jsdom   = require('jsdom');
var util    = require('./');

var FractalFactory = require('../../lib/fractal/dist/fractal');
var cache = {};

module.exports = {
	getTemplate: function( viewName ) {
		return new Promise(function( resolve, reject ) {
			var cachedTpl = _getCachedTemplate(viewName);
			if( cachedTpl ) {
				resolve(Object.create(cachedTpl));
			} else {
				_cacheTemplate(viewName, function( cachedTpl ) {
					resolve(Object.create(cachedTpl));
				});
			}
		});
	}
}

function _cacheTemplate( viewName, resolve ) {
	var paths = _getTemplatePaths(viewName);
	
	jsdom.env({
		html: fs.readFileSync(paths.html, 'utf-8'),
		done: function( err, window ) {
			var document = window.document;
			var Fractal  = FractalFactory(window);
			
			Fractal.View.mixin(['variables']);
			Fractal.scan(document.body);
			
			Fractal.give = function() {
				var outerHTML = document.documentElement.outerHTML;
				var output = '<!DOCTYPE html>' + outerHTML.replace(/<template.*?<\/template>/g, '');
				this.empty();
				return output;
			};
			
			require(paths.view)(Fractal);
			cache[viewName] = {
				mtime    : fs.statSync(paths.html).mtime,
				template : Fractal
			};
			
			resolve(Fractal);
		}
	});
}
function _getCachedTemplate( viewName ) {
	var paths     = _getTemplatePaths(viewName);
	var cachedTpl = cache[viewName];
	var stat      = fs.statSync(paths.html);
	
	if( cachedTpl && stat.mtime == cachedTpl.mtime ) {
		return cachedTpl.template;
	} else {
		return null;
	}
}

function _getTemplatePaths( viewName ) {
	return {
		html: util.relativePath('../../html/'+viewName+'.html'),
		view: util.relativePath('../views/'+viewName)
	}
}