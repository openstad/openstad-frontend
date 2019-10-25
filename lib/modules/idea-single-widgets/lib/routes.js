const { generateCsv, getVotes } = require('./vote-overview');

module.exports = async function(self, options) {

    self.apos.app.get('/plan/votes/download/:ideaId', async function(req, res, next) {
        if (req.params.ideaId) {
            res.redirect(req.header('Referer') || '/');
        }

        try {
            const apiUrl = self.apos.settings.getOption(req, 'apiUrl');
            const votes = await getVotes(req, req.params.ideaId, apiUrl);
            const csv = generateCsv(votes);

            const date = new Date();
            const formattedDate = `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`;

            res.contentType('text/csv');
            res.header('Content-Disposition', `attachment; filename="Stemoverzicht van plan #${req.params.ideaId} op ${formattedDate}.csv"`);
            res.send(Buffer.from(csv));

        } catch (error) {
            console.error(error);
            res.redirect(req.header('Referer') || '/');
        }
    });
};
