const rp = require('request-promise');
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

       try {
         eventEmitter.emit('resourceCrud');
         const apiUrl = self.apos.settings.getOption(req, 'apiUrl');
         const siteId = req.data.global.siteId;

         const postUrl = `${apiUrl}/api/site/${siteId}/user/${req.body.resourceUserId}/do-anonymizeall`;

         // pass along siteIds user selected to also be removed
         const data = {
           onlySiteIds: req.body.sites
         };

         const options = {
           method: 'PUT',
           uri: postUrl,
           headers: self.formatApiHeaders(req.session.jwt),
           body: data,
           json: true // Automatically parses the JSON string in the response
         };

         const result = await rp(options);

         res.setHeader('Content-Type', 'application/json');

         res.end(JSON.stringify({
           'status': 'success'
         }));

       } catch (e) {
         res.setHeader('Content-Type', 'application/json');

         console.warn('Error anonmyzing sites', e);

         res.status(500).end(JSON.stringify({
           msg: e[0]
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
