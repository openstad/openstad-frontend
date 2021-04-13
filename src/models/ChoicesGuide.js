const sanitize = require('../util/sanitize');

module.exports = function( db, sequelize, DataTypes ) {

  let ChoicesGuide = sequelize.define('choicesGuide', {

    siteId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    title: {
      type: DataTypes.STRING(255),
      allowNull: false,
      defaultValue: '',
      validate: {
        len: {
          args: [0, 255],
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
          if (typeof value == 'object') {
            value = JSON.stringify(value);
          }
        } catch (err) {}
        this.setDataValue('images', value);
      }
    },

    config: {
      type: DataTypes.TEXT,
      allowNull: true,
      get: function() {
        let value = this.getDataValue('config');
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
        this.setDataValue('config', JSON.stringify(value));
      }
    },

  });

  ChoicesGuide.associate = function( models ) {
    this.belongsTo(models.Site);
    this.hasMany(models.ChoicesGuideQuestionGroup);
    this.hasMany(models.ChoicesGuideChoice);
  };

  ChoicesGuide.scopes = function() {

    return {

      forSiteId: function( siteId ) {
        return {
          where: {
            siteId: siteId,
          }
        };
      },

      includeSite: {
        include: [{
          model: db.Site,
        }]
      },

      includeChoices: {
        include: [{
          model: db.ChoicesGuideChoice,
        },{
          model: db.ChoicesGuideQuestionGroup,
          include: [{
            model: db.ChoicesGuideChoice,
          }]
        }]
      },

      includeQuestionGroups: {
        include: [{
          model: db.ChoicesGuideQuestionGroup,
        }]
      },

      includeQuestions: {
        include: [{
          model: db.ChoicesGuideQuestionGroup,
          include: [{
            model: db.ChoicesGuideQuestion,
          }]
        }]
      },

	  };

  };

  // dit is hoe het momenteel werkt; ik denk niet dat dat de bedoeling is, maar ik volg nu
	ChoicesGuide.auth = ChoicesGuide.prototype.auth = {
    listableBy: 'all',
    viewableBy: 'all',
    createableBy: 'admin',
    updateableBy: 'admin',
    deleteableBy: 'admin',
  }

  return ChoicesGuide;

};
