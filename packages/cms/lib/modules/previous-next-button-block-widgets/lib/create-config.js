module.exports = function createConfig({ widget, data }) {

  let config = {

    divId: 'ocs-previous-next-button-block-' + parseInt(Math.random() * 1000000).toString(),

    previousUrl: widget.previousUrl && data.siteUrl + widget.previousUrl,
    previousLabel: widget.previousLabel,
    nextUrl: widget.nextLabel && data.siteUrl + widget.nextUrl,
    nextLabel: widget.nextLabel,

	}

  return config;

}
