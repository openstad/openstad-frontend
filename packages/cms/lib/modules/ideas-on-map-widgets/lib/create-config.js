const sortingOptions = require('../../../../config/sorting.js').ideasOnMapOptions;
const ideaForm = require('./idea-form');

module.exports = function createConfig(widget, data, jwt, apiUrl, loginUrl, imageProxy, apos) {

  let contentConfig = {
    ignoreReactionsForIdeaIds: widget.ignoreReactionsForIdeaIds,
  };
  if (widget.noSelectionHTML) contentConfig.noSelectionHTML = widget.noSelectionHTML; // tmp voor oude data
  if (widget.noSelectionLoggedInHTML) contentConfig.noSelectionLoggedInHTML = widget.noSelectionLoggedInHTML;
  if (widget.noSelectionNotLoggedInHTML) contentConfig.noSelectionNotLoggedInHTML = widget.noSelectionNotLoggedInHTML;
  if (widget.selectionActiveLoggedInHTML) contentConfig.selectionActiveLoggedInHTML = widget.selectionActiveLoggedInHTML;
  if (widget.selectionInactiveLoggedInHTML) contentConfig.selectionInactiveLoggedInHTML = widget.selectionInactiveLoggedInHTML;
  if (widget.mobilePreviewLoggedInHTML) contentConfig.mobilePreviewLoggedInHTML = widget.mobilePreviewLoggedInHTML;
  if (widget.selectionActiveNotLoggedInHTML) contentConfig.selectionActiveNotLoggedInHTML = widget.selectionActiveNotLoggedInHTML;
  if (widget.selectionInactiveNotLoggedInHTML) contentConfig.selectionInactiveNotLoggedInHTML = widget.selectionInactiveNotLoggedInHTML;
  if (widget.mobilePreviewNotLoggedInHTML) contentConfig.mobilePreviewNotLoggedInHTML = widget.mobilePreviewNotLoggedInHTML;
  contentConfig.showNoSelectionOnMobile = widget.showNoSelectionOnMobile;

  // image settings; todo: deze moeten syncen naar de api en dan moet de voorwaardelijkheid omgedraaid
  let allowMultipleImages = typeof widget.imageAllowMultipleImages != 'undefined' ? widget.imageAllowMultipleImages : ( ( data.global.siteConfig && data.global.siteConfig.ideas && typeof data.global.siteConfig.ideas.allowMultipleImages != 'undefined' ) ? data.global.siteConfig.ideas.allowMultipleImages : false );
  let placeholderImageSrc = typeof widget.imagePlaceholderImageSrc != 'undefined' ? apos.attachments.url(widget.imagePlaceholderImageSrc) : ( ( data.global.siteConfig && data.global.siteConfig.ideas && typeof data.global.siteConfig.ideas.placeholderImageSrc != 'undefined' ) ? data.global.siteConfig.ideas.placeholderImageSrc : undefined );
  
  let themeTypes;
  try {
    themeTypes = data.global.themes || [];
    themeTypes = themeTypes.map(type => { return {
      name: type.value,
      color: type.color,
      mapicon: JSON.parse(type.mapicon),
      listicon: JSON.parse(type.listicon || '{}'),
    }})
  } catch (err) {}
  let ideaTypes = data.global.siteConfig && data.global.siteConfig.ideas && typeof data.global.siteConfig.ideas.types != 'undefined' ? data.global.siteConfig.ideas.types : undefined;
  let typeField = widget.typeField || 'typeId';
  let types = typeField == 'typeId' ? ideaTypes : themeTypes;

  let mapLocationIcon = widget.mapLocationIcon;
  try {
    mapLocationIcon = JSON.parse(mapLocationIcon);
  } catch (err) {}

  let config = {
    // data.isAdmin
    divId: 'ideeen-op-de-kaart',
    siteId: data.global.siteId,
    api: {
      url: apiUrl,
      headers: jwt ? { 'X-Authorization': 'Bearer ' + jwt } : [],
      isUserLoggedIn: data.loggedIn,
    },
    user: {
      role:  data.openstadUser && data.openstadUser.role,
      displayName:  data.openstadUser && data.openstadUser.displayName,
    },

		display: {
      type: widget.displayType,
		  width: widget.displayWidth,
		  height: widget.displayHeight,
    },

    loginUrl,

		linkToCompleteUrl: widget.linkToCompleteUrl && data.siteUrl + widget.linkToCompleteUrl,

    canSelectLocation: widget.canSelectLocation,
    onMarkerClickAction: widget.onMarkerClickAction,
    startWithListOpenOnMobile: widget.startWithListOpenOnMobile,

    linkToUserPageUrl: widget.linkToUserPageUrl && data.siteUrl + widget.linkToUserPageUrl,

    search: {
      searchIn: { 'ideas and addresses': ['ideas', 'addresses'], 'ideas': ['ideas'], 'addresses': ['addresses'], 'none': [] }[ widget.searchIn ] || [],
      placeholder: widget.searchPlaceHolder,
      showButton: true,  // todo: naar settings?
      showSuggestions: true,  // todo: naar settings?
      defaultValue: '',  // todo: naar settings?
      addresssesMunicipality: widget.searchAddresssesMunicipality || null,
    },

    content: contentConfig,
    ideaName: widget.ideaName,

    typeField,
    types,
    filter: [{
      label: '',
      showFilter: true,
      fieldName: typeField,
      filterOptions: [{ value: '', label: widget.typesFilterLabel }].concat( types && types.map(function(type) { return { value: type.id, label: type.label || type.name } }) ),
      defaultValue: '',
    }],

    sort: {
      sortOptions: widget.selectedSorting ? widget.selectedSorting.map(key => sortingOptions.find(option => option.value == key ) ) : [],
      showSortButton: widget.selectedSorting && widget.selectedSorting.length ? true : false,
      defaultValue: widget.defaultSorting,
    },

    image: {
      server: {
				process: imageProxy,
				fetch: process.env.IMAGE_API_URL,
        srcExtension: '/:/rs=w:[[width]],h:[[height]];cp=w:[[width]],h:[[height]]',
      },
      aspectRatio: widget.imageAspectRatio || '16x9',
      allowMultipleImages,
      placeholderImageSrc,
    },
    
		idea: {
      formUrl: widget.formUrl && data.siteUrl + widget.formUrl,
      showVoteButtons: data.global.siteConfig && data.global.siteConfig.ideas && typeof data.global.siteConfig.ideas.showVoteButtons != 'undefined' ? data.global.siteConfig.ideas.showVoteButtons : true,
      showLabels: data.global.siteConfig && data.global.siteConfig.ideas && typeof data.global.siteConfig.ideas.showLabels != 'undefined' ? data.global.siteConfig.ideas.showLabels : true,
      canAddNewIdeas: data.global.siteConfig && data.global.siteConfig.ideas && typeof data.global.siteConfig.ideas.canAddNewIdeas != 'undefined' ? data.global.siteConfig.ideas.canAddNewIdeas : true,
			titleMinLength: ( data.global.siteConfig && data.global.siteConfig.ideas && data.global.siteConfig.ideas.titleMinLength ) || 30,
			titleMaxLength: ( data.global.siteConfig && data.global.siteConfig.ideas && data.global.siteConfig.ideas.titleMaxLength ) || 200,
			summaryMinLength: ( data.global.siteConfig && data.global.siteConfig.ideas && data.global.siteConfig.ideas.summaryMinLength ) || 30,
			summaryMaxLength: ( data.global.siteConfig && data.global.siteConfig.ideas && data.global.siteConfig.ideas.summaryMaxLength ) || 200,
			descriptionMinLength: ( data.global.siteConfig && data.global.siteConfig.ideas && data.global.siteConfig.ideas.descriptionMinLength ) || 30,
			descriptionMaxLength: ( data.global.siteConfig && data.global.siteConfig.ideas && data.global.siteConfig.ideas.descriptionMaxLength ) || 200,
			allowMultipleImages,
      fields: ideaForm.getWidgetFormFields(widget),
      shareChannelsSelection: widget.showShareButtons ? widget.shareChannelsSelection : [],
      metaDataTemplate: widget.metaDataTemplate,
		},

    poll: data.global.siteConfig && data.global.siteConfig.polls,

    argument: {
      isActive: widget.showReactions,
      title: widget.reactionsTitle,
      formIntro: widget.reactionsFormIntro,
      placeholder: widget.reactionsPlaceholder,
			descriptionMinLength: ( data.global.siteConfig && data.global.siteConfig.arguments && data.global.siteConfig.arguments.descriptionMinLength ) || 30,
			descriptionMaxLength: ( data.global.siteConfig && data.global.siteConfig.arguments && data.global.siteConfig.arguments.descriptionMaxLength ) || 100,
      isClosed: typeof widget.reactionsClosed != 'undefined' ? !!widget.reactionsClosed : (data.global.siteConfig && data.global.siteConfig.arguments && typeof data.global.siteConfig.arguments.isClosed != 'undefined' ? data.global.siteConfig.arguments.isClosed : false),
      closedText: typeof widget.reactionsClosedText != 'undefined' ? widget.reactionsClosedText : (data.global.siteConfig && data.global.siteConfig.arguments && typeof data.global.siteConfig.arguments.closedText != 'undefined' ? data.global.siteConfig.arguments.closedText : true),
      closeReactionsForIdeaIds: widget.reactionsClosed === '' && widget.closeReactionsForIdeaIds || '',
		},

    map: {
      variant: widget.mapVariant,
      mapTilesUrl: widget.mapTilesUrl,
      mapTilesSubdomains: widget.mapTilesSubdomains,
      zoom: 16,
      clustering: {
        isActive: true, // widget.mapClustering,
        maxClusterRadius: widget.mapMaxClusterRadius,
      },
      locationIcon: mapLocationIcon,
      autoZoomAndCenter: widget.mapAutoZoomAndCenter,
      polygon: data.global.mapPolygons || ( data.global.siteConfig && data.global.siteConfig.openstadMap && data.global.siteConfig.openstadMap.polygon ) || undefined,
      showCoverageOnHover: false,
		},

    vote: {
      isViewable: data.global.siteConfig && data.global.siteConfig.votes && data.global.siteConfig.votes.isViewable,
      isActive: data.global.siteConfig && data.global.siteConfig.votes && data.global.siteConfig.votes.isActive,
      isActiveFrom: data.global.siteConfig && data.global.siteConfig.votes && data.global.siteConfig.votes.isActiveFrom,
      isActiveTo: data.global.siteConfig && data.global.siteConfig.votes && data.global.siteConfig.votes.isActiveTo,
      requiredUserRole: data.global.siteConfig && data.global.siteConfig.votes && data.global.siteConfig.votes.requiredUserRole || 'admin',
      voteType: data.global.siteConfig && data.global.siteConfig.votes && data.global.siteConfig.votes.voteType,
      voteValues: data.global.siteConfig && data.global.siteConfig.votes && data.global.siteConfig.votes.voteValues,
    },

  }

  return config;

}
