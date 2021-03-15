/**
 * Currently there are 2 implementations of search
 * Both are not sufficient.
 * This one only works for ideas properly
 * The other one only works for users, combined with
 *
 * @type {Config}
 */
const config = require('config');
const fuzzysort = require('fuzzysort');

//middleware for adding search to
module.exports = function( req, res, next ) {
    let search = req.query.search;

    // if no search query isset move on
    if (!search) {
        next();
    } else {
        let list = req.results;

        if ( !Array.isArray(search.criteria) ) search.criteria = [ search.criteria ];

        let results = [];
        search.criteria.forEach((criterium) => {

            let key = Object.keys(criterium)[0];
            let value = criterium[key];
            // todo: optional { fields: [], value: '' } construct

            let searchFields;
            switch (key) {

                case 'text':
                    searchFields = ['title', 'summary', 'description', 'niels'];
                case 'title':
                case 'summary':
                case 'description':
                    searchFields = searchFields || [ key ];
                    let searchResult = fuzzysort.go(value, list, {
                        threshold: -300, // todo: volkomen arbitrair; misschien moet je hem kunnen meesturen
                        keys: searchFields,
                    });

                    results.push( searchResult );
                    break;

                default:
            }
        });

        // mergen van de resultaten
        // TODO: dit is heel dom en bot en (dus) traag; denk er eens echt over na
        let merged = [];
        if (results.length == 1) {
            merged = results[0];
        } else {
            if (search.options.andOr == 'and') {

                merged = [];
                for (let i=0; i<results.length; i++) {
                    results[i].map( result => {

                        let foundScore = -10000000000000;
                        for (let j=i+1; j<results.length; j++) {
                            let found = results[j].find( elem => elem.obj.id == result.obj.id );
                            if (found && foundScore) {
                                foundScore = Math.max(foundScore, found.score);
                            } else {
                                foundScore = undefined;
                            }
                        }

                        if (foundScore && foundScore != -10000000000000) {
                            // use highest score
                            result.score = Math.max(result.score, foundScore);
                            let found = merged.find( elem => elem.obj.id == result.obj.id );
                            if (!found) {
                                merged.push(result)
                            }
                        }

                    })
                }
            } else {
                merged = [];
                for (let i=0; i<results.length; i++) {
                    results[i].map( result => {
                        let found = merged.find( elem => elem.obj.id == result.obj.id );
                        if (found) {
                            // use highest score
                            found.score = Math.max(found.score, result.score)
                        } else {
                            merged.push(result)
                        }
                    })
                }
            }

        }

        merged = merged.sort( (a,b) => b.score - a.score )
        merged = merged.map(elem => elem.obj);

        req.results = merged

        return next();
    }

}
