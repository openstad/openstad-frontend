const request = require('request-promise');

module.exports = (self, options) => {

    self.ideas = null;

    self.getSite = (siteId) => {

    };

    self.getAllIdeas = async (req, siteId, sort) => {
        const apiUrl = process.env.INTERNAL_API_URL || req.data.apiUrl;
        if(self.ideas) {
            console.log('already have the ideas promise');
            return self.ideas;
        }

        const options = {
            uri: `${apiUrl}/api/site/${siteId}/idea?sort=${sort}&includeVoteCount=1&includeUserVote=1`,
            headers: {
                'Accept': 'application/json',
            },
            json: true
        };

        self.ideas = request(options);

        return self.ideas;
    };

    self.updateSite = async (req, siteId, data) => {

        const apiUrl = self.apos.settings.getOption(req, 'apiUrl');

        const options = {
            method: 'PUT',
            uri:  apiUrl + `/api/site/${siteId}`,
            headers: {
                'Accept': 'application/json',
                "X-Authorization" : ` Bearer ${req.session.jwt}`,
            },
            body: data,
            json: true // Automatically parses the JSON string in the response
        };

        console.log(options);
        return request(options);
    };
};
