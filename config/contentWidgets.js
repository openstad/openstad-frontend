const contentWidgets = {
  '@savvycodes/openstad-event-planner': {
    adminOnly: true,
  },
  '@savvycodes/openstad-event-browser': {
    adminOnly: true,
  },
  'decision-tree': {
    adminOnly: true,
    readOnly: true,
  },
  'participatory-budgeting': {
    addLabel: 'Participatory budgetting',
    adminOnly: true,
  },
  'choices-guide': {
    addLabel: 'Keuzewijzer',
  },
  'choices-guide-result': {
    addLabel: 'Keuzewijzer resultaten',
  },
  'main-image': {
    adminOnly: true,
  },
  'apostrophe-rich-text': {
    toolbar: [
      'Styles',
      'Bold',
      'Italic',
      'Link',
      'Unlink',
      'BulletedList',
      '-',
      'JustifyLeft',
      'JustifyCenter',
      'JustifyRight',
      'JustifyBlock',
      '-',
    ],
    styles: [{ name: 'Paragraph', element: 'p' }],
    controls: {
      movable: true,
      removable: true,
      position: 'top-left',
    },
  },
  'speech-bubble': {
    controls: {
      position: 'top-left',
    },
  },
  title: {},
  'user-form': {
    adminOnly: true,
  },
  'local-video': {
    addLabel: 'Video (upload)',
  },
  'apostrophe-video': {
    addLabel: 'Video (3d party, youtube, vimeo, etc.)',
  },
  location: {
    adminOnly: true,
  },
  share: {
    adminOnly: true,
  },
  'recource-raw': {
    adminOnly: true,
  },
  'recource-image': {
    adminOnly: true,
  },
  'recource-like': {
    adminOnly: true,
  },
  'apostrophe-forms': {
    forceDisplay: true,
  },
};
