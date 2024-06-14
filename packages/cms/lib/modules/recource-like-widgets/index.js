/**
 * The resource like widget will allow user to like a resource.
 * Currently only Ideas allow votes and therefore only a like on an idea resource is possible
 *
 * In the siteonfig is determined what role a user needs to like
 *
 * Admin has choice for how to display
 * Needs to be on a page with active resource to work
 */

/**
 * Status: WIP currently only Claps display  and a postive likes work, currently has beta status therefore.
 */
const styleSchema = require('../../../config/styleSchema.js').default;

const fields = [
  {
    type: 'select',
    name: 'displayType',
    label: 'Weergave',
    help: 'Voting needs to be set to like and should be added on a resource idea page in order to work',
    choices: [
      {
        label: 'Claps',
        value: 'claps',
      },
      {
        label: 'Default likes/dislikes',
        value: 'numberplate',
      }
    ]
  },
  {
    type:  'string',
    name:  'ideaId',
    label: 'Idea ID (leave empty to fetch from URL)'
  },
  styleSchema.definition('containerStyles', 'Styles for the container')
];

module.exports = {
  extend: 'apostrophe-widgets',
  label: 'Like',
  addFields: fields,
  construct: function(self, options) {
     let classIdeaId;

     const superPushAssets = self.pushAssets;
     self.pushAssets = function () {
       superPushAssets();
       self.pushAsset('stylesheet', 'main', { when: 'always' });
       self.pushAsset('script', 'main', { when: 'always' });
     };

      const superLoad = self.load;
      self.load = async function (req, widgets, next) {
        widgets.forEach((widget) => {
            if (widget.containerStyles) {
              const containerId = self.apos.utils.generateId();
              widget.containerId = containerId;
                widget.formattedContainerStyles = styleSchema.format(containerId, widget.containerStyles);
            }

            widget.cssHelperClassesString = widget.cssHelperClasses ? widget.cssHelperClasses.join(' ') : '';

        });
  
        const promises = widgets.map(async (widget) => {
          let resource = {};
          if (widget.ideaId) {
            try {
              resource = await self.apos.openstadApi.getResource(req, req.data.global.siteId, 'idea', widget.ideaId, {}, true);
              widget.ajaxError = null;
            } catch(e) {
              console.error("Fetching the idea did not work, it could be that the given id did not match any idea")
            }
          
          } else {
            resource = req.data.activeResource || {};
          }
          if (resource) {
            widget.activeResource     = resource
            widget.activeResourceType = 'idea';
            widget.activeResourceId   = resource.id;
          }
        });
  
        await Promise.all(promises);
        
        return superLoad(req, widgets, next);
      }


  }
};
