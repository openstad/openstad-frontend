module.exports = [
    {
        name: 'general',
        label: 'Algemene instellingen',
        fields: ['siteTitle', 'hideSiteTitle', 'showAdminBar', 'fbImage', 'favicon', 'modbreakAuthor'],
    },
    {
        name: 'analytics',
        label: 'Analytics',
        fields: ['analyticsType', 'analyticsIdentifier', 'analyticsCodeBlock', 'tagmanager']
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
        fields: ['siteLogo', 'logoLink', 'stylesheets', 'inlineCss', 'applyPaletteStyling']
    },
    {
        name: 'footer',
        label: 'Footer',
        fields: ['footer']
    },
    {
        name: 'map',
        label: 'Map',
        fields: ['mapCenterLat', 'mapCenterLng', 'mapZoomLevel', 'openstreetmapsServerUrl', 'mapPolygonsKey', 'mapUploadedFlag', 'mapFlagWidth', 'mapFlagHeight']
    },
    {
        name: 'mainMenu',
        label: 'Hoofdmenu',
        fields: ['arrangeMainMenu', 'displayLoginTopLink', 'mainMenuItems', 'ctaButtonText', 'ctaButtonUrl', 'topLinks', 'displayMyAcount', "myAccountButtonText", 'shouldAutoTranslate']
    },
    {
        name: 'userRights',
        label: 'Roles & Rights',
        fields: ['roleToLike', 'roleToComment']
    },
    {
        name: 'newsletter',
        label: 'Newsletter',
        fields: ['newsletterModalTitle', 'newsletterModalDescription', 'newsletterModalFormFields', 'newsletterModalSubmit', 'newsletterModalCancel', 'useCaptchaForNewsletter', 'captchaLabel', 'captchaRefreshText']
    },
    {
        name: 'themes-areas',
        label: 'Themes, areas & idea types',
        fields: ['themes', 'areas', 'ideaTypes']
    },

    // this is a bit of a hack. We hide the section link with CSS
    // We're adding formattedFields that get formatted after save, meant for syncing to site siteConfig
    // In future we either make "proper" invisible schema fields
    // or we move these fields to different editor so syncing is not necessary anymore
    {
        name: 'formattedfields',
        label: 'Formatted (system use only, visible for debugging, will be hidden in future)',
        fields: ['formattedPaletteCSS', 'formattedLogo']
    },
];
