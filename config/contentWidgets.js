const contentWidgets = {
  'admin': {
    adminOnly: true
  },
  'resource-overview': {
    adminOnly: true
  },
  'resource-form': {
    adminOnly: true
  },
  'resource-representation': {
    adminOnly: true
  },
  'agenda': {},
  'accordeon': {},
  'arguments-block': {
    adminOnly: true
  },
  'arguments-form': {
    adminOnly: true,
    deprecated: true
  },
  'arguments': {
    adminOnly: true,
    deprecated: true
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
  'cookie-warning': {
    adminOnly: true
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
    adminOnly: false
  },
  'ideas-on-map': {
    addLabel: 'Ideeen op een kaart',
    adminOnly: true
  },
  'previous-next-button-block': {
    addLabel: 'Vorige volgende knoppen',
  },
  'iframe': {
    adminOnly: true
  },
  'image': {},
  'info-bar': {},
  'link': {},
  'list': {},
  'begroot': {
    addLabel: 'Begroot (deprecated, please use Participatory budgetting)',
    adminOnly: true,
    readOnly: true,
  },
  'participatory-budgeting': {
    addLabel: 'Participatory budgetting',
    adminOnly: true
  },
  'choices-guide': {
    addLabel: 'Keuzewijzer',
  },
  'choices-guide-result': {
    addLabel: 'Keuzewijzer resultaten',
  },
  'main-image': {
    adminOnly: true
  },
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
  'location': {
    adminOnly: true
  },
  'share': {
    adminOnly: true
  },
  'recource-raw': {
    adminOnly: true
  },
  'recource-image': {
    adminOnly: true
  },
  'recource-like': {
    adminOnly: true
  },
  'resource-admin': {
    adminOnly: true
  }
};

exports.getAdminWidgets = () => {
  const filteredContentWidgets = {};

  Object.keys(contentWidgets).forEach(function(key) {
    filteredContentWidgets[key] = contentWidgets[key];

    /**
     * Edit the settings for admin, so they can  edit all modules.
     */
    if (filteredContentWidgets[key].adminOnly) {
      //readonly = false shows the module from the menu
      filteredContentWidgets[key].readOnly = false;
      filteredContentWidgets[key].edit = true;
    }

  });

  return filteredContentWidgets;
}

exports.getEditorWidgets = () => {
  const filteredContentWidgets = {};

  Object.keys(contentWidgets).forEach(function(key) {
    filteredContentWidgets[key] = contentWidgets[key];

    /**
     * Edit the settings for editors, so they can only edit specific modules.
     */
    if (filteredContentWidgets[key].adminOnly) {
      //readonly hides the module from the menu
      filteredContentWidgets[key].readOnly = true;
      //setting edit to false removes the edit controls for this module
      filteredContentWidgets[key].edit = false;
    }

  });

  return filteredContentWidgets;
}
