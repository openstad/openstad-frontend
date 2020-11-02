const sortingOptions  = require('../../../../config/sorting.js').ideasOnMapOptions;

module.exports = function createConfig(widget, data, jwt, apiUrl) {

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

  // allowMultipleImages to formfields
  let formFields = [ ...widget.formFields ];
  let allowMultipleImages = ( data.global.siteConfig && data.global.siteConfig.ideas && data.global.siteConfig.ideas.allowMultipleImages ) || false;
  formFields.forEach((formField) => {
    if ( formField.inputType ==  "image-upload" ) {
      formField.allowMultiple = allowMultipleImages;
    }
  });

  let themeTypes;
  try {
    themeTypes = data.global.themes || [];
    themeTypes = themeTypes.map(type => { return {
      name: type.value,
      color: type.color,
      mapicon: JSON.parse(type.mapicon),
      listicon: JSON.parse(type.listicon || '{}'),
    }})
  } catch (err) {
  }

  let ideaTypes = data.global.siteConfig && data.global.siteConfig.ideas && typeof data.global.siteConfig.ideas.types != 'undefined' ? data.global.siteConfig.ideas.types : undefined;

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
      fullName:  data.openstadUser && (data.openstadUser.fullName || data.openstadUser.firstName + ' ' + data.openstadUser.lastName)
    },

		displayType: widget.displayType,
		displayWidth: widget.displayWidth,
		displayHeight: widget.displayHeight,
		linkToCompleteUrl: widget.linkToCompleteUrl,

    canSelectLocation: widget.canSelectLocation,
    startWithListOpenOnMobile: widget.startWithListOpenOnMobile,

    linkToUserPageUrl: widget.linkToUserPageUrl,

    content: contentConfig,
    ideaName: widget.ideaName,
    typeField: widget.typeField,
    types: widget.typeField == 'typeId' ? ideaTypes : themeTypes,
    typeLabel: widget.typeLabel,
    typesFilterLabel: widget.typesFilterLabel,
		idea: {
      formUrl: widget.formUrl,
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
      imageserver: {
        // TODO: hij staat nu zonder /image in de .env van de frontend, maar daar zou natuurlijk de hele url moeten staan
				process: '/image',
				fetch: '/image',
      },
      fields: formFields,
      shareChannelsSelection: widget.showShareButtons ? widget.shareChannelsSelection : [],
      sort: {
        sortOptions: widget.selectedSorting ? widget.selectedSorting.map(key => sortingOptions.find(option => option.value == key ) ) : [],
        showSortButton: widget.selectedSorting && widget.selectedSorting.length ? true : false,
        defaultSortOrder: widget.defaultSorting,
      }
		},
		poll: data.global.siteConfig && data.global.siteConfig.polls,
		argument: {
      isActive: widget.showReactions,
      isClosed: data.global.siteConfig && data.global.siteConfig.arguments && typeof data.global.siteConfig.arguments.isClosed != 'undefined' ? data.global.siteConfig.arguments.isClosed : false,
      closedText: data.global.siteConfig && data.global.siteConfig.arguments && typeof data.global.siteConfig.arguments.closedText != 'undefined' ? data.global.siteConfig.arguments.closedText : true,
      title: widget.reactionsTitle,
      formIntro: widget.reactionsFormIntro,
      placeholder: widget.reactionsPlaceholder,
			descriptionMinLength: ( data.global.siteConfig && data.global.siteConfig.arguments && data.global.siteConfig.arguments.descriptionMinLength ) || 30,
			descriptionMaxLength: ( data.global.siteConfig && data.global.siteConfig.arguments && data.global.siteConfig.arguments.descriptionMaxLength ) || 100,
      closeReactionsForIdeaIds: widget.closeReactionsForIdeaIds,
		},
		map: {
      variant: widget.mapVariant,
      zoom: 16,
      clustering: {
        isActive: true, // widget.mapClustering,
        maxClusterRadius: widget.mapMaxClusterRadius,
      },
      autoZoomAndCenter: widget.mapAutoZoomAndCenter,
      polygon: ( data.global.siteConfig && data.global.siteConfig.openstadMap && data.global.siteConfig.openstadMap.polygon ) || undefined,
      showCoverageOnHover: false,
		}
  }

  return config;

}
