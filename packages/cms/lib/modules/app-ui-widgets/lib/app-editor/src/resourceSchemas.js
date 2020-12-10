
const stepSchema = {
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
      key: 'location',
      type: 'location',
    },
    {
      key: 'title',
      type: 'text',
    },
    {
      key: 'description',
      type: 'text',
      textarea: true
    },
    {
      key: 'audio',
      type: 'audio',
    },
    {
      key: 'images',
      type: 'image',
      multiple: true
    },
  ]
}

const wordCategories = {
  local: false,
  defaults: {
    apiBase: false,
    apiPath: false,
  },
  name: '',
  fields: [
    {
      key: 'name',
      type: 'location',
    },
    {
      key: 'plural',
      type: 'text',
    },
    {
      key: 'images',
      type: 'image',
      multiple: true
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

const wordsSchema = {
  // if api is set, it has it's wown
  // means no REST api, but resources save to the API
  local: false,
  defaults: {
    apiBase: false,
    apiPath: false,
  },
  name: '',
  fields: [
    {
      key: 'single',
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

const workoutSchema = {

  f

}
