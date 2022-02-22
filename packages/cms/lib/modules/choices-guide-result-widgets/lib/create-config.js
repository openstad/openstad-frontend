module.exports = function createConfig({ widget, data, logoutUrl }) {

  let requireLoginSettings;
  requireLoginSettings = {};
  if (widget.requireLoginTitle) requireLoginSettings.title = widget.requireLoginTitle;
  if (widget.requireLoginDescription) requireLoginSettings.description = widget.requireLoginDescription;
  if (widget.requireLoginButtonTextLogin) requireLoginSettings.buttonTextLogin = widget.requireLoginButtonTextLogin;
  if (widget.requireLoginButtonTextLoggedIn) requireLoginSettings.buttonTextLoggedIn = widget.requireLoginButtonTextLoggedIn;
  if (widget.requireLoginButtonTextAlreadySubmitted) requireLoginSettings.buttonTextAlreadySubmitted = widget.requireLoginButtonTextAlreadySubmitted;
  if (widget.requireLoginChangeLoginLinkText) requireLoginSettings.changeLoginLinkText = widget.requireLoginChangeLoginLinkText;
  if (widget.requireLoginLoggedInMessage) requireLoginSettings.loggedInMessage = widget.requireLoginLoggedInMessage;
  if (widget.requireLoginNotYetLoggedInError) requireLoginSettings.notYetLoggedInError = widget.requireLoginNotYetLoggedInError;
  if (widget.requireLoginAlreadySubmittedMessage) requireLoginSettings.alreadySubmittedMessage = widget.requireLoginAlreadySubmittedMessage;

  let config = {

    divId: 'osc-choices-guide-result',

    choicesGuideId: widget.choicesGuideId,
    questionGroupId: widget.questionGroupId,
    startWithAllQuestionsAnswered: widget.startWithAllQuestionsAnswered,
    choices: {
      type: widget.choicesType,
      title: {
        preference: widget.choicesPreferenceTitle,
        inBetween: widget.choicesInBetweenPreferenceTitle,
      },
      barColor: { min: widget.choicesPreferenceMinColor || null, max: widget.choicesPreferenceMaxColor || null },
      minLabel: widget.choicesMinLabel,
      maxLabel: widget.choicesMaxLabel,
      withPercentage: widget.choicesWithPercentage,
    },
    logoutUrl,
    moreInfoUrl: widget.moreInfoUrl && data.siteUrl + widget.moreInfoUrl,
    moreInfoLabel: widget.moreInfoLabel,
    beforeUrl: widget.beforeUrl && data.siteUrl + widget.beforeUrl,
    beforeLabel: widget.beforeLabel,
    afterUrl: widget.afterUrl && data.siteUrl + widget.afterUrl,
    afterLabel: widget.afterLabel,
    submission: {
      type: widget.submissionType,
      form: {
        title: widget.formTitle,
        intro: widget.formIntro,
        fields: widget.formFields,
      },
      requireLogin: widget.requireLogin,
      requireLoginSettings,
    },
    preferenceTitle: widget.preferenceTitle,
  }
  
  return config;

}
