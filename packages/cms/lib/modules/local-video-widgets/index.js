/**
 * Widget for displaying a video directly from the CMS
 * For large video's it's advised to use external service like vimeo and use an iframe
 */
module.exports = {
  extend: 'openstad-widgets',
  name: 'local-video',
  label: 'Local Video',
  addFields: [
      {
          name: 'filename',
          label: 'Video',
          type: 'attachment',
//          widgetType: 'apostrophe-files',
          options: {limit: 1},
          required: true,
    //      contextual: true
      },
      {
          name: 'poster',
          label: 'Poster image (for when loading & before starting, optional)',
          type: 'attachment',
          options: {limit: 1},
      }
  ],
}
