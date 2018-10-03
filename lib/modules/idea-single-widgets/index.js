module.exports = {
  extend: 'apostrophe-widgets',
  label: 'Idea single',
  addFields: [
    {
      name: 'displayVote',
      type: 'string',
      label: 'Display vote',
    //  required: true
    }
  ],
/*  construct: function(self, options) {

  /*  self.route('get', 'idea/:ideaId', function(req, res, next) {
      req.data.ideaId = req.params.ideaId;
      next();
    });
*/
/*
    self.pageBeforeSend = function(req, callback) {
      console.log('---->  req.query.id', req.query.id);
      req.data.ideaId = req.query.id;
      return callback(null);
    }
  }*/

};
