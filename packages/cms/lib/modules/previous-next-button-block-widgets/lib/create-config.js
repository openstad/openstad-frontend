module.exports = function createConfig({ widget, data }) {

  let config = {

    divId: 'osc-previous-next-button-block',

    previousUrl: widget.previousUrl && data.siteUrl + widget.previousUrl,
    previousLabel: widget.previousLabel,
    nextUrl: widget.nextLabel && data.siteUrl + widget.nextUrl,
    nextLabel: widget.nextLabel,

	}

  return config;

}
