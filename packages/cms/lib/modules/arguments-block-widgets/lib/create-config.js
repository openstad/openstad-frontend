module.exports = function createConfig({ widget, data, apos }) {

  let userNameFields = ["displayName"];

  let config = {

    divId: 'openstad-component-reactions-' + parseInt(Math.random() * 1000000).toString(),
    ideaId: 0,

    sentiment: widget.sentiment,
    isReplyingEnabled: widget.isReplyingEnabled,
    isVotingEnabled: widget.isVotingEnabled,

    title: widget.title,
    emptyListText: widget.emptyListText,
    userNameFields,

    formIntro: widget.formIntro,
    placeholder: widget.placeholder,

    isClosed: typeof widget.isClosed != 'undefined' ? !!widget.isClosed : (data.global.siteConfig && data.global.siteConfig.arguments && typeof data.global.siteConfig.arguments.isClosed != 'undefined' ? data.global.siteConfig.arguments.isClosed : false),
    closedText: typeof widget.closedText != 'undefined' ? widget.closedText : (data.global.siteConfig && data.global.siteConfig.arguments && typeof data.global.siteConfig.arguments.closedText != 'undefined' ? data.global.siteConfig.arguments.closedText : true),

		descriptionMinLength: ( data.global.siteConfig && data.global.siteConfig.arguments && data.global.siteConfig.arguments.descriptionMinLength ) || 30,
		descriptionMaxLength: ( data.global.siteConfig && data.global.siteConfig.arguments && data.global.siteConfig.arguments.descriptionMaxLength ) || 100,

  }

  return config;

}
