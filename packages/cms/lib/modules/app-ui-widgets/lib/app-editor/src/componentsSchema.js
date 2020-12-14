const componentsDefaultSchema = {
  // if api is set, it has it's wown
  // means no REST api, but resources save to the API
  local: true,
  defaults: {
    apiBase: false,
    apiPath: false,
  },
  name: '',
  fields: [
    {
      key: 'style',
      type: 'style',
      label: 'Styles'
    },
    {
      key: 'plural',
      type: 'text',
      label: 'Name (plural)'
    },
    {
      key: 'backgroundImage',
      type: 'image',
      multiple: false,
      label: 'Background Image'
    },
  ],
}

const componentTypes = [
  'title'   :{
    ...componentsDefaultSchema,
    fields: [
      ...componentsDefaultSchema.fields,
      [],

    ]
  },
  'richText'    : {
    component: RichText,
  },
  'image'   : {
    component :Image,
  },
  'button'  : {
    component :Button,
  },
  'video'  : {
    component :Video,
  },
  'overview'  : {
    component :Overview,
  },
  'form'  : {
    component :Form,
  },
  'column'   : {
    component :Columns,
  },
  'game'   :{
    component :Game,
  },
  'tour'   : {
    component :Tour,
  },
  'map'   : {
    component :Map,
  },
  'login'   : {
    component :Login,
  },
  'splash'   : {
    component :Splash,
  }
]
