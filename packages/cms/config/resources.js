const resources = [
  {
    label: 'Idea',
    value: 'idea',
    resourceEndPoint: 'idea',
    //config is used in API config
    configKey: 'ideas'
  },
  {
    label: 'Article',
    value: 'article',
    resourceEndPoint: 'article',
    //config is used in API config
    configKey: 'articles'
  },
  // always get the values from the active user
  {
    label: 'Active User',
    value: 'activeUser',
    resourceEndPoint: 'user',
    //config is used in API config
    configKey: 'users'
  },
  // get user from the API
  {
    label: 'Resource User',
    value: 'user',
    resourceEndPoint: 'user',
    //config is used in API config
    configKey: 'users'
  },
  {
    label: 'Event',
    value: 'event',
    resourceEndPoint: 'event',
    //config is used in API config
    configKey: 'events'
  },
]

exports.schemaFormat = resources;
