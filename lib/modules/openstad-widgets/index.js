module.exports = {
  extend: 'apostrophe-widgets',
  label: 'Openstad widgets',
  construct: function(self, options) {
/*    const superLoad = self.load;

    self.load = (req, widgets, callback) => {
      widgets.forEach((widget) => {
        if (self.options.adminOnly && ! req.data.isAdmin) {
          widget._edit = false;
        }
      });
      return superLoad(req, widgets, callback);
    }
  }*/
  }
}
