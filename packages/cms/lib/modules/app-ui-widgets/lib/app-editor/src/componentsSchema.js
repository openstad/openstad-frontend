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
      type: 'text',
      label: 'Word (single)'
    },
    {
      key: 'plural',
      type: 'text',
      label: 'Word (plural)'
    },
    {
      key: 'images',
      type: 'image',
      multiple: true,
      label: 'Images'
    },
    {
      key: 'sound',
      type: 'audio',
    },
    {
      key: 'categories',
      type: 'relationship',
      multiple: true
    },
  ]
}

const componentFields = [
  'title'   :{
    component: Title,
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
