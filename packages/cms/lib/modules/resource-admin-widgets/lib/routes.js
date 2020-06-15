const { generateCsv, getVotes } = require('./vote-overview');
const rp = require('request-promise');

module.exports = async function(self, options) {

    self.apos.app.get('/plan/votes/download/:ideaId', async function(req, res, next) {

        if (! req.params.ideaId) {
            return res.redirect(req.header('Referer') || '/');
        }

        try {
            const apiUrl = self.apos.settings.getOption(req, 'apiUrl');
            const votes = await getVotes(req, req.params.ideaId, apiUrl);
            const csv = generateCsv(votes);

            const date = new Date();
            const formattedDate = `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`;

            res.contentType('text/csv');
            res.header('Content-Disposition', `attachment; filename="Stemoverzicht van plan #${req.params.ideaId} op ${formattedDate}.csv"`);
            return res.send(Buffer.from(csv));

        } catch (error) {
            console.error(error);
            res.redirect(req.header('Referer') || '/');
        }
    });

    self.route('post', 'delete', (req, res) => {
      const apiUrl = self.apos.settings.getOption(req, 'apiUrl');
      const siteId = req.data.global.siteId;
      const postUrl = `${apiUrl}/api/site/${siteId}/${req.body.resourceType}`;

      rp({
          method: 'DELETE',
          uri: `${postUrl}/${req.body.resourceId}`,
          headers: httpHeaders,
          json: true // Automatically parses the JSON string in the response
      })
      .then(function (response) {
       //  req.flash('success', { msg: 'Verwijderd!'});
       //  res.redirect('/');
         res.setHeader('Content-Type', 'application/json');

         res.end(JSON.stringify({
           id: response.id
         }));
      })
      .catch(function (err) {
         // req.flash('error', { msg: 'Er ging iets mis met verwijderen'});
         // return res.redirect(req.header('Referer')  || appUrl);
         res.status(500).json(JSON.stringify(err));
      });
   });
};
