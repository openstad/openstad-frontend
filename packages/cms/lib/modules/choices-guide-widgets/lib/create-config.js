module.exports = function createConfig({ widget, data }) {

  let config = {

    divId: 'osc-choices-guide',

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
      aspectRatio: widget.imageAspectRatio || '16x9',
    },
  }

  return config;

}
