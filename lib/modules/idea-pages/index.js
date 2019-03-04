// `apostrophe-pieces-pages` implements "index pages" that display pieces of a
// particular type in a paginated, filterable way. It's great for implementing
// blogs, event listings, project listings, staff directories... almost any
// content type.
//
// You will `extend` this module in new modules corresponding to your modules
// that extend `apostrophe-pieces`.
//
// To learn more and see complete examples, see:
//
// [Reusable content with pieces](../../tutorials/getting-started/reusable-content-with-pieces.html)
//
// ## Options
//
// ### `piecesFilters`
//
// If present, this is an array of objects with `name` properties. The named cursor filters are
// marked as `safeFor: "public"` if they exist, and an array of choices for each is populated
// in `req.data.piecesFilters.tags` (if the field in question is `tags`), etc. The choices in the
// array are objects with `label` and `value` properties.
//
// If a filter configuration has a `counts` property set to `true`, then the array provided for
// that filter will also have a `count` property for each value. This has a performance
// impact.

///var async = require('async');

module.exports = {
  extend: 'apostrophe-custom-pages',


  name: 'idea',

  construct: function(self, options) {
    console.log('here')

    self.dispatch('/:id', (req, callback) => {
      console.log('here 3');

      console.log('req.params', req.params);

      callback(null);
    });
  }
};
