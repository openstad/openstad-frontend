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
        fields: ['siteLogo', 'logoLink', 'stylesheets', 'inlineCss', 'iconTheme']
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
        fields: ['logoPlacement', 'arrangeMainMenu', 'displayLoginTopLink', 'displayCart', 'mainMenuItems', 'ctaButtonText', 'ctaButtonUrl', 'topLinks', 'displayMyAcount', 'translations', 'textLogin', 'textLogout']
    },
    {
        name: 'userRights',
        label: 'Roles & Rights',
        fields: ['roleToLike', 'roleToComment']
    },
    {
        name: 'newsletter',
        label: 'Newsletter',
      fields: ['newsletterModalTitle', 'newsletterModalDescription', 'newsletterModalFormFields', 'newsletterModalSubmit', 'newsletterModalCancel', 'captchaLabel', 'captchaRefreshText']
    },
    {
        name: 'vimeo',
        label: 'Vimeo',
        fields: ['vimeoClientId', 'vimeoClientSecret', 'vimeoAcccesToken', 'vimeoEmbedSettings', 'vimeoViewSettings']
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
