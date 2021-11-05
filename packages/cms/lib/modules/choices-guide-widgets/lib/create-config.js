module.exports = function createConfig(widget, data, jwt, apiUrl, loginUrl) {

  let config = {
    // data.isAdmin
    divId: 'choices-guide',
    siteId: data.global.siteId,
    api: {
      url: apiUrl,
      headers: jwt ? { 'X-Authorization': 'Bearer ' + jwt } : {},
      isUserLoggedIn: data.loggedIn,
    },
    user: {
      role:  data.openstadUser && data.openstadUser.role,
      displayName:  data.openstadUser && data.openstadUser.displayName,
		},
    choicesGuideId: widget.choicesGuideId,
    noOfQuestionsToShow: widget.noOfQuestionsToShow,
    startWithAllQuestionsAnswered: widget.startWithAllQuestionsAnswered,
    startWithAllQuestionsAnsweredAndConfirmed: widget.startWithAllQuestionsAnsweredAndConfirmed,
    choices: {
      type: widget.choicesType,
      sticky: {
        offsetTop: 10,
      },
      title: {
        preference: widget.choicesPreferenceTitle,
        noPreferenceYet: widget.choicesNoPreferenceYetTitle,
        inBetween: widget.choicesInBetweenPreferenceTitle,
      },
      barColor: { min: widget.choicesPreferenceMinColor || null, max: widget.choicesPreferenceMaxColor || null },
    },
    beforeUrl: widget.beforeUrl && data.siteUrl + widget.beforeUrl,
    afterUrl: widget.afterUrl && data.siteUrl + widget.afterUrl,
    image: {
      server: {
				process: '/image',
				fetch: '/image',
        srcExtension: '/:/rs=w:[[width]],h:[[height]];cp=w:[[width]],h:[[height]]',
      },
      aspectRatio: widget.imageAspectRatio || '16x9',
      allowMultipleImages: false,
    },
  }

  return config;

}
