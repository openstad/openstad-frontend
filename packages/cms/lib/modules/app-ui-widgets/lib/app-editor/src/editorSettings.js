const tour = {
  editableResources: [
    'step'
  ],
  defaultResources: [
    {
      name: 'step',
      items: [],
    },
    {
      name: 'coordinates',
      items: [],
    },
  ]
}

const workout = {
  singleResources: [
      'styling'
  ],
  editableResources: [
    'workoutProgram',
    'workout',
    'exercise',
    'membership'
  ],
  defaultResources: [
    {
      name: 'styling',
      items: [{

      }],
    },
    {
      name: 'workoutProgram',
      items: [],
    },
    {
      name: 'workout',
      items: [],
    },
    {
      name: 'exercise',
      items: [],
    },
    {
      name: 'membership',
      items: [{

      }],
    },
  ]
}

const games = {
  editableResources: [
    'games',
    'words'
  ]
}

const generic = {
  editableResources: [
    'screens'
  ]
}

export default {
  tour,
  workout,
  games,
  generic
}
