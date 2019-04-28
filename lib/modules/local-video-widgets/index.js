module.exports = {
  extend: 'apostrophe-widgets',
  name: 'local-video',
  label: 'Local Video',
  addFields: [
      {
          name: 'filename',
          label: 'File',
          type: 'singleton',
          widgetType: 'apostrophe-files',
          options: {limit: 1},
          required: true
      },
      {
          name: 'poster',
          label: 'Poster',
          type: 'singleton',
          widgetType: 'apostrophe-images',
          options: {limit: 1},
          contextualOnly: true
      }
  ],
}
