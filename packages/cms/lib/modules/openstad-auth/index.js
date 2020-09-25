module.exports = {
  construct: function(self, options) {
    self.expressMiddleware = {
      when: 'afterRequired',
      middleware: (req, res, next) => {
        var url      = req.originalUrl;
    		var method   = req.method;
    		var userId   = req.user && req.user.id;
    		var userRole = req.user && req.user.role;
    		console.log(`${method} "${url}" ${userRole}(${userId})`);

        self.authenticate(req, res, next);
      }
    };

    require('./lib/api.js')(self, options);
    require('./lib/routes.js')(self, options);

  }
};
