/**
 * Overwrite Apostrophe template in order to add our sanitize filter,
 * See openstad nunjucks filters for details
 * This was initially done to dynamically add sitefilters
 */


module.exports = {
    styles: [
        { element: 'p', name: 'Paragraph' },
        {
            element: 'p',
            name: 'Introduction text',
            attributes: { class: 'introduction-text' }
        }
    ],
    sanitizeHtml: {
        allowedClasses: {
            'p': [ 'introduction-text' ]
        }
    },
    improve: 'apostrophe-rich-text-widgets',
};
