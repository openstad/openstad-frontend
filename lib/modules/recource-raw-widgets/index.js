const styleSchema = require('../../../config/styleSchema.js').default;

const fields = [
  {
    name: 'rawInput',
    type: 'string',
    label: 'Templates (templating: nunjucks. variables is the data object: idea, ideas etc.)',
    textarea: true,
  },
  styleSchema.definition('containerStyles', 'Styles for the container'),
]

module.exports = {
  extend: 'apostrophe-widgets',
  label: 'Recource raw widget',
  addFields: fields,
  construct: function(self, options) {
     let classIdeaId;
      const resourceType = 'idea';

      const superLoad = self.load;
      self.load = function (req, widgets, next) {
        widgets.forEach((widget) => {
          // render string with variables. Add active recource
          if (widget.containerStyles) {
            const containerId = styleSchema.generateId();
            widget.containerId = containerId;
            widget.formattedContainerStyles = styleSchema.format(containerId, widget.containerStyles);
          }
          //TODO checkout how to access APOS nunjucks so we can also use the filters!
          //TODO
        //  widget.rawString = self.apos.templates.renderString(widget.rawInput, {data: req.data, recource: req.data[recourceType]});


            widget.renderString = (data) => {
              try {
                return self.apos.templates.nunjucks.renderString(widget.rawInput, data)
              } catch (e) {
                return 'Error....'
              }
            }

        });

        return superLoad(req, widgets, next);
      }

  }
};
