const { parse } = require('json2csv');
const rp = require('request-promise');

module.exports = {
    generateCsv: (votes) => {
        const fields = ['id', 'ideaId', 'userId', 'confirmed', 'opinion', 'ip', 'createdAt'];
        const options = { fields };

        return parse(votes, options);
    },
    getVotes: async (req, ideaId, apiUrl) => {
        const jwt = req.session.jwt;

        return rp({
            uri: `${apiUrl}/api/site/${req.data.global.siteId}/vote?ideaId=${ideaId}`,
            headers: {
                'Accept': 'application/json',
                "X-Authorization" : `Bearer ${jwt}`,
                "Cache-Control": "no-cache"
            },
            json: true
        });
    }
};
