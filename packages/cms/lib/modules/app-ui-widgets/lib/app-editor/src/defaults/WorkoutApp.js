import {workoutProgram, workout, exercise, membership} from '../config/resourceSchemas';

const capitalize = string => string.charAt(0).toUpperCase() + string.slice(1);

const defaultResourceScreens = defaultResources.map((resource, i) => {
    return {
        id : 100000 + i,
        type: 'resource',
        title: `${capitalize(resource.nameSingle)} screen`,
        name: resource.name,
        components: resource.defaultComponents,
        localResources: []
    }
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
        ...defaultResourceScreens
    ],
}

export default {
    screens: defaultWorkoutScreens
};