const styleSchema = require('../../../config/styleSchema.js').default;
const contentWidgets = {
    'counter' : {
      addLabel: 'Counter',
      controls: {
        position: 'top-left'
      }
    },
    'image' : {
      controls: {
        position: 'top-left'
      }
    },
    'link': {
      controls: {
        position: 'top-left'
      }
    },
    'list' : {
      controls: {
        position: 'top-left'
      }
    },
    'apostrophe-rich-text': {
      toolbar: [ 'Styles', 'Bold', 'Italic', 'Link', 'Unlink', 'BulletedList', '-', 'JustifyLeft', 'JustifyCenter', 'JustifyRight', 'JustifyBlock', '-', ],

    /*  toolbar : [
        { name: 'basicstyles', groups: [ 'basicstyles', 'cleanup' ], items: [ 'Bold', 'Italic', 'Underline', 'Strike', 'Subscript', 'Superscript', '-', 'CopyFormatting', 'RemoveFormat' ] },
        { name: 'paragraph', groups: [ 'list', 'indent', 'blocks', 'align', 'bidi' ], items: [ 'NumberedList', 'BulletedList', '-', 'Outdent', 'Indent', '-', 'Blockquote', 'CreateDiv', '-', 'JustifyLeft', 'JustifyCenter', 'JustifyRight', 'JustifyBlock', '-', 'BidiLtr', 'BidiRtl', 'Language' ] },
      ],*/
      styles: [
        { name: 'Paragraph', element: 'p' }
      ],
      controls: {
        movable: true,
        removable: true,
        position: 'top-left'
      }
    },

    'title' : {
      controls: {
        position: 'top-left'
      }
    },
//      'user-form' : {},
    'local-video': {
      addLabel: 'Video (upload)',
      controls: {
        position: 'top-left'
      }
    },
    'apostrophe-video' : {
      addLabel: 'Video (3d party, youtube, vimeo, etc.)',
      controls: {
        position: 'top-left'
      }
    },
};
module.exports = {
  extend: 'apostrophe-widgets',
  label: 'Speech Bubble',
  addFields: [
    /*{
      name: 'title',
      type: 'string',
      label: 'Title',
      required: true
    },*/
    {
      name: 'area1',
      type: 'area',
      label: 'Area 1',
      widgets: contentWidgets,
      contextual: true
    },
    {
      name: 'borderColor',
      type: 'color',
      label: 'Border color',
    },
    {
      name: 'backgroundColor',
      type: 'color',
      label: 'Background color',
    },
 
    styleSchema.definition('containerStyles', 'Styles for the speech bubble')
  ],
  construct: function(self, options) {
    const superLoad = self.load;
    self.load = (req, widgets, callback) => {
      widgets.forEach((widget) => {
        if (widget.containerStyles) {
          const containerId = styleSchema.generateId();
          widget.containerId = containerId;
          widget.contentWidgets = contentWidgets;
          widget.formattedContainerStyles = styleSchema.format(containerId, widget.containerStyles);
        }
      });

      return superLoad(req, widgets, callback);
    }

     var superPushAssets = self.pushAssets;
     self.pushAssets = function() {
       superPushAssets();
       self.pushAsset('stylesheet', 'admin', { when: 'always' });
       self.pushAsset('stylesheet', 'main', { when: 'always' });
     };
  }
};
