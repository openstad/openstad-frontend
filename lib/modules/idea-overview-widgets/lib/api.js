const rp = require('request-promise');
const moment = require('moment');
const { parse } = require('json2csv');

module.exports = (self, options) => {
  self.addPermissions = () => {
    self.apos.permissions.add({
      value: 'export-idea-overview',
      label: 'Export: Ideas'
    });
  };

  self.addToAdminBar = () => {
    self.apos.adminBar.add(self.__meta.name, 'Export Ideas', 'export-idea-overview', {href: '/ideas/download'});
  };

  self.getIdeas = async (req) => {
    const apiUrl = self.apos.settings.getOption(req, 'apiUrl');
    const sort = req.query.sort ? req.query.sort : 'createdate_desc';

    return rp({
      uri: `${apiUrl}/api/site/${req.data.global.siteId}/idea?sort=${sort}&includeUser=1&includeVoteCount=1&includeUserVote=1`,
      headers: {
        'Accept': 'application/json',
        "Cache-Control": "no-cache"
      },
      json: true
    });
  };

  self.generateCsv = (ideas) => {
    const fields = ['titel', 'locatie', 'aangemaakt', 'thema'];
    const options = { fields };

    const mappedIdeas = ideas.map((idea) => {
      return {
        'titel': idea.title,
        'locatie': idea.location.coordinates[0] + ', ' + idea.location.coordinates[1],
        'aangemaakt': moment(idea.createdAt).format('DD-MM-YYYY HH:mm'),
        'thema': idea.extraData.theme || ''
      }
    });

    return parse(mappedIdeas, options);
  };
};
