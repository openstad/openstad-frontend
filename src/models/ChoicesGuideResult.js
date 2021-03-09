const config                = require('config');
const merge                 = require('merge');
const getExtraDataConfig = require('../lib/sequelize-authorization/lib/getExtraDataConfig');

module.exports = function( db, sequelize, DataTypes ) {
  let ChoicesGuideResult = sequelize.define('choicesGuideResult', {

    choicesGuideId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    userId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },

    extraData: getExtraDataConfig(DataTypes.JSON, 'choicesGuideResult'),

    userFingerprint: {
      type: DataTypes.TEXT,
      allowNull: true,
    },

    result: {
      type: DataTypes.TEXT,
      allowNull: false,
      defaultValue: '{}',
      get: function() {
        let value = this.getDataValue('result');
        try {
          if (typeof value == 'string') {
            value = JSON.parse(value);
          }
        } catch (err) {}
        return value;
      },
      set: function(value) {

        try {
          if (typeof value == 'string') {
            value = JSON.parse(value);
          }
        } catch (err) {}

        let oldValue = this.getDataValue('result');
        try {
          if (typeof oldValue == 'string') {
            oldValue = JSON.parse(oldValue) || {};
          }
        } catch (err) {}

        oldValue = oldValue || {};
        Object.keys(oldValue).forEach((key) => {
          if (!value[key]) {
            value[key] = oldValue[key];
          }
        });

        this.setDataValue('result', JSON.stringify(value));

      }
    },

  }, {

    hooks: {

      beforeValidate: function( instance, options ) {

        return new Promise((resolve, reject) => {

          if (instance.choicesGuideId) {
            db.ChoicesGuide.scope('includeSite').findByPk(instance.choicesGuideId)
              .then( (choicesGuide) => {
                if (!choicesGuide) throw Error('ChoicesGuide niet gevonden');
                instance.config = merge.recursive(true, config, choicesGuide.site.config);
                return choicesGuide;
              })
              .then( (choicesGuide) => {
                return resolve();
              }).catch((err) => {
                throw err;
              });

          } else {
            instance.config = config;
            return resolve();
          }

        });

      },

    },

    individualHooks: true,

  });

  ChoicesGuideResult.scopes = function scopes() {

    return {

      forSiteId: function( siteId ) {
        return {
          where: {
            choicesGuideId: [sequelize.literal(`select id FROM choicesGuides WHERE siteId = ${siteId}`)]
          }
        };
      },

      withChoicesGuide: function() {
        return {
          include: [{
            model: db.ChoicesGuide,
            attributes: ['id', '', 'status']
          }]
        };
      },

      withUser: {
        include: [{
          model: db.User,
          as: 'user',
          required: false
        }]
      },

    };
  };

  ChoicesGuideResult.associate = function( models ) {
    this.belongsTo(models.ChoicesGuide);
    this.belongsTo(models.User);
  };

  // dit is hoe het momenteel werkt; ik denk niet dat dat de bedoeling is, maar ik volg nu
	ChoicesGuideResult.auth = ChoicesGuideResult.prototype.auth = {
    listableBy: 'moderator',
    viewableBy: 'all',
    createableBy: 'all',
    updateableBy: ['editor', 'owner'],
    deleteableBy: 'admin',
  }

  return ChoicesGuideResult;

};
