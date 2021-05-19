/**
 * The Resource form widget allows for a generic
 *
 * 2 ways of doing this:
 * 1. Through query params: ?resourceType=idea&resourceId=1
 * 2 Through CMS user configured page settings, like so /idea/1
 */
const resourcesSchema = require('../../../config/resources.js').schemaFormat;
const openstadMap = require('../../../config/map').default;

const fields = require('./lib/fields.js');

module.exports = {
  extend: 'map-widgets',
  label: 'Resource form',
  addFields: fields,
  beforeConstruct: function (self, options) {

    if (options.resources) {
      self.resources = options.resources;

      options.addFields = [
        {
          type: 'select',
          name: 'resource',
          label: 'Resource (from config)',
          choices: options.resources
        }
      ].concat(options.addFields || [])
    }
  },
  construct: function (self, options) {
    options.arrangeFields = (options.arrangeFields || []).concat([
      {
        name: 'general',
        label: 'Algemeen',
        fields: ['resource', 'formName', 'redirect', 'hideAdminAfterPublicAction', 'formType', 'dynamicFormSections']
      },
      {
        name: 'visibility',
        label: 'Visibility settings',
        fields: ['formVisibility', 'shouldDisplayUserName']
      },
      {
        name: 'title',
        label: 'Title',
        fields: ['labelTitle', 'infoTitle', 'requiredTitle', 'minTitle', 'maxTitle']
      },
      {
        name: 'summary',
        label: 'Summary',
        fields: ['labelSummary', 'infoSummary', 'requiredSummary', 'typeSummary', 'minSummary', 'maxSummary']
      },
      {
        name: 'description',
        label: 'Description',
        fields: ['labelDescription', 'infoDescription', 'editorDescription', 'requiredDescription', 'minDescription', 'maxDescription']
      },
      {
        name: 'images',
        label: 'Images Upload',
        fields: ['labelImages', 'infoImages', 'uploadMultiple', 'requiredImages']
      },
      {
        name: 'themes',
        label: 'Themes',
        fields: ['labelThemes', 'infoThemes', 'requiredThemes']
      },
      {
        name: 'areas',
        label: 'Areas',
        fields: ['labelAreas', 'infoAreas', 'requiredAreas']
      },
      {
        name: 'location',
        label: 'Location',
        fields: ['labelLocation', 'infoLocation', 'displayLocation', 'requiredLocation']
      },
      {
        name: 'Estimate',
        label: 'Estimate costs',
        fields: ['labelEstimate', 'infoEstimate', 'displayEstimate', 'requiredEstimate', 'typeEstimate', 'minEstimate', 'maxEstimate']
      },
      {
        name: 'Role',
        label: 'Role',
        fields: ['labelRole', 'infoRole', 'displayRole', 'requiredRole', 'typeRole', 'minRole', 'maxRole']
      },
      {
        name: 'Phone',
        label: 'Phone number',
        fields: ['labelPhone', 'infoPhone', 'displayPhone', 'requiredPhone', 'minPhone', 'maxPhone']
      },
      {
        name: 'advice',
        label: 'Tip',
        fields: ['labelAdvice', 'infoAdvice', 'displayAdvice', 'requiredAdvice', 'minAdvice', 'maxAdvice']
      },
      {
        name: 'submitting',
        label: 'Submitting',
        fields: ['buttonTextSubmit', 'buttonTextSave']
      },
      {
        name: 'agreed',
        label: 'Agreed checkbox',
        fields: ['agreedLabel', 'agreedRequired']
      },
      {
        name: 'budget',
        label: 'Budget',
        fields: ['displayBudget']
      },
      {
        name: 'confirmation',
        label: 'Confirmation',
        fields: [
          'confirmationEnabledUser', 'confirmationTemplateNameUser', 'confirmationSubjectUser', 'confirmationEmailFieldUser', 'confirmationEmailFieldUser', 'confirmationEmailContentUser',
          'confirmationEnabledAdmin', 'confirmationTemplateNameAdmin', 'confirmationSubjectAdmin', 'confirmationEmailFieldAdmin', 'confirmationEmailFieldAdmin', 'confirmationEmailContentAdmin'
        ]
      }
    ]);

    require('./lib/helpers.js')(self, options);
    require('./lib/api.js')(self, options);
    require('./lib/submit.js')(self, options);

    self.on('apostrophe-docs:afterSave', 'syncConfirmationFields');
    self.on('apostrophe-docs:afterTrash', 'deleteConfirmationFields');
    self.on('apostrophe-workflow:afterCommit', 'logCommitData', function (req, data) {
      self.apos.utils.info('The commit data is', data);
    });

    /** add config **/
    const superLoad = self.load;

    self.load = function (req, widgets, next) {
      const styles = openstadMap.defaults.styles;
      const globalData = req.data.global;
      widgets.forEach(async (widget) => {
        const resourceType = widget.resource ? widget.resource : false;
        const resourceInfo = resourceType ? resourcesSchema.find((resourceInfo) => resourceInfo.value === resourceType) : false;
        if (!resourceInfo) {
          return;
        }

        const resourceConfigKey = resourceInfo ? resourceInfo.configKey : false;
        const resourceConfig = req.data.global.siteConfig && req.data.global.siteConfig[resourceConfigKey] ? req.data.global.siteConfig[resourceConfigKey] : {};

        const siteConfig = req.data.global.siteConfig;

        widget.resourceConfig = {
          titleMinLength: (resourceConfig.titleMinLength) || 10,
          titleMaxLength: (resourceConfig.titleMaxLength) || 50,
          summaryMinLength: (resourceConfig.summaryMinLength) || 20,
          summaryMaxLength: (resourceConfig.summaryMaxLength) || 140,
          descriptionMinLength: (resourceConfig.descriptionMinLength) || 140,
          descriptionMaxLength: (resourceConfig.descriptionMaxLength) || 5000,
        }

        widget.resourceEndPoint = resourceInfo.resourceEndPoint;

        widget.siteConfig = {
          openstadMap: {
            polygon: (siteConfig && siteConfig.openstadMap && siteConfig.openstadMap.polygon) || undefined,
          },
        }

        // Add function for rendering raw string with nunjucks templating engine
        // Yes this ia a powerful but dangerous plugin :), admin only
        widget.renderString = (rawInput, data) => {
          try {
            return self.apos.templates.renderStringForModule(req, rawInput, data, self);
          } catch (e) {
            return 'Error....'
          }
        }

        const markerStyle = siteConfig.openStadMap && siteConfig.openStadMap.markerStyle ? siteConfig.openStadMap.markerStyle : null;

        // Todo: refactor this to get resourceId in a different way
        const activeResource = req.data.activeResource;
        const resources = activeResource ? [activeResource] : [];
        const googleMapsApiKey = self.apos.settings.getOption(req, 'googleMapsApiKey');

        const isOwner = activeResource ? req.data.openstadUser.id === activeResource.userId : false;
        const isReactedTo = activeResource ? (activeResource.yes > 0 || activeResource.no > 0 || activeResource.argumentCount > 0) : false;
        const isOwnerOrAdmin = (!isReactedTo || !widget.hactiveResourcedminAfterPublicAction && isOwner) || req.data.hasModeratorRights;

        widget.mapConfig = self.getMapConfigBuilder(globalData)
          .setDefaultSettings({
            mapCenterLat: (activeResource && activeResource.location && activeResource.location.coordinates && activeResource.location.coordinates[0]) || globalData.mapCenterLat,
            mapCenterLng: (activeResource && activeResource.location && activeResource.location.coordinates && activeResource.location.coordinates[1]) || globalData.mapCenterLng,
            mapZoomLevel: 13,
            zoomControl: true,
            disableDefaultUI: true,
            styles: styles,
            googleMapsApiKey: googleMapsApiKey,
            useMarkerLinks: false,
            markers: []
            //  polygon: req.data.global.mapPolygons || null
          })
          .setMarkerStyle(markerStyle)
          .setMarkersByResources(resources)
          .setEditorMarker()
          .setEditorMarkerElement('locationField')
          .setPolygon(req.data.global.mapPolygons || null)
          .getConfig();

        widget.showForm = self.showForm(widget, activeResource, isOwnerOrAdmin, req.data.openstadUser)

        // Load confirmation values from api
        if (isOwnerOrAdmin && req.method === 'GET') {
          for (const type of ['User', 'Admin']) {
            if (widget[`confirmationEnabled${type}`]) {
              const formName = `${type}-${widget.formName}`;
              const {template, recipient} = await self.getNotificationByFormName(formName);

              widget[`confirmationTemplateName${type}`] = template.templateFile || '';
              widget[`confirmationSubject${type}`] = template.subject || '';
              widget[`confirmationEmailField${type}`] = self.reformatUserEmailFieldValue(recipient.value)
              widget[`confirmationEmailContent${type}`] = template.text || '';
            }
          }
        }
      });

      superLoad(req, widgets, next);
    }


    const superPushAssets = self.pushAssets;
    self.pushAssets = function () {
      superPushAssets();
      self.pushAsset('stylesheet', 'filepond', {when: 'always'});
      self.pushAsset('stylesheet', 'trix', {when: 'always'});
      self.pushAsset('stylesheet', 'form', {when: 'always'});
      self.pushAsset('stylesheet', 'main', {when: 'always'});
      self.pushAsset('script', 'map', {when: 'always'});
      self.pushAsset('script', 'editor', {when: 'always'});


      self.pushAsset('script', 'main', {when: 'always'});
      self.pushAsset('script', 'delete-form', {when: 'always'});
      self.pushAsset('script', 'status-form', {when: 'always'});

      //because of size load in directly in template for now, in future we might consider loading them in user script
      //and load the user script also when users log in via openstad.
      //self.pushAsset('script', 'filepond', { when: 'always' });
      // self.pushAsset('script', 'trix', { when: 'always' });
    };

    self.route('post', 'modal', function (req, res) {
      // Make sure the chooser will be allowed to edit this schema
      const schema = self.allowedSchema(req);
      self.apos.schemas.bless(req, schema);
      console.log(req.body);
      return res.send(self.render(req, 'widgetEditor.html', {label: self.label, schema: schema}));
    });

  }

};
