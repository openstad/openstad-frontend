const defaultImageFileTypes = ['image/png', 'image/jpeg', 'image/jpg'];
const defaultVideoFileTypes = [];
const defaultMaxSize = []

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
      label: 'Location'
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
  ],
  default: {
      title: 'New...',
      position: [52.360506, 4.908971],
  }
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
      key: 'title',
      type: 'text',
      label: 'title',
      validation: {
        required: true,
        minLength: 2,
        maxLength: 40
      },
      santize: 'alphaNumeric',
      format: '',
    },
    {
      key: 'description',
      type: 'textarea',
      label: 'Description',
      validation: {
        required: true,
        minLength: 2,
        maxLength: 40
      },
    },
    {
      key: 'images',
      type: 'image',
      multiple: true,
      description: 'First one is used for overview',
      label: 'Images',
      validation: {
        required: true,
        allowedFileTypes: defaultImageFileTypes
      },
    },
    {
      key: 'video',
      type: 'image',
      multiple: true,
      description: 'First one is used for overview',
      label: 'Images',
      validation: {
        required: true,
        allowedFileTypes: defaultImageFileTypes
      },
    },
    {
      key: 'allowedRole',
      type: 'select',
      options: [{
        value: false,
        label: 'None'
      },{

      }]
    },
    {
      key: 'workouts',
      type: 'relationship',
      multiple: true
    },
    {
      key: 'workouts',
      type: 'relationship',
      multiple: true
    },
  ]
}

const workoutProgramSchema = {

}

const exerciseSchema = {

  fields: {

  }
}

const nutritionalSchema = {
  fields: {

  }
}

const recipeSchema = {
  fields: {

  }
}

const membershipSchema = {
  fi
}

exports = {
  step: stepSchema,
  workoutProgram: workoutProgramSchema,
  workout: workoutSchema,
  exercise: exerciseSchema,
  recipe: recipeSchema,
  membership: membershipSchema
}
