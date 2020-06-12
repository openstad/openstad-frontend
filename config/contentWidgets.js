// adminonly for widgets only available to admin
// hideByDefault for managing legacy and beta widgets not visible by default
// can be turned on per key, or per deprecated/beta flag
// this is just for showing, widgets are still loaded even if they are not visible, this is necessary for asset loading
// all shared within one multisite installation
//
const objectClone = function() {
  var newObj = (this instanceof Array) ? [] : {};
  for (var i in this) {
    if (i == 'clone') continue;
    if (this[i] && typeof this[i] == "object") {
      newObj[i] = this[i].clone();
    } else newObj[i] = this[i]
  } return newObj;
};

const contentWidgets = {
  'admin': {
    adminOnly: true,
    hideByDefault: true
  },
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
  'cookie-warning': {
    adminOnly: true,
    hideByDefault: true
  },
  'date-bar': {},
  'idea-form': {
    adminOnly: true,
    hideByDefault: true
  },
  'idea-map': {
    adminOnly: true
  },
  'idea-overview': {
  },
  'idea-single': {
    adminOnly: true,
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
    hideByDefault: true,
    deprecated: true
  },
  'gebiedsontwikkeling-tool': {
    addLabel: 'Map for area development  (beta)',
    adminOnly: true,
    hideByDefault: true,
    beta: true
  },
  'participatory-budgeting': {
    addLabel: 'Participatory budgetting',
    adminOnly: true
  },
  'choices-guide': {
    addLabel: 'Keuzewijzer  (beta)',
    hideByDefault: true,
    beta: true
  },
  'choices-guide-result': {
    addLabel: 'Keuzewijzer resultaten (beta)',
    hideByDefault: true,
    beta: true
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
  'resource-admin': {
    adminOnly: true
  },
  'resource-overview': {
    adminOnly: true,
  },
  'resource-form': {
    adminOnly: true,
  },
  'resource-representation': {
    adminOnly: true,
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
  'speech-bubble': {
    controls: {
      position: 'top-left'
    },
  },
  'title': {},
  'user-form': {
    adminOnly: true,
    hideByDefault: true,
    beta: true
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
  }
};

exports.getAdminWidgets = (displaySettings) => {
  // This ensures we get a nested clone instead of references to initial object
  const newValues = JSON.parse(JSON.stringify(contentWidgets));
  const filteredContentWidgets = {};

  Object.keys(contentWidgets).forEach(function(key) {
      filteredContentWidgets[key] = newValues[key];

      /**
       * Edit the settings for admin, so they can  edit all modules.
       * @TODO: this can be removed, was needed in beginning because of reference object would cache the readOnly status
       * JSON.parse should solve this, but should be tested properly
       */
      filteredContentWidgets[key].readOnly = false;
      filteredContentWidgets[key].edit = true;
  });

  return getVisibleContentWidgets(filteredContentWidgets, displaySettings);
}

exports.getEditorWidgets = (displaySettings) => {
  // This ensures we get a nested clone instead of references to initial object
  const newValues = JSON.parse(JSON.stringify(contentWidgets));
  const filteredContentWidgets = {};

  Object.keys(contentWidgets).forEach(function(key) {
      filteredContentWidgets[key] = newValues[key];

      /**
       * Edit the settings for editors, so they can only edit specific modules.
       */
      if (filteredContentWidgets[key].adminOnly) {
        //readonly hides the module from the menu but is still
        filteredContentWidgets[key].readOnly = true;
        //setting edit to false removes the edit controls for this module
        filteredContentWidgets[key].edit = false;
      }
  });

  return getVisibleContentWidgets(filteredContentWidgets, displaySettings);
}

const getVisibleContentWidgets = (filteredWidgets, displaySettings) => {
  const newValues = JSON.parse(JSON.stringify(filteredWidgets));
  const filteredContentWidgets = {};

  Object.keys(contentWidgets).forEach(function(key) {
    filteredContentWidgets[key] = newValues[key];
    let forceDisplay = false;

    //if set to visible the make sure hideByDefault is turned on
    if (displaySettings && displaySettings.visibleWidgets && displaySettings.visibleWidgets.includes(key)) {
      forceDisplay = true;
    }

    //if displayDeprecated set to visible the make sure hideByDefault is turned  off for deprecated widgets
    if (displaySettings && displaySettings.deprecated && filteredContentWidgets[key].deprecated) {
      forceDisplay = true;
    }

    //if displayBeta set to visible the make sure hideByDefault is turned off for beta widgets
    if (displaySettings && displaySettings.beta && filteredContentWidgets[key].beta) {
      forceDisplay = true;
    }

    // if now hide by default is still one, then turn the widget to readOnly so it doesn't appear in editor menu, but still editable/removable
    if (filteredContentWidgets[key].hideByDefault && !forceDisplay) {
      filteredContentWidgets[key].readOnly = true
    }
  });

  return filteredContentWidgets;
}
