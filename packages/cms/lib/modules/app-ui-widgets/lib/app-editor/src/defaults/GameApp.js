const defaultResources = [
    {
        apiBase: 'https://reqres.in/api', // if empty fetch from default settings
        apiPath: 'users',
        responseKey: 'data',
        name: 'game',
        nameSingle: 'game',
        namePlural: 'games',
        defaultComponents: [
            {
                type: 'title',
                resource: true,
                keyTitle: 'first_name'
            },
            {
                type: 'game',
                resource: true,
                props: {
                    keyTitle: 'title'
                }
            }
        ]
    },
    {
        apiUrl: '', // if empty fetch from default settings
        name: 'article',
        nameSingle: 'article',
        namePlural: 'articles',
        defaultComponents: [
            {
                type: 'title',
                props: {
                    keyTitle: 'title'
                }
            },
            {
                type: 'images',
                multiple: false,
                props: {
                    keyImage: 'src'
                }
            },
            {
                type: 'richText',
                props: {
                    key: 'content'
                }
            },
        ]
    },
    {
        apiUrl: '', // if empty fetch from default settings
        name: 'product',
        nameSingle: 'product',
        namePlural: 'products',
        defaultComponents: [
            {
                type: 'title',
                props: {
                    key: 'title'
                }
            },
            {
                type: 'richText',
                props: {
                    key: 'price'
                }
            },
            {
                type: 'images',
                props: {
                    key: 'src'
                }
            },
        ]
    }
];

const defaultResourceScreens = defaultResources.map((resource, i) => {
    return {
        id : 100000 + i,
        type: 'resource',
        title: `${capitalize(resource.nameSingle)} screen`,
        name: resource.name,
        components: resource.defaultComponents,
        localResources: [
            {
                id: 1,
                game: 'ShapeRecognition',
            },
            {
                id: 2,
                game: 'HiddenImagesQuiz',
            },
            {
                id: 3,
                game: 'ShapeRecognition',
            },
            {
                id: 3,
                game: 'ShapeRecognition',
            },
            {
                id: 4,
                game: 'ShapeRecognition',
            },
            {
                id: 5,
                game: 'ShapeRecognition',
            },
            {
                id: 6,
                game: 'ShapeRecognition',
            },
        ]
    }
});

const defaultGameScreens = {
    startScreenId: 1,
    items: [
        {
            id: 1,
            name: 'Start page',
            type: 'static',
            components: [
                {
                    type: 'title',
                    props: {
                        title: 'All games'
                    }
                },
                {
                    type: 'overview',
                    props: {
                        resource: 'game',
                        amount: 12,
                        titleKey: 'first_name',
                        backgroundImageKey: 'avatar'
                    }
                }
            ]
        },
        ...defaultResourceScreens
    ],
}