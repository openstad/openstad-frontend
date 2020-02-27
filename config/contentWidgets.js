const contentWidgets = {
  'agenda': {},
  'accordeon': {},
  'arguments': {
    adminOnly: true
  },
  'arguments-form': {
    adminOnly: true
  },
  'section': {
    addLabel: 'Columns',
    controls: {
      movable: true,
      removable: true,
      position: 'bottom-left'
    },
  },
  'slider': {
  },
  'counter': {
    addLabel: 'Counter',
  },
  'date-bar': {},
  'idea-form': {
    adminOnly: true
  },
  'idea-map': {
    adminOnly: true
  },
  'idea-overview': {},
  'idea-single': {
    adminOnly: true
  },
  'ideas-on-map': {
    addLabel: 'Ideeen op een kaart',
    adminOnly: true
  },
  'iframe': {},
  'header': {},
  'image': {},
  'info-bar': {},
  'link': {},
  'list': {},
  'gebiedsontwikkeling-tool': {
    addLabel: 'Map for area development',
    adminOnly: true
  },
  'participatory-budgeting': {
    addLabel: 'Participatory budgetting',
    adminOnly: true
  },
  'main-image': {},
  'apostrophe-rich-text': {
    toolbar: ['Styles', 'Bold', 'Italic', 'Link', 'Unlink', 'BulletedList', '-', 'JustifyLeft', 'JustifyCenter', 'JustifyRight', 'JustifyBlock', '-',],
    styles: [
      {name: 'Paragraph', element: 'p'}
    ],
    controls: {
      movable: true,
      removable: true,
      position: 'top-left'
    }
  },

  'speech-bubble': {
    controls: {
      position: 'top-left'
    },
  },
  'title': {},
  'user-form': {
    adminOnly: true
  },
  'local-video': {
    addLabel: 'Video (upload)',
  },
  'apostrophe-video': {
    addLabel: 'Video (3d party, youtube, vimeo, etc.)',
  },
};

exports.getAdminWidgets = () => {
  return contentWidgets;
}

exports.getEditorWidgets = () => {
  const filteredContentWidgets = {};

  Object.keys(contentWidgets).forEach(function(key) {
    var val = contentWidgets[key];

    /**
     * Edit the settings for editors, so they can only edit specific modules.
     */
    if (val.adminOnly) {
      //readonly hides the module from the menu
      val.readOnly = true;
      //setting edit to false removes the edit controls for this module
      val.edit = false;
    }

    filteredContentWidgets[key] = val;
  });

  return filteredContentWidgets;
}
