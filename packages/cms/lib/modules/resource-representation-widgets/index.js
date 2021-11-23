/**
 * The Resource representation widget allows for the active
 *
 *
 */

const fields = require('./lib/fields.js');
const eventEmitter  = require('../../../events').emitter;
const extraFields =  require('../../../config/extraFields.js').fields;
const openstadMap = require('../../../config/map').default;
const styleSchema = require('../../../config/styleSchema.js').default;


module.exports = {
  //extend: 'openstad-widgets',
  extend: 'map-widgets',
  label: 'Resource representation',
  addFields: fields,

  construct: function(self, options) {
      require('./lib/routes.js')(self, options);

      const superPushAssets = self.pushAssets;
      self.pushAssets = function () {
        superPushAssets();
        self.pushAsset('stylesheet', 'main', { when: 'always' });
        self.pushAsset('stylesheet', 'secondary', { when: 'always' });
        self.pushAsset('stylesheet', 'activity-list', { when: 'always' });
        self.pushAsset('stylesheet', 'user-sites-active-list', { when: 'always' });

        self.pushAsset('script', 'main', { when: 'always' });
        self.pushAsset('script', 'modal', { when: 'always' });
      };

      const superLoad = self.load;
      self.load = function (req, widgets, next) {
          const styles = openstadMap.defaults.styles;
          const globalData = req.data.global;
          const siteConfig = req.data.global.siteConfig;

          widgets.forEach((widget) => {
              // render string with variables. Add active recource
              if (widget.containerStyles) {
                const containerId = self.apos.utils.generateId();
                widget.containerId = containerId;
                  widget.formattedContainerStyles = styleSchema.format(containerId, widget.containerStyles);
              }

              widget.cssHelperClassesString = widget.cssHelperClasses ? widget.cssHelperClasses.join(' ') : '';

              widget.mapCenterLat = globalData.mapCenterLat;
              widget.mapCenterLng = globalData.mapCenterLng;
              widget.mapPolygons = globalData.mapPolygons;

              widget.countdownPeriod = siteConfig.ideas.automaticallyUpdateStatus && siteConfig.ideas.automaticallyUpdateStatus.afterXDays || 0;

              widget.siteConfig = {
                  minimumYesVotes: (siteConfig && siteConfig.ideas && siteConfig.ideas.minimumYesVotes),
                  openStadMap: (siteConfig && siteConfig.openStadMap) ? siteConfig.openStadMap : {},
                  voteValues: (siteConfig && siteConfig.votes && siteConfig.votes.voteValues) || [{
                      label: 'voor',
                      value: 'yes',
                      screenReaderAddition: 'dit plan stemmen'
                  }, {label: 'tegen', value: 'no', screenReaderAddition: 'dit plan stemmen'}],
              }

              if (widget.siteConfig.minimumYesVotes == null || typeof widget.siteConfig.minimumYesVotes == 'undefined') widget.siteConfig.minimumYesVotes = 100;
          });
          return superLoad(req, widgets, next);
      }

      const superOutput = self.output;

      self.output = function(widget, options) {
        widget.pageType = options.pageType;
        widget.activeResourceType = options.activeResourceType;
        widget.activeResource = options.activeResource ?  options.activeResource : {};
        widget.activeResourceId =  options.activeResource ?  options.activeResource.id : false;

        //Todo, find a nice way of adding functions per display / resource type
        if (widget.activeResourceType === 'idea' && widget.displayType === 'idea-page') {
          const openStadMap =  widget.siteConfig && widget.siteConfig.openStadMap ? widget.siteConfig.openStadMap : {};
          const markerStyle = widget.siteConfig && widget.siteConfig.openStadMap && widget.siteConfig.openStadMap.markerStyle ? widget.siteConfig.openStadMap.markerStyle : null;
          const idea = widget.activeResource;

          let daysOld = parseInt( ( Date.now() - new Date(idea.startDate).getTime() ) / ( 24 * 60 * 60 * 1000 ) );
          idea.countdown = widget.countdownPeriod - daysOld;

          //map expects array
          const ideas = widget.activeResource ? [widget.activeResource] : [];

          widget.mapConfig = self.getMapConfigBuilder({})
              .setDefaultSettings({
                  mapCenterLat: (idea && idea.location && idea.location.coordinates && idea.location.coordinates[0]) || widget.mapCenterLat,
                  mapCenterLng: (idea && idea.location && idea.location.coordinates && idea.location.coordinates[1]) || widget.mapCenterLng,
                  mapZoomLevel: 16,
                  zoomControl: true,
                  disableDefaultUI : true,
                  styles: openStadMap.styles
              })
              .setMarkersByResources(ideas)
              .setMarkerStyle(markerStyle)
              .setPolygon(widget.mapPolygons || null)
              .getConfig();
        }

        return superOutput(widget, options);
      };
  }
};
