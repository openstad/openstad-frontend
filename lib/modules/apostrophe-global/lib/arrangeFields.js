module.exports = [
    {
        name: 'general',
        label: 'Algemeen',
        fields: ['siteTitle', 'hideSiteTitle', 'analytics', 'tagmanager', 'showAdminBar', 'fbImage', 'favicon']
    },
    {
        name: 'api',
        label: 'Url & api instellingen',
        fields: ['siteId', 'ideaSlug', 'ideaOverviewSlug', 'editIdeaUrl', 'cacheIdeas']
    },

    {
        name: 'cookie',
        label: 'Cookie instellingen',
        fields: ['useCookieWarning', 'cookiePageLink']
    },
    {
        name: 'ideas',
        label: 'Idea instellingen',
        fields: ['canAddNewIdeas', 'titleMinLength']
    },
    {
        name: 'design',
        label: 'Vormgeving',
        fields: ['siteLogo', 'logoLink', 'stylesheets', 'inlineCss']
    },
    {
        name: 'footer',
        label: 'Footer',
        fields: ['footer']
    },
    {
        name: 'map',
        label: 'Map',
        fields: ['mapCenterLat', 'mapCenterLng', 'mapZoomLevel', 'openstreetmapsServerUrl', 'mapPolygonsKey', 'mapImageFlag', 'mapUploadedFlag', 'mapFlagWidth', 'mapFlagHeight']
    },
    {
        name: 'mainMenu',
        label: 'Hoofdmenu',
        fields: ['arrangeMainMenu', 'mainMenuItems', 'ctaButtonText', 'ctaButtonUrl', 'topLinks', 'displayMyAcount', 'translations']
    },
    {
        name: 'userRights',
        label: 'Roles & Rights',
        fields: ['roleToLike', 'roleToComment']
    },
    {
        name: 'newsletter',
        label: 'Newsletter',
        fields: ['newsletterModalTitle', 'newsletterModalDescription']
    },
    {
        name: 'vimeo',
        label: 'Vimeo',
        fields: ['vimeoClientId', 'vimeoClientSecret', 'vimeoAcccesToken', 'vimeoEmbedSettings', 'vimeoViewSettings']
    },
];
