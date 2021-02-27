import {navigation} from '@react-navigation/native';

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
            default: 'New step...'
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
                    type: 'WorkoutIntro',
                    props: {
                        key: 'src'
                    }
                },
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
                    type: 'WorkoutIntro',
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
            default: 'New Workout',
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
            label: 'Type of workout',
            key: 'type',
            type: 'select',
            options: [{
                value: 'exercise',
                label: 'Workout made with a selection of exercises'
            }, {
                value: 'video',
                label: 'Video workout'
            }]
        },
        {
            label: 'Free or Premium (in future specific users)',
            key: 'roleNeeded',
            type: 'select',
            options: [{
                value: false,
                label: 'Available for everyone'
            }, {
                value: 'member',
                label: 'Members only'
            }]
        },
        {
            displayConditions: [{
                'key': 'type',
                'value': 'video'
            }],
            key: 'video',
            type: 'image',
            multiple: true,
            description: 'First image is used as image',
            label: 'Video',
            validation: {
                required: true,
                allowedFileTypes: defaultVideoFileTypes
            },
        },
        {
            displayConditions: [{
                'key': 'type',
                'value': 'exercise'
            }],
            label: 'Workout Rounds',
            key: 'rounds',
            type: 'object',
            fields: [
                {
                    key: 'round',
                    type: 'text',
                    label: 'Amount of repetitions of round',
                    default: '1',
                    validation: {
                        required: true,
                        minLength: 1,
                        maxLength: 2
                    },
                    sanitize: 'numeric',
                    format: '',
                },
                {
                    label: 'Round',
                    key: 'rounds',
                    type: 'object',
                    fields: [
                        {
                            label: 'Excercise or Rest?',
                            key: 'exerciseOrRest',
                            type: 'select',
                            options: [{
                                value: 'exercise',
                                label: 'Excercise'
                            }, {
                                value: 'rest',
                                label: 'Rest'
                            }]
                        },
                        {
                            displayConditions: [{
                                'key': 'exerciseOrRest',
                                'value': 'exercise'
                            }],
                            label: 'Exercise',
                            key: 'exercise',
                            type: 'relationship',
                            resourceName: 'exercise'
                        },
                        {
                            displayConditions: [{
                                'key': 'exerciseOrRest',
                                'value': 'exercise'
                            }],
                            label: 'Time or Reps?',
                            key: 'roleNeeded',
                            type: 'select',
                            options: [{
                                value: 'time',
                                label: 'Time'
                            }, {
                                value: 'reps',
                                label: 'Reps'
                            }]
                        },

                        {
                            displayConditions: [{
                                'key': 'exerciseOrRest',
                                'value': 'exercise'
                            }],
                        key: 'sets',
                        type: 'number',
                        textarea: true,
                        label: 'Sets',
                        validation: {
                            required: true,
                            minLength: 2,
                            maxLength: 40
                        },
                        sanitize: 'numeric',
                    },
                        {
                            displayConditions: [{
                                'key': 'exerciseOrRest',
                                'value': 'exercise'
                            }],
                            key: 'reps',
                            type: 'number',
                            textarea: true,
                            label: 'Reps',
                            validation: {
                                required: true,
                                minLength: 2,
                                maxLength: 40
                            },
                            sanitize: 'numeric',
                        },
                        {
                            displayConditions: [{
                                'key': 'exerciseOrRest',
                                'value': 'exercise'
                            }],
                            key: 'workoutTime',
                            type: 'number',
                            textarea: true,
                            label: 'Time (in seconds)',
                            validation: {
                                required: true,
                                minLength: 2,
                                maxLength: 40
                            },
                            sanitize: 'numeric',
                        },
                        {
                            displayConditions: [{
                                'key': 'exerciseOrRest',
                                'value': 'rest'
                            }],
                            key: 'restTime',
                            type: 'number',
                            textarea: true,
                            label: 'Rest Time (in seconds)',
                            validation: {
                                required: true,
                                minLength: 2,
                                maxLength: 40
                            },
                            sanitize: 'numeric',
                        },



                    ]
                }

            ]
        }
    ]
}

const workoutProgramSchema = {
    local: true,
    screens: [
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
    fields: [
        {
            key: 'title',
            type: 'text',
            label: 'title',
            default: 'New workout program...',
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
            default: 'New exercise...',
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
    fields: [
        {
            key: 'title',
            type: 'text',
            label: 'title',
            default: 'New membership...',
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
    fields: [
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
    fields: [
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
    fields: [
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

const chatSchema = {
    name: "chat",
    fields:
        [
            {
                key: "user",
                type: 'relationship'
            },
            {
                key: "conversation",
                type: 'object',
                multiple: true,
                fields: {

                },
            }
        ],
}

const messages = {}

const schemas = {
    step: stepSchema,
    workoutProgram: workoutProgramSchema,
    workout: workoutSchema,
    exercise: exerciseSchema,
    recipe: recipeSchema,
    membership: membershipSchema,
    subscription: subscriberSchema,
    userActivity: userActivitySchema,
    chats: chatSchema
}

// do some formatting for all schema's
Object.keys(schemas).forEach((schemaKey) => {
    const schema = schemas[schemaKey];
    let defaultValues = {};

    // create a default resource object based upon the field settings
    schema.fields.filter(field => field.default).forEach((field) => {
        defaultValues[field.key] = field.default;
    });

    schemas[schemaKey] = {
        ...schema,
        defaultValues: defaultValues ? defaultValues : {}
    }
});

export default schemas;
