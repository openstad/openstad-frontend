const styleSchema = require('../../../config/styleSchema.js').default;

const fields = [
  {
    name: 'rawInput',
    type: 'string',
    label: 'Templates (templating: nunjucks. variables is the data object: idea, ideas etc.)',
    textarea: true,
  },
  styleSchema.definition('containerStyles', 'Styles for the container'),
    styleSchema.getHelperClassesField(),

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
            const containerId = self.apos.utils.generateId();
            widget.containerId = containerId;
              widget.formattedContainerStyles = styleSchema.format(containerId, widget.containerStyles);
          }

            widget.cssHelperClassesString = widget.cssHelperClasses ? widget.cssHelperClasses.join(' ') : '';


            // Add function for rendering raw string with nunjucks templating engine
          // Yes this ia a powerful but dangerous plugin :), admin only
          widget.renderString = (data) => {
              try {
                return self.apos.templates.renderStringForModule(req, widget.rawInput, data, self);
              } catch (e) {
                return 'Error....'
              }
           }
        });

        return superLoad(req, widgets, next);
      }

  }
};
