const rp = require('request-promise');
const moment = require('moment');
const {parse} = require('json2csv');

const formatArguments = function (arguments) {
  return arguments.map((argument) => {
    return argument.description;
  }).join('/\r');
}

const formatImages = function (images) {
  return images ? images.join('/\r') : '';
}

const csvHeaders = {
  title: process.env.EXPORT_CSV_TITLE || 'titel',
  creator: process.env.EXPORT_CSV_CREATOR || 'indiener',
  email: process.env.EXPORT_CSV_EMAIL || 'email',
  location: process.env.EXPORT_CSV_LOCATION || 'locatie',
  created: process.env.EXPORT_CSV_CREATED || 'aangemaakt',
  theme: process.env.EXPORT_CSV_THEME || 'thema',
  summary: process.env.EXPORT_CSV_SUMMARY || 'samenvatting',
  description: process.env.EXPORT_CSV_DESCRIPTION || 'beschrijving',
  role: process.env.EXPORT_CSV_ROLE || 'eigen rol',
  likes: process.env.EXPORT_CSV_LIKES || 'aantal likes',
  argumentsForCount: process.env.EXPORT_CSV_ARGUMENTS_FOR_COUNT || 'aantal reacties eens',
  argumentsFor: process.env.EXPORT_CSV_ARGUMENTS_FOR || 'reacties eens',
  argumentsAgainstCount: process.env.EXPORT_CSV_ARGUMENTSA_AGAINST_COUNT || 'aantal reacties oneens',
  argumentsAgainst: process.env.EXPORT_CSV_ARGUMENTSA_AGAINST || 'reacties oneens',
  images: process.env.EXPORT_CSV_IMAGES || 'afbeeldingen',
};

module.exports = (self, options) => {
  self.getIdeas = async (req) => {
    const apiUrl = self.apos.settings.getOption(req, 'apiUrl');
    const sort = req.query.sort ? req.query.sort : 'createdate_desc';
    const jwt = req.session.jwt;

    return rp({
      uri: `${apiUrl}/api/site/${req.data.global.siteId}/idea?sort=${sort}&includeUser=1&includeVoteCount=1&includeUserVote=1&includeArguments=1`,
      headers: {
        "X-Authorization": `Bearer ${jwt}`,
        'Accept': 'application/json',
        "Cache-Control": "no-cache"
      },
      json: true
    });
  };

  self.generateCsv = (ideas) => {
    const mappedIdeas = ideas.map((idea) => {
      const row = {};

        row[csvHeaders.title] = idea.title;
        row[csvHeaders.creator] = idea.user.fullName;
        row[csvHeaders.email] = idea.user.email;
        row[csvHeaders.location] = idea.location && idea.location.coordinates ? idea.location.coordinates[0] + ', ' + idea.location.coordinates[1]  : '';
        row[csvHeaders.created] = moment(idea.createdAt).format('DD-MM-YYYY HH =mm');
        row[csvHeaders.theme] = idea.extraData.theme || '';
        row[csvHeaders.summary] = idea.summary;
        row[csvHeaders.description] = idea.description;
        row[csvHeaders.role] = idea.extraData.role;
        row[csvHeaders.likes] = idea.yes;
        row[csvHeaders.argumentsForCount] = idea.argumentsFor.length;
        row[csvHeaders.argumentsFor] = formatArguments(idea.argumentsFor);
        row[csvHeaders.argumentsAgainstCount] = idea.argumentsAgainst.length;
        row[csvHeaders.argumentsAgainst] = formatArguments(idea.argumentsAgainst);
        row[csvHeaders.images] = formatImages(idea.extraData.images);

        return row;
    });

    const options = Object.keys(mappedIdeas[0]);
    return parse(mappedIdeas, {options});
  };
};
