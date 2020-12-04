const isJson = require('../util/isJson');
const { Op } = require("sequelize");

module.exports = function(req, res, next) {
  let { filter } = req.query;
  filter = filter && isJson(filter) ? JSON.parse(filter) : false;

  /*
    This looks a bit ugly.
    Certain operators, like != and %LIKE% (substring)
    need to be replaced with Sequalize operators in order to work with sequelize's query builder
   */
  if (filter && Object.keys(filter).length > 0) {
    Object.keys(filter).forEach((attribute) => {
      const compareValue = filter[attribute];

      if (typeof compareValue === 'object') {
        Object.keys(compareValue).forEach((item, i) => {

          if (item === '!=') {
            const itemValue = compareValue[item];
            delete compareValue[item];
            compareValue[Op.not] = itemValue;
          }

          if (item === 'substring') {
            const itemValue = compareValue[item];
            delete compareValue[item];
            compareValue[Op.substring] = itemValue;
          }
        });

      }
    })

    req.dbQuery.where = filter;
  }

  next();
};
