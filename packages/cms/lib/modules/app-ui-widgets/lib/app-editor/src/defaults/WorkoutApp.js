import resourceSchemas from '../config/resourceSchemas';

//{workoutProgram, workout, exercise, membership}

const capitalize = string => string.charAt(0).toUpperCase() + string.slice(1);

const defaultResources = {
    workoutProgram: resourceSchemas.workoutProgram,
    workout: resourceSchemas.workout,
    exercise: resourceSchemas.exercise,
    membership: resourceSchemas.membership,
};

const defaultResourceScreens = defaultResources.map((resource, i) => {
    const screens = resource.screens.map((screen) => {
        return {
            id : 100000 + i,
            type: 'resource',
            title: `${capitalize(screen.name)} screen`,
            name: screen.name,
            components: screen.components,
            localResources: []
        }
    })
    return [...screens];
});

const defaultWorkoutScreens = {
    startScreenId: 1,
    items: [
        {
            id: 1,
            name: 'Your Program',
            type: 'static',
            inTabNavigation: true,
            components: [
                {
                    type: 'title',
                    props: {
                        title: 'Your program'
                    }
                },
                {
                    type: 'WorkoutSelectedProgram',
                    props: {
                        resource: 'program',
                        amount: 1,
                        titleKey: 'first_name',
                        backgroundImageKey: 'avatar'
                    }
                },
            ]
        },
        {
            id: 2,
            name: 'Workouts',
            type: 'static',
            inTabNavigation: true,
            components: [
                {
                    type: 'title',
                    props: {
                        title: 'All programs'
                    }
                },
                {
                    type: 'overview',
                    props: {
                        resource: 'program',
                        amount: 120,
                        displayType: 'card',
                        scroll: "horizontal",
                        titleKey: 'title',
                        backgroundImageKey: 'images'
                    }
                },
                {
                    type: 'title',
                    props: {
                        title: 'All programs'
                    }
                },
                {
                    type: 'overview',
                    props: {
                        resource: 'workout',
                        amount: 120,
                        displayType: 'card',
                        scroll: "horizontal",
                        titleKey: 'title',
                        backgroundImageKey: 'images'
                    }
                },
            ]
        },
        {
            id: 3,
            name: 'My Account',
            type: 'static',
            inTabNavigation: true,
            components: [
                {
                    type: 'title',
                    props: {
                        title: 'My Account'
                    }
                },
                {
                    type: 'title',
                    props: {
                        title: 'Workouts',
                        //@Todo: implement variant h2 for title
                        variant: 'h2'
                    }
                },
                {
                    type: 'overview',
                    props: {
                        resource: 'activity',
                        //@Todo: implement user as a source for data
                        source: 'user',
                        amount: 120,
                        displayType: 'list',
                        scroll: "vertical",
                        titleKey: 'title',
                    }
                },
                {
                    type: 'title',
                    props: {
                        title: 'My subscription',
                        variant: 'h2',
                    }
                },
                {
                    type: 'MySubscription',
                    props: {
                        resource: 'subscription',
                        source: 'user',
                        amount: 120,
                        displayType: 'card',
                        scroll: "horizontal",
                        titleKey: 'title',
                        backgroundImageKey: 'images'
                    }
                },
            ]
        },
        ...defaultResourceScreens
    ],
}

export default {
    screens: defaultWorkoutScreens,
    resources: defaultResources
};