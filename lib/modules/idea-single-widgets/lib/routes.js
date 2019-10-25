const { generateCsv, getVotes } = require('./vote-overview');

module.exports = async function(self, options) {

    self.apos.app.get('/plan/votes/download/:ideaId', async function(req, res, next) {
        if (! req.params.ideaId) {
            res.status(404).end();
        }

        try {
            const apiUrl = self.apos.settings.getOption(req, 'apiUrl');
            const votes = await getVotes(req, req.params.ideaId, apiUrl);
            const csv = generateCsv(votes);

            res.contentType('text/csv');
            res.send(Buffer.from(csv));

        } catch (error) {
            console.error(error);
            res.status(500).end();
        }
    });
};
