const { generateCsv, getVotes } = require('./vote-overview');
const fetch = require('node-fetch');
const eventEmitter  = require('../../../../events').emitter;
const toSqlDatetime = (inputDate) => {
    const date = new Date()
    const dateWithOffest = new Date(date.getTime() - (date.getTimezoneOffset() * 60000))
    return dateWithOffest
        .toISOString()
        .slice(0, 19)
        .replace('T', ' ')
}


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


     // Almost identical  to proxy,
     // Server side validation is done by the API
     // In future form can probably talk directly with api proxy,
     self.route('post', 'update', async (req, res) => {

       const postUrl = `${self.formatApiUrl(req)}/${req.body.resourceId}`;
       const data = {};

       if (req.body.status) {
         data.status = req.body.status;
       }

       if (req.body.modBreak) {
         var datetime = new Date();

         data.modBreak = req.body.modBreak;
         data.modBreakUserId = req.data.openstadUser.id;
         data.modBreakDate = req.body.modBreakDate ? req.body.modBreakDate : toSqlDatetime();
       }

       try {
         let response = await fetch(postUrl, {
           headers: self.formatApiHeaders(req.session.jwt),
           method: 'PUT',
           body: JSON.stringify(data),
         })
         if (!response.ok) {
           console.log(response);
           throw new Error('Fetch failed')
         }
         let result = await response.json();

         //  req.flash('success', { msg: 'Verwijderd!'});
         //  res.redirect('/');
         res.setHeader('Content-Type', 'application/json');

         eventEmitter.emit('apiPost');

         res.end(JSON.stringify({
           id: result.id
         }));

       } catch(err) {
         // req.flash('error', { msg: 'Er ging iets mis met verwijderen'});
         // return res.redirect(req.header('Referer')  || appUrl);
         console.log('err', err)
         res.status(500).json(JSON.stringify(err));
       };
    });


   // Almost identical  to proxy,
   // Server side validation is done by the API
   // In future form move to api proxy
   self.route('post', 'delete', async function(req, res) {
     const postUrl = `${self.formatApiUrl(req)}/${req.body.resourceId}`;

     eventEmitter.emit('apiPost');

     try {
       let response = await fetch(postUrl, {
         headers: self.formatApiHeaders(req.session.jwt),
         method: 'DELETE',
       })
       if (!response.ok) {
         console.log(response);
         throw new Error('Fetch failed')
       }
       let result = await response.json();
        res.setHeader('Content-Type', 'application/json');
        eventEmitter.emit('apiPost');

        res.end(JSON.stringify({
          id: result.id
        }));
     } catch(err) {
      // req.flash('error', { msg: 'Er ging iets mis met verwijderen'});
      // return res.redirect(req.header('Referer')  || appUrl);
      res.status(500).json(JSON.stringify(err));
     };
   });

   self.formatApiUrl = (req) => {
     const apiUrl = self.apos.settings.getOption(req, 'apiUrl');
     const siteId = req.data.global.siteId;
     return `${apiUrl}/api/site/${siteId}/${req.body.resourceEndPoint ? req.body.resourceEndPoint : req.body.resourceType}`;
   }

   self.formatApiHeaders = (jwt) => {
     return {
         'Accept': 'application/json',
         "X-Authorization" : `Bearer ${jwt}`,
     };
   }
};
