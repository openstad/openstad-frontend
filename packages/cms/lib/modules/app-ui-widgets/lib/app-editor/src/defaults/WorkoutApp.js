import resourceSchemas from '../config/resourceSchemas';

//{workoutProgram, workout, exercise, membership}

const capitalize = string => string.charAt(0).toUpperCase() + string.slice(1);

const defaultResources = [
    resourceSchemas.workoutProgram,
    resourceSchemas.workout,
    resourceSchemas.exercise,
    resourceSchemas.membership
];

let defaultResourceScreens = [];
let i = 0;

// fetch all screens from the the defaultResources
defaultResources.forEach((resource) => {
    if (resource.screens && resource.screens.length > 0) {
        resource.screens.forEach((screen) => {
            i++;

            defaultResourceScreens.push({
                id : 100000 + i,
                type: 'resource',
                title: `${capitalize(screen.name)} screen`,
                name: screen.name,
                components: screen.components,
                localResources: []
            })
        })
    }
});


const defaultWorkoutScreens = {
    startScreenId: 5,
    items: [
        {
            id: 5,
            name: 'Your Coach',
            type: 'static',
            icon: "assignment-ind",
            inTabNavigation: true,
            components: [
                {
                    type: 'image',
                    props: {
                        title: 'Timothy Banks'
                    }
                },

                {
                    type: 'title',
                    props: {
                        title: 'Timothy Banks'
                    }
                },
                {
                    type: 'richText',
                    props: {
                        text: 'With this app you can pick customized workout program. I offer one for free, the other one for subscription. ' +
                            'Programs range between 2 tot 12 weeks with 3-5 workouts per week. With the app I hold you accountable to your sessions!' +
                            'Any questions, for instance about form. Don\'t forget to fill in your reps and weight every workout, this way we can track your progress!'+
                            'Hide titlebar for tab pages, hide tab bar for detail pages'
                    }
                },
                {
                    type: 'buttons',
                    props: {
                        text: 'See programs',
                        action: 'programs'
                    }
                },
            ]
        },
        {
            id: 1,
            name: 'Your program',
            icon: "calendar-today",
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
            icon: "list-alt",
            type: 'static',
            inTabNavigation: true,
            components: [
                {
                    type: 'title',
                    props: {
                        title: 'Programs'
                    }
                },
                {
                    type: 'overview',
                    props: {
                        resource: 'workoutProgram',
                        linkToScreen: true,
                        amount: 120,
                        displayType: 'card',
                        scroll: "horizontal",
                        titleKey: 'title',
                        backgroundImageKey: 'image'
                    }
                },
                {
                    type: 'title',
                    props: {
                        title: 'Workouts'
                    }
                },
                {
                    type: 'overview',
                    props: {
                        resource: 'workout',
                        linkToScreen: true,
                        amount: 120,
                        displayType: 'list',
                        titleKey: 'title',
                        backgroundImageKey: 'images'
                    }
                },
            ]
        },
        {
            id: 3,
            name: 'Profile',
            type: 'static',
            icon: "perm-identity",
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
                        resource: 'userActivity',
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
                    type: 'overview',
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