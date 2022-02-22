module.exports = function createConfig({ widget, data, jwt, apiUrl, loginUrl, imageProxy, apos }) {

  let config = {

    divId: 'osc-component',
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

    loginUrl,

		linkToCompleteUrl: widget.linkToCompleteUrl && data.siteUrl + widget.linkToCompleteUrl,

    image: {
      server: {
				process: imageProxy,
				fetch: imageProxy,
        srcExtension: '/:/rs=w:[[width]],h:[[height]];cp=w:[[width]],h:[[height]]',
      },
      aspectRatio: widget.imageAspectRatio || '16x9',
      allowMultipleImages: false,
    },
    

  }

  return config;

}
