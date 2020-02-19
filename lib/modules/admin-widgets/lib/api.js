const rp = require('request-promise');
const moment = require('moment');
const { parse } = require('json2csv');

const formatArguments = function(arguments) {
  return arguments.map((argument) => {
    return argument.description;
  }).join('\r');
}

const formatImages = function(images) {
  return images ? images.join(';\r') : '';
}

module.exports = (self, options) => {
  self.getIdeas = async (req) => {
    const apiUrl = self.apos.settings.getOption(req, 'apiUrl');
    const sort = req.query.sort ? req.query.sort : 'createdate_desc';
    const jwt = req.session.jwt;

    return rp({
      uri: `${apiUrl}/api/site/${req.data.global.siteId}/idea?sort=${sort}&includeUser=1&includeVoteCount=1&includeUserVote=1&includeArguments=1`,
      headers: {
        "X-Authorization" : `Bearer ${jwt}`,
        'Accept': 'application/json',
        "Cache-Control": "no-cache"
      },
      json: true
    });
  };

  self.generateCsv = (ideas) => {
    const mappedIdeas = ideas.map((idea) => {
      return {
        'titel': idea.title,
        'indiener': idea.user.fullName,
        'email': idea.user.email,
        'locatie':idea.location && idea.location.coordinates ? idea.location.coordinates[0] + ', ' + idea.location.coordinates[1] : '',
        'aangemaakt': moment(idea.createdAt).format('DD-MM-YYYY HH:mm'),
        'thema': idea.extraData.theme || '',
        'Wat moet er opgeknapt worden?': idea.summary,
        'Hoe kan dit opgeknapt worden?': idea.description,
        'Mooie plekken in de wijk': idea.extraData.role,
        'aantal likes': idea.yes,
        'aantal reacties eens': idea.argumentsFor.length,
        'reacties eens': formatArguments(idea.argumentsFor),
        'aantal reacties oneens': idea.argumentsAgainst.length,
        'reacties oneens': formatArguments(idea.argumentsAgainst),
        'hyperlink naar foto opknappunt-pagina': formatImages(idea.extraData.images)
      }
    });

    const options = Object.keys(mappedIdeas[0]);
    return parse(mappedIdeas, { options });
  };
};
