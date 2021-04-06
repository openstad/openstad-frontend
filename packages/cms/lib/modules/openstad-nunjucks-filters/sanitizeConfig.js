const remoteURL = /^(?:\/\/)|(?:\w+?:\/{0,2})/;

module.exports = {
	allowedTags: [
		// Content sectioning
		'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'nav', 'section',
		// Text content
		'center', 'dd', 'div', 'dl', 'dt', 'figcaption', 'figure', 'hr',
		'li', 'ol', 'p', 'pre', 'ul',
		// Inline text semantics
		'a', 'b', 'big', 'blockquote', 'br', 'cite', 'code', 'em', 'i',
		'mark', 'q', 's', 'strike', 'small', 'span', 'strong', 'sub', 'u',
		'var',
		// Demarcating edits
		'del', 'ins',
		// Image and multimedia
		'audio', 'img', 'video',
		// Table content
		'caption', 'col', 'colgroup', 'table', 'tbody', 'td', 'tfoot', 'th',
		'thead', 'tr'
	],
	allowedAttributes: {
		'*' : ['align', 'alt', 'bgcolor', 'center', 'class', 'data-*', 'name', 'title'],
		a   : ['href', 'name', 'rel', 'target'],
		img : ['height', 'src', 'width']
	},
	// allowedClasses: {
	// 	'p': [ 'fancy', 'simple' ]
	// },
	allowedSchemes: ['http', 'https', 'ftp', 'mailto', 'tel'],
	transformTags: {
		a: function( tagName, attrs ) {

			if( attrs && attrs.href && remoteURL.test(attrs.href) ) {
				attrs.target = '_blank';
				attrs.rel    = 'noreferrer noopener';
			}
			return {tagName: tagName, attribs: attrs};
		},
	}
};
