module.exports = {
  improve: 'apostrophe-attachments',
  fileGroups: [
      {
        name: 'images',
        label: 'Images',
        extensions: [ 'gif', 'jpg', 'png', 'svg', 'ico', 'mp4' ],
        extensionMaps: {
          jpeg: 'jpg'
        },
        // uploadfs should treat this as an image and create scaled versions
        image: true
      },
      {
        name: 'office',
        label: 'Office',
        extensions: [ 'txt', 'rtf', 'pdf', 'xls', 'ppt', 'doc', 'pptx', 'sldx', 'ppsx', 'potx', 'xlsx', 'xltx', 'csv', 'docx', 'dotx' ],
        extensionMaps: {},
        // uploadfs should just accept this file as-is
        image: false
      },
  ],

}
