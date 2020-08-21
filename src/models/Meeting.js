var Sequelize = require('sequelize');
const config = require('config');

module.exports = function( db, sequelize, DataTypes ) {

	var Meeting = sequelize.define('meeting', {
		siteId: {
			type         : DataTypes.INTEGER,
			defaultValue : config.siteId && typeof config.siteId == 'number' ? config.siteId : 0,
		},
		type : DataTypes.ENUM('selection','meeting'),
		date : DataTypes.DATE,
		forceShow : DataTypes.BOOLEAN,
		finished: {
			type: DataTypes.VIRTUAL,
			get: function() {
				return this.date - new Date <= -86400000;
			}
		}
	});

	Meeting.associate = function( models ) {
		Meeting.hasMany(models.Idea);
	}
	
	Meeting.scopes = function() {

		let siteScope = {};
		if (config.siteId && typeof config.siteId == 'number') {
			siteScope = {
				where: {
					siteId: config.siteId,
				}
			}
		}
		
		return {
			siteScope,
			withIdea: {
				include: {
					model: db.Idea,
					attributes: ['id', 'title']
				}
			}
		};
	}
	
	Meeting.getUpcoming = function( limit ) {
		if( !limit ) limit = 4;

		let where = {};
		
		return this.scope('siteScope', 'withIdea')
			.findAll({
				where: where,
				order: 'date',
			}).then(meetings => {
				// limit
				let limited = [];
				for(var i = 0; i < meetings.length; i++) {
					if (meetings[i].forceShow || ( new Date(meetings[i].date).getTime() > Date.now() && limit > 0 )) {
						limited.push( meetings[i] );
					}
					if (!meetings[i].forceShow && new Date(meetings[i].date).getTime() > Date.now()) {
						limit--;
					}
				}
				return limited;
			})
	}
	
	// Use `idea.meetingId` to include the already connected meeting as well.
	// Otherwise, it may not show up because the meeting's type is changed to
	// 'selection'.
	// 
	// Also include meetings held in the last 2 months.
	Meeting.getSelectable = function( idea ) {
		var now          = new Date;
		var twoMonthsAgo = new Date(now.getFullYear(), now.getMonth()-2, now.getDate());
		
		return this.findAll({
			where: {
				[Sequelize.Op.or]: [
					{
						[Sequelize.Op.and]: [
							{type: 'meeting'},
							{date: {[Sequelize.Op.gte]: twoMonthsAgo}}
						]
					},
					{id: idea.meetingId}
				]
			},
			order: 'date'
		});
	}

  // volgens mij wordt dit niet meer gebruikt
	Meeting.auth = Meeting.prototype.auth = {
    listableBy: 'admin',
    viewableBy: 'admin',
    createableBy: 'admin',
    updateableBy: 'admin',
    deleteableBy: 'admin',
  }
	
	return Meeting;
};
