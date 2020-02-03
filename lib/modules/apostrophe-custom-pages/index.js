module.exports = {
  beforeConstruct: function(self, options) {
    options.addFields = [
      {
        name: 'metaTitle',
        label: 'Meta title',
        type: 'string'
      },
      {
        name: 'metaDescription',
        label: 'Meta Description',
        type: 'string'
      },
      {
        name: 'metaTags',
        label: 'Meta Tags',
        type: 'string'
      },
      {
        name: 'notLoggedInRedirect',
        type: 'string',
        label: 'Redirect de gebruiker wanneer niet ingelogd',
      },
      {
        name: 'hideFooter',
        type: 'boolean',
        label: 'Hide the footer?',
      }
    ]
  },

  construct : function () {
    self.redirectWhenNotLoggedIn = function (req, callback) {
      const pageData = req.data.page;

      if (pageData && pageData.notLoggedInRedirect && !req.data.loggedIn) {
        try {
          req.res.redirect(pageData.notLoggedInRedirect );
          return;
        }  catch(e) {
        }
      }
    }

    self.setActiveIdeaId = function (req, callback) {
      const ideaId = req.params.ideaId ? req.params.ideaId : req.query.ideaId;
       if (ideaId) {
          req.data.idea = req.data.ideas ? req.data.ideas.find(idea => idea.id === parseInt(ideaId, 10)) : null;
          req.data.ideaId = ideaId;
      }
    }


    const superPageBeforeSend = self.pageBeforeSend;

    self.pageBeforeSend = (req, callback) => {

      self.redirectWhenNotLoggedIn(req, callback);

      self.setActiveIdeaId(req, callback);

      req.data.messages =  {
        success: req.flash('success'),
        error: req.flash('error'),
        info: req.flash('info'),
      }

      return superPageBeforeSend(req, callback);
    };
  }
};
