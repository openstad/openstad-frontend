module.exports = function( helpers, role ) {
  role.action({
    dev: false,

    'index:view': true,

    'account:register': true,
    'account:complete': helpers.needsToCompleteRegistration,

    'agenda:admin': false,

    'sites:list': true,
    'site:admin': false,
    'site:view': true,
    'site:create': false,
  /*  'site:edit': {
      allow: false,
      resource: 'site',
      message: 'Site bewerken niet toegestaan'
    },*/
     'site:edit': true,
    'site:delete': {
      allow: false,
      resource: 'site'
    },

    'users:list': false,
    'user:view': false,
    // creating is done trough loggin in, not REST api
    'user:create': false,
    'user:edit': false,
    'user:delete': false,

    'ideas:admin': false,
    'ideas:list': true,
    'ideas:archive': true,
    'idea:admin': false,
    'idea:view': true,
    'idea:create': false,
    'idea:vote': {
      allow: false,
      resource: 'idea'
    },
    'idea:edit': {
      allow: false,
      resource: 'idea',
      message: 'Idee bewerken niet toegestaan'
    },
    'idea:delete': {
      allow: false,
      resource: 'idea'
    },

    'articles:admin': false,
    'articles:list': true,
    'articles:archive': true,
    'article:admin': false,
    'article:view': true,
    'article:create': false,
    'article:edit': {
      allow: false,
      resource: 'article',
      message: 'Artikel bewerken niet toegestaan'
    },
    'article:delete': {
      allow: false,
      resource: 'article'
    },

    'image:upload': {
      allow: false,
      message: 'Afbeelding uploaden niet toegestaan'
    },

    'arguments:list': true,
    'argument:view': true,
    'argument:create': false,
    'argument:edit': false,
    'argument:delete': false,
    'argument:vote': {
      allow: false,
      resource: ['argument'],
      message: 'Stemmen kan enkel als geregistreerde gebruiker'
    },

    'ideavotes:list': true,
    'ideavote:view': true,
    'ideavote:create': false,
    'ideavote:edit': false,
    'ideavote:delete': false,

    // newslettersignup
    'newslettersignup:list': false,
    'newslettersignup:view': false,
    'newslettersignup:create': true,
    'newslettersignup:confirm': true,
    'newslettersignup:signout': true,
    'newslettersignup:edit': false,
    'newslettersignup:delete': false,

    // choicesguide
    'choicesguide:list': true,
    'choicesguide:view': true,
    'choicesguide:create': false,
    'choicesguide:edit': false,
    'choicesguide:delete': false,

    'choicesguidechoice:list': true,
    'choicesguidechoice:view': true,
    'choicesguidechoice:create': false,
    'choicesguidechoice:edit': false,
    'choicesguidechoice:delete': false,

    'choicesguidequestiongroup:list': true,
    'choicesguidequestiongroup:view': true,
    'choicesguidequestiongroup:create': false,
    'choicesguidequestiongroup:edit': false,
    'choicesguidequestiongroup:delete': false,

    'choicesguidequestion:list': true,
    'choicesguidequestion:view': true,
    'choicesguidequestion:create': false,
    'choicesguidequestion:edit': false,
    'choicesguidequestion:delete': false,

    'choicesguideresult:list': true,
    'choicesguideresult:view': true,
    'choicesguideresult:create': false,
    'choicesguideresult:edit': false,
    'choicesguideresult:delete': false,

    // submissions
    'submissions:list': false,
    'submissions:view': false,
    'submissions:create': true,
    'submissions:edit': false,
    'submissions:delete': false,
    // articles
    'article:view': true,
    'article:create': false,
    'article:edit': {
      allow: false,
      message: 'Artikel bewerken niet toegestaan'
    },
    'article:delete': {
      allow: false,
      message: 'Artikel verwijderen niet toegestaan'
    },

    // Only used to determine whether to render the argument form.
    // When a user is not allowed to add an argument, we still show
    // the form, only disabled with login-on-focus.
    'arg:form': {
      allow: helpers.maySeeArgForm,
      resource: 'idea'
    },
    'arg:add': {
      allow: helpers.mayAddArgument,
      resource: 'idea',
      message: 'Om een argument toe te voegen moet je ingelogd zijn'
    },
    'arg:reply:form': {
      allow: helpers.maySeeReplyForm,
      resource: ['idea', 'argument']
    },
    'arg:reply': {
      allow: false,
      resource: ['idea', 'argument']
    },
    'arg:edit': {
      allow: false,
      resource: ['idea', 'argument'],
      message: 'Argument bewerken niet toegestaan'
    },
    'arg:delete': {
      allow: false,
      resource: ['idea', 'argument'],
      message: 'Argument verwijderen niet toegestaan'
    },
    'arg:vote': {
      allow: false,
      resource: ['idea', 'argument'],
      message: 'Stemmen kan enkel als geregistreerde gebruiker'
    },

    // tags
    'tags:list': true,
    'tags:view': true,
    'tags:create': false,
    'tags:edit': false,
    'tags:delete': false,

    // area
    'area:list': true,
    'area:create': false,

    'user:mail': false
  });
};
