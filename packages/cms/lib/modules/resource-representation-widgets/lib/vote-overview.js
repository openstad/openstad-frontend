const { parse } = require('json2csv');
const fetch = require('node-fetch');
const moment = require('moment');
module.exports = {
    generateCsv: (votes) => {
        const fields = ['Vote ID', 'User ID', 'Mening', 'Postcode', 'IP', 'Datum', 'OK'];

        const mappedVotes = votes.map((vote) => {
            return {
                'Vote ID': vote.id,
                'User ID': vote.userId,
                'Mening': vote.opinion === 'yes' ? 'voor' : 'tegen',
                'Postcode': vote.user.zipCode,
                'IP': vote.ip,
                'Datum': moment(vote.createdAt).format('YYYY-MM-DD HH:mm:ss'),
                'OK': vote.checked === false ? 'N' : 'Y',
            }
        });

        return parse(mappedVotes, { fields });
    },
    getVotes: async (req, ideaId, apiUrl) => {
        const jwt = req.session.jwt;
        try {
            let response = await fetch(`${apiUrl}/api/site/${req.data.global.siteId}/vote?ideaId=${ideaId}&sortBy=id&orderBy=ASC`, {
                headers: {
                    'Accept': 'application/json',
                    "X-Authorization" : `Bearer ${jwt}`,
                    "Cache-Control": "no-cache"
                },
                method: 'GET',
            })
            if (!response.ok) {
                console.log(response);
                throw new Error('Fetch failed')
            }
            return await response.json();
        } catch(err) {
            console.log(err);
        }
    }
};
