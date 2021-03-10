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
      fullName:  data.openstadUser && (data.openstadUser.fullName || data.openstadUser.firstName + ' ' + data.openstadUser.lastName)
		},
    choicesGuideId: widget.choicesGuideId,
    noOfQuestionsToShow: widget.noOfQuestionsToShow,
    choices: {
      type: widget.choicesType,
      startWithAllQuestionsAnswered: widget.startWithAllQuestionsAnswered,
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
    imageserver: {
			process: '/image',
			fetch: '/image',
    },
  }

  return config;

}
