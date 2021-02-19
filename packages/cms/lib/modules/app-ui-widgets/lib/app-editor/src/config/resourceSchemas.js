import { navigation } from '@react-navigation/native';

const defaultImageFileTypes = ['image/png', 'image/jpeg', 'image/jpg'];
const defaultVideoFileTypes = ['video/mp4', 'video/mp4'];
const defaultMaxSize = [];

// local resources are managed within the application
const stepSchema = {
  // if api is set, it has it's own
  // means no REST api, but resources save to the API
  local: true,
  defaults: {
    apiBase: false,
    apiPath: false,
  },
  name: 'step',
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

const workoutSchema = {
  // if api is set
  // means no REST api, but resources save to the API
  local: true,
  defaults: {
    apiBase: false,
    apiPath: false,
  },

  screens: [
    {
      name: "workoutDetail",
      components: [
        {
          type: 'images',
          props: {
            key: 'src'
          }
        },
        {
          type: 'title',
          props: {
            key: 'title'
          }
        },
        {
          type: 'richText',
          props: {
            key: 'description'
          }
        },
        {
          type: 'button',
          props: {
            buttonText: 'Start workout',
            onPress: () => {
              /* 1. Navigate to the Details route with params */
              navigation.navigate('Details', {
                itemId: 86,
                otherParam: 'anything you want here',
              });
            }
          }
        },
      ],
    },
    {
      name: "workout",
      components: [
        {
          type: 'ExcerciseWorkout',
        }
      ],
    }
  ],
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
      sanitize: 'alphaNumeric',
      format: '',
    },
    {
      key: 'description',
      type: 'text',
      textarea: true,
      label: 'Description',
      validation: {
        required: true,
        minLength: 2,
        maxLength: 40
      },
      sanitize: 'alphaNumeric',
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
      sanitize: 'alphaNumeric'
    },
    {
      key: 'video',
      type: 'image',
      multiple: true,
      description: 'First image is used as image',
      label: 'Images',
      validation: {
        required: true,
        allowedFileTypes: defaultVideoFileTypes
      },
    },
    {
      key: 'type',
      type: 'select',
      options: [{
        value: 'exercise',
        label: 'Workout made with a selection of exercises'
      },{
        value: 'step',
        label: 'Video workout'
      }]
    },
    {
      key: 'roleNeeded',
      type: 'select',
      options: [{
        value: false,
        label: 'Available for everyone'
      },{
        value: 'member',
        label: 'Members only'
      }]
    },
    {
      displayConditions: [{
        'type': 'exercise'
      }],
      key: 'steps',
      type: 'object',
      fields: [
        {
          key: 'type',
          type: 'select',
          options: [{
            value: 'exercise',
            label: 'Workout made with a selection of exercises'
          },{
            value: 'step',
            label: 'Video workout'
          }]
        },
        {
          key: 'exercise',
          type: 'relationship',
          multiple: true
        }
      ]
    }
  ]
}

const workoutProgramSchema = {
  screens : [
    {
      name: "workoutProgramDetail",
      components: [
        {
          type: 'images',
          props: {
            key: 'src'
          }
        },
        {
          type: 'title',
          props: {
            key: 'title'
          }
        },
        {
          type: 'richText',
          props: {
            key: 'description'
          }
        },
        {
          type: 'button',
          props: {
            buttonText: 'Start workout',
            onPress: () => {
              /* 1. Navigate to the Details route with params */
              navigation.navigate('Details', {
                itemId: 86,
                otherParam: 'anything you want here',
              });
            }
          }
        },
      ],
    }
  ],
  fields : [
    {
      key: 'title',
      type: 'text',
      label: 'title',
      validation: {
        required: true,
        minLength: 2,
        maxLength: 40
      },
      sanitize: 'alphaNumeric',
      format: '',
    },
    {
      key: 'description',
      type: 'text',
      textarea: true,
      label: 'Description',
      validation: {
        required: true,
        minLength: 2,
        maxLength: 40
      },
      sanitize: 'alphaNumeric',
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
      sanitize: 'alphaNumeric'
    },
    {
      key: 'duration',
      type: 'text',
      label: 'Workout program in weeks',
      validation: {
        required: true,
        minLength: 2,
        maxLength: 40
      },
      sanitize: 'alphaNumeric',
      format: '',
    },
  ]
}

