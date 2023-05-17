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


module.exports = function(self, options) {

     // Almost identical  to proxy,
     // Server side validation is done by the API
     // In future form can probably talk directly with api proxy,
     self.route('post', 'delete', async (req, res) => {

       // if no sites are selected, but call is made API no deletes user from this site
       // not much fun :), so return an error here
       if (!req.body.sites || req.body.sites.length === 0) {
         res.status(500).end(JSON.stringify({
           msg: 'No site is selected'
         }));

         return;
       }

       eventEmitter.emit('resourceCrud');
       const apiUrl = self.apos.settings.getOption(req, 'apiUrl');
       const siteId = req.data.global.siteId;

       const postUrl = `${apiUrl}/api/site/${siteId}/user/${req.body.resourceUserId}/do-anonymizeall`;

       // pass along siteIds user selected to also be removed
       const data = {
         onlySiteIds: req.body.sites
       };

       try {
         let response = await fetch(postUrl, {
           headers: self.formatApiHeaders(req.session.jwt),
           method: 'PUT',
           body: JSON.stringify(data, null, 2),
         })
         if (!response.ok) {
           console.log(response);
           throw new Error('Fetch failed')
         }
         let result = await response.json();

         res.setHeader('Content-Type', 'application/json');

         res.end(JSON.stringify({
           'status': 'success'
         }));

       } catch(err) {

         res.setHeader('Content-Type', 'application/json');

         console.warn('Error anonmyzing sites', err);

         res.status(500).end(JSON.stringify({
           msg: err[0]
         }));
       }
     });

   self.formatApiHeaders = (jwt) => {
     return {
         'Accept': 'application/json',
         "X-Authorization" : `Bearer ${jwt}`,
     };
   }
};
