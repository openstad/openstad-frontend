const config = require('config');
const merge = require('merge');
const sanitize = require('../util/sanitize');

module.exports = function( db, sequelize, DataTypes ) {
  let ChoicesGuideQuestion = sequelize.define('choicesGuideQuestion', {

    questionGroupId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    title: {
      type: DataTypes.STRING(255),
      allowNull: false,
      defaultValue: '',
      validate: {
        len: {
          args: [2, 255],
          msg: 'Titel moet tussen 2 en 255 tekens lang zijn'
        }
      },
      set: function( text ) {
        this.setDataValue('title', sanitize.title(text.trim()));
      }
    },

    description: {
      type: DataTypes.TEXT,
      allowNull: false,
      defaultValue: '',
      validate: {
        len: {
          args: [0, 5000],
          msg: 'Beschrijving moet tussen 0 en 5000 tekens zijn'
        },
      },
      set: function( text ) {
        this.setDataValue('description', sanitize.content(text.trim()));
      }
    },

    moreInfo: {
      type: DataTypes.TEXT,
      allowNull: false,
      defaultValue: '{}',
      get: function() {
        let value = this.getDataValue('moreInfo');
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
        this.setDataValue('moreInfo', JSON.stringify(value));
      }
    },

    images: {
      type: DataTypes.TEXT,
      allowNull: false,
      defaultValue: '{}',
      get: function() {
        let value = this.getDataValue('images');
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
        this.setDataValue('images', JSON.stringify(value));
      }
    },

    type: {
      type: DataTypes.ENUM('continuous', 'enum-buttons', 'enum-radio', 'a-to-b'),
      defaultValue: 'continuous',
      allowNull: false
    },

    dimensions: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },

    values: {
      type: DataTypes.TEXT,
      allowNull: false,
      defaultValue: '{}',
      get: function() {
        let value = this.getDataValue('values');
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
        this.setDataValue('values', JSON.stringify(value));

      }
    },

    minLabel: {
      type: DataTypes.STRING(512),
      allowNull: true,
      defaultValue: '0'
    },

    maxLabel: {
      type: DataTypes.STRING(512),
      allowNull: true,
      defaultValue: '100'
    },

    seqnr: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

  }, {

    hooks: {

      beforeValidate: function( instance, options ) {

        return new Promise((resolve, reject) => {

          if (instance.choicesGroupId) {

            db.ChoicesGuideQuestion.findByPk(instance.questionGroupId)
              .then( (questionGroup) => {
                if (!questionGroup) throw Error('QuestionGroup niet gevonden');
                return questionGroup;
              })
              .then( (questionGroup) => {
                db.ChoicesGuide.scope('includeSite').findByPk(instance.choicesGuideId)
                  .then( (choicesGuide) => {
                    if (!choicesGuide) throw Error('ChoicesGuide niet gevonden');
                    instance.config = merge.recursive(true, config, choicesGuide.site.config);
                    return choicesGuide;
                  })
                  .then( (choicesGuide) => {
                    return resolve();
                  });
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

  ChoicesGuideQuestion.scopes = function scopes() {

    return {

      forSiteId: function( siteId ) {
        return {
          where: {
            questionGroupId: [sequelize.literal(`select choicesGuideQuestionGroups.id FROM choicesGuideQuestionGroups INNER JOIN choicesGuides ON choicesGuides.id = choicesGuideQuestionGroups.choicesGuideId WHERE siteId = ${siteId}`)]
          }
        };
      },

    };
  };

  ChoicesGuideQuestion.associate = function( models ) {
    this.belongsTo(models.ChoicesGuideQuestionGroup, { foreignKey: 'questionGroupId' });
  };

  // dit is hoe het momenteel werkt; ik denk niet dat dat de bedoeling is, maar ik volg nu
	ChoicesGuideQuestion.auth = ChoicesGuideQuestion.prototype.auth = {
    listableBy: 'all',
    viewableBy: 'all',
    createableBy: 'admin',
    updateableBy: 'admin',
    deleteableBy: 'admin',
  }

  return ChoicesGuideQuestion;

};
