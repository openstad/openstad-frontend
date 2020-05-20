module.exports = {
  construct(self, options) {

    // Todo: make this more dynamic, eg. add this to the options of apostrophe?
    const superGetContentWidgets = self.getContentWidgets;

    self.getContentWidgets = (req) => {
      const contentWidgets = superGetContentWidgets(req);
      contentWidgets['custom-title'] = {};

      return contentWidgets;
    }
  }
};
