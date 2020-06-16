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