const exerciseSchema = {
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
      sanitize: 'alphaNumeric',
      format: '',
    },
    {
      key: 'description',
      type: 'text',
      textarea: true,
      label: 'Description',
      validation: {
        required: true,
        minLength: 2,
        maxLength: 40
      },
      sanitize: 'alphaNumeric',
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
      sanitize: 'alphaNumeric'
    },
  ]
};

const recipeSchema = {
  fields: []
};

const membershipSchema = {
  auth: {
    view: ['all'],
    create: ['admin'],
    edit: ['owner', 'creator'],
    delete: ['admin'],
  },
  fields : [
    {
      key: 'title',
      type: 'text',
      label: 'title',
      validation: {
        required: true,
        minLength: 2,
        maxLength: 40
      },
      sanitize: 'alphaNumeric',
      format: '',
    },
    {
      key: 'description',
      type: 'text',
      textarea: true,
      label: 'Description',
      validation: {
        required: true,
        minLength: 2,
        maxLength: 40
      },
      sanitize: 'alphaNumeric',
    },
    {
      key: 'price',
      type: 'price',
      label: 'Price',
      validation: {
        required: true,
        minLength: 2,
        maxLength: 40
      },
      sanitize: 'price',
      format: '',
    },
    {
      key: 'period',
      type: 'Select',
      label: 'Billing period',
      validation: {
        required: true,
        minLength: 2,
        maxLength: 40
      },
      sanitize: 'price',
      format: '',
      auth: {
        edit: ['admin'],
      },
    },
  ]
};

// General Resource for tracking user Activity
const activitySchema = {
  local: false,
  defaults: {
    apiBase: false,
    apiPath: false,
  },
  fields : [
    {
      key: 'name',
      type: 'text',
      label: 'Name',
      validation: {
        required: true,
        minLength: 2,
        maxLength: 40
      },
      sanitize: 'alphaNumeric',
      format: '',
    },
    {
      key: 'value',
      type: 'text',
      label: 'Value',
      validation: {
        required: true,
        minLength: 2,
        maxLength: 40
      },
      sanitize: 'alphaNumeric',
    },
    {
      key: 'resourceName',
      type: 'text',
      label: 'Resource',
      validation: {
        minLength: 1,
        maxLength: 100
      },
      sanitize: 'alphaNumeric',
    },
    {
      key: 'createdAt',
      type: 'date',
      label: 'Created at',
    },
  ]
};

const subscriberSchema = {
  local: false,
  defaults: {
    apiBase: false,
    apiPath: false,
  },
  fields : [
    {
      key: 'name',
      type: 'text',
      label: 'Name',
      validation: {
        required: true,
        minLength: 2,
        maxLength: 40
      },
      sanitize: 'alphaNumeric',
      format: '',
    },
    {
      key: 'price',
      type: 'text',
      label: 'Value',
      validation: {
        required: true,
        minLength: 2,
        maxLength: 40
      },
      sanitize: 'price',
    },
    {
      key: 'startDate',
      type: 'dateTime',
      label: 'Start Date',
      validation: {
        minLength: 1,
        maxLength: 100
      },
    },
    {
      key: 'createdAt',
      type: 'date',
      label: 'Created at',
    },
  ]
};

const userActivitySchema = {
  local: true,
  defaults: {
    apiBase: false,
    apiPath: false,
  },
  fields : [
    {
      key: 'name',
      type: 'text',
      label: 'Name',
      validation: {
        required: true,
        minLength: 2,
        maxLength: 40
      },
      sanitize: 'alphaNumeric',
      format: '',
    },
    {
      key: 'value',
      type: 'text',
      label: 'Value',
      validation: {
        required: true,
        minLength: 2,
        maxLength: 40
      },
      sanitize: 'alphaNumeric',
    },
    {
      key: 'type',
      type: 'text',
      label: 'Type',
      validation: {
        required: true,
        minLength: 2,
        maxLength: 40
      },
      sanitize: 'alphaNumeric',
    },
    {
      key: 'createdAt',
      type: 'date',
      label: 'Created at',
    },
  ]
};


const commentsSchema = {};

const postSchema = {};

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
};

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
};

export default {
  step: stepSchema,
  workoutProgram: workoutProgramSchema,
  workout: workoutSchema,
  exercise: exerciseSchema,
  recipe: recipeSchema,
  membership: membershipSchema,
  subscription: subscriberSchema,
  userActivity: userActivitySchema
}
