const styleSchema = require('../../../config/styleSchema.js').default;

/*
  CURRENTLY IN TRANSITION.
  SOME ASSETS FILES ARE IN THE IDEA overview
  MAIN ISSUE IS
 */
const Promise             = require("bluebird");
const rp                  = require('request-promise');
const moment              = require("moment");
const fields              = require('./lib/fields');
const sortingOptions      = require('../../../config/sorting.js').apiOptions;
const qs                  = require('qs');
const PARSE_DATE_FORMAT   = 'YYYY-MM-DD HH:mm:ss';
const googleMapsApiKey    = process.env.GOOGLE_MAPS_API_KEY;
const url             = require('url');

const MAX_PAGE_SIZE = 100;

module.exports = {
  extend: 'apostrophe-widgets',
  label: 'Resource overview',
  addFields: fields,
  beforeConstruct: function(self, options) {
    if (options.resources) {
      self.resources = options.resources;

      options.addFields = [
        {
          type: 'select',
          name: 'resource',
          label: 'Resource (from config)',
          choices : options.resources
        }
      ].concat(options.addFields || [])
    }
  },
  construct: function(self, options) {
    options.arrangeFields = (options.arrangeFields || []).concat([
      {
        name: 'general',
        label: 'General',
        fields: ['resource', 'displayType', 'fallBackToMapImage', 'defaultImage', 'rawInput', 'pathForResource', 'displayRanking']
      },
      {
        name: 'gridder',
        label: 'Gridder',
        fields: ['gridder_text_open', 'gridder_text_vote_button', 'gridder_open_text_vote_button', 'gridder_tile_image_aspect_ratio', 'gridder_use_field_as_title', 'showVoteCounter' ]
      },
      {
        name: 'sorting',
        label: 'Sorting',
        fields: [ 'displaySorting', 'displayFilterVoting', 'defaultSorting', 'selectedSorting', 'filterResources', 'filterClassName' ]
      },
      {
        name: 'pagination',
        label: 'Pagination',
        fields: ['displayPagination', 'pageSize', 'resultCountText']
      },
      {
        name: 'theme',
        label: 'Theme',
        fields: ['displayThemeFilter']
      },
      {
        name: 'area',
        label: 'Area',
        fields: ['displayAreaFilter']
      },
      {
        name: 'search',
        label: 'Search',
        fields: ['displaySearch', 'searchText']
      },
      {
        name: 'tags',
        label: 'Tags',
        fields: ['displayTagFilters']
      },

      {
        name: 'include_exclude',
        label: 'Include & Exclude items',
        fields: ['filterExcludeThemes', 'filterIncludeThemes', 'filterIdeas']
      },
      styleSchema.definition('containerStyles', 'Styles for the container')
    ]);

     const superPushAssets = self.pushAssets;
     self.pushAssets = function () {
       superPushAssets();
       self.pushAsset('stylesheet', 'main', { when: 'always' });
       self.pushAsset('stylesheet', 'pagination', { when: 'always' });
     };

    const superPageBeforeSend = self.pageBeforeSend;

    const superLoad = self.load;
		self.load = function(req, widgets, next) {
      const promises = [];

      const thisHost = req.headers['x-forwarded-host'] || req.get('host');
      const protocol = req.headers['x-forwarded-proto'] || req.protocol;
      const fullUrl = protocol + '://' + thisHost + req.originalUrl;
      const parsedUrl = url.parse(fullUrl, true);

      req.data.widgetRequestData = {};

			widgets.forEach((widget) => {
        const queryObject =  Object.assign({}, req.query);

        widget.themes = req.data.global.themes;
        widget.areas = req.data.global.areas;

        const containerId = styleSchema.generateId();
        widget.containerId = containerId;

    //    widget.selectedTheme = req.data.query.theme ? req.data.query.theme : (widget.defaultTheme ? widget.defaultTheme : '');
    //    widget.selectedArea = req.data.query.area ? req.data.query.area : (widget.defaultArea ? widget.defaultArea : '');

        // exclude ideas with a certain theme
        //
        if (widget.filterExcludeThemes) {
          const excludeThemes = widget.filterExcludeThemes.split(',').map(function(item) {
           return item.trim();
         });

          widget.excludeThemes = excludeThemes;

          //filter out themes so they dont show up in select
          widget.themes =  excludeThemes.length > 0 ? widget.themes.filter(theme => excludeThemes.indexOf(theme.value) === -1) : widget.themes;
        }


        // only include ideas with a certain theme
        if (widget.filterIncludeThemes) {
           const includeThemes = widget.filterIncludeThemes.split(',').map(function(item) {
             return item.trim();
           });

           widget.includeThemes = includeThemes;

           widget.themes =  includeThemes.length > 0 ? widget.themes.filter(theme => includeThemes.indexOf(theme.value) > -1) : widget.themes;
        }

        if (widget.containerStyles) {
          widget.formattedContainerStyles = styleSchema.format(containerId, widget.containerStyles);
        }

        const siteConfig = req.data.global.siteConfig;
        const resource = widget.resource;
        const apiUrl = self.apos.settings.getOption(req, 'apiUrl');
        const maxPageSize = siteConfig && siteConfig[resource] && siteConfig[resource].maxPageSize ? siteConfig[resource].maxPageSize : MAX_PAGE_SIZE;
        let pageSize = widget.pageSize ? widget.pageSize : 10;
        pageSize = queryObject.pageSize ? queryObject.pageSize : pageSize
        pageSize = pageSize > maxPageSize ? maxPageSize : pageSize;

        const defaultSort = widget.defaultSorting ? widget.defaultSorting : 'createdate_desc';

        //format the pagination, theme, vote and other query paramters
        const params = {
          page: queryObject.page ? queryObject.page : 0,
          pageSize: pageSize,
          // include vote count per resource
          includeVoteCount: 1,
          sort: queryObject.sort ? queryObject.sort : defaultSort,
          tags: queryObject.oTags ? queryObject.oTags : '',
          filters : {
            theme: queryObject.theme ? queryObject.theme : '',
            area: queryObject.area ? queryObject.area : '',
          }
        };

        if (widget.excludeThemes) {
          params.exclude = {
            theme: widget.excludeThemes
          }
        }



        if (widget.includeThemes) {
          params.filters = {
            theme: widget.includeThemes
          }
        }

        if (queryObject.search) {
          params.search = {
            "criteria": [
              {
                "title": queryObject.search
              },
            ],
            "options": {
              "andOr": "and"
            }
          };
        }


        const options = {
          uri: `${apiUrl}/api/site/${req.data.global.siteId}/${resource}?${qs.stringify(params)}`,
          headers: { 'Accept': 'application/json', "Cache-Control": "no-cache" },
          json: true
        };

        console.log('params', params);
        console.log('options', options);

        if (req.session.jwt) {
          options.headers["X-Authorization"] = `Bearer ${req.session.jwt}`;
        }

        const tags = req.data.openstadTags;
        const queryParams = Object.assign({}, queryObject);


        req.data.widgetRequestData.pathname = widget.pathname ? widget.pathname : req.data.currentPathname;

        req.data.widgetRequestData.openstadTags =  tags ? tags.map((tag) => {
          return Object.assign(tag, {
            // dont pass query obj directly, it will be a reference and cause weird bugs
            selectionUrl: self.formatTagSelectUrl(tag, widget.pathname, Object.assign({}, queryObject)),
            removeUrl: self.formatTagRemoveUrl(tag, widget.pathname, Object.assign({}, queryObject)),
            isSelected: self.isTagSelected(tag, Object.assign({}, queryObject))
          })
        }) : [];

        promises.push(new Promise((resolve, reject) => {
          rp(options)
          .then((response)  => {
//            widget.activeResources = self.filterResources(response.records);
            //page count starts from 0, our templates expect 1
            req.data.widgetRequestData.paginationIndex = response.metadata.page + 1;
            req.data.widgetRequestData.totalItems = response.metadata.totalCount;
            req.data.widgetRequestData.paginationUrls = self.formatPaginationUrls(response.metadata.pageCount, req.data.currentPathname, queryObject);
            req.data.widgetRequestData.formattedResultCountText = widget.resultCountText ? widget.resultCountText.replace('[visibleCount]', response.records.length).replace('[totalCount]', response.metadata.totalCount) : '';
            req.data.widgetRequestData.formattedSearchText = widget.searchText && req.data.query.search ? widget.searchText.replace('[searchTerm]', req.data.query.search) : '';
            req.data.widgetRequestData.activeResources = response.records ? response.records.map((record)=>{
              delete record.description;
              return record;
            }) : [];

          //  console.log('req.data', req.data.widgetRequestData)


            resolve(response);
          })
          .catch((err) => {
            reject(err);
          })
        }));

        // Add function for rendering raw string with nunjucks templating engine
        // Yes this ia a powerful but dangerous plugin :), admin only
        widget.renderString = (data, activeResource) => {
            data.activeResource = activeResource;

            try {
              return self.apos.templates.renderStringForModule(req, widget.rawInput, data, self);
            } catch (e) {
              console.log('eee', e)
              return 'Error....'
            }
         }

         widget.parseDateToTime = (date) => {
           return new Date(date).getTime();
         }

         // expects sql date format
         widget.isBefore = (date, time, unit) => {
            time = time ? time : 15;
            unit = unit ? unit : 'minutes';
            const dateTimeAgo = moment().subtract(time, unit);
            return moment(date, PARSE_DATE_FORMAT).isBefore(dateTimeAgo);
         };

         // expects sql date format
         widget.isAfter = (date, time, unit) => {
            time = time ? time : 15;
            unit = unit ? unit : 'minutes';
            const dateTimeAgo = moment().subtract(time, unit);
            return moment(date, PARSE_DATE_FORMAT).isAfter(dateTimeAgo);
         };
			});

      Promise.all(promises)
        .then(function (response) {
          return superLoad(req, widgets, next);
        })
        .catch(function (err) {
          return superLoad(req, widgets, next);
        });
		}

    self.formatPaginationUrls = (pageCount, baseUrl, defaultParams) => {
      const urls = [];

      for (let i = 0; i < pageCount;  i++) {
        // create the url by merging the base url and the pagination paramters and the default params
        urls.push(`?${qs.stringify(Object.assign(defaultParams, {
          page: i
        }))}`);
      }

      return urls;
    }

    //selection means it is set to url, so it will be used to query the api
    self.formatTagSelectUrl = (tag, baseUrl, defaultParams) => {
      let getParams = defaultParams ?  defaultParams : {};

      defaultParams.page = 0;

      // make sure tags is an array
      getParams.oTags = Array.isArray(getParams.oTags) ? getParams.oTags : [];

      // if not oTags queryparams add it, so a click will "select" this link
      getParams.oTags = self.isTagSelected(tag, defaultParams) ? getParams.oTags : [...getParams.oTags, tag.id];

      return `?${qs.stringify(defaultParams)}`;
    }

    self.formatTagRemoveUrl = (tag, baseUrl, defaultParams) => {
      let getParams = defaultParams ?  defaultParams : {};

      defaultParams.page = 0;

      // make sure we have an array
      getParams.oTags = Array.isArray(getParams.oTags) ? getParams.oTags : [];

      //make sure the ids are integers, get parameters from url are returned as a string
      if (Array.isArray(getParams.oTags)) {
        getParams.oTags = getParams.oTags.map((tag) => {
          return parseInt(tag, 10);
        });
      }

      // if not in queryparams add it, so a click will "select" this link
      getParams.oTags = self.isTagSelected(tag, defaultParams) ? getParams.oTags.filter(tagId => tagId !== tag.id ) : getParams.oTags;

      return `?${qs.stringify(defaultParams)}`;
    }

    self.isTagSelected = (tag, params) => {
      //console.log('isTagSelected', params);

      //make sure the ids are integers, get parameters from url are returned as a string
      if (Array.isArray(params.oTags)) {
        params.oTags = params.oTags.map((tag) => {
          return parseInt(tag, 10);
        });
      }

      return params && Array.isArray(params.oTags) && params.oTags.includes(tag.id);
    }

     const superOutput = self.output;
     self.output = function(widget, options) {
       // add the label to the select sort options for displaying in the select box
       widget.selectedSorting = widget.selectedSorting ? widget.selectedSorting.map((sortingValue) => {
         const sortingOption = sortingOptions.find(sortingOption => sortingOption.value === sortingValue);

         return {
           value: sortingValue,
           label: sortingOption ? sortingOption.label : sortingValue
         }
       }) : [];

       widget.formatImageUrl = function (image, location, widget, width, height, crop, cookieConsent) {
         let url;
         if (image) {
           url = image + '/:/rs=w:'+ width + ',h:' + height;
           url =  crop ? url + ';cp=w:' + width + ',h:' + height : url;
         } else if (location && widget.fallBackToMapImage && cookieConsent) {
           url = `https://maps.googleapis.com/maps/api/streetview?size=${width}x${height}&location=${location.coordinates[0]},${location.coordinates[1]}&heading=151.78&key=${googleMapsApiKey}`;
         } else if (widget.defaultImage) {
           url = self.apos.attachments.url(widget.defaultImage);
         } else {
           url = '/img/placeholders/idea.jpg';
         }

         return url;
       }

       widget.getTitleText = function (resource, fieldname) {
         fieldname = fieldname || 'title';
         let value = resource;
         fieldname.split('\.').forEach((key) => {
           value = value[key]
         });
         value = value || '';
         return value;
       }

       if (widget.filterResources) {
         const resourceIds = widget.filterResources.split(',').map(function(item) {
          return parseInt(item.trim(), 10);
        });

         widget.activeResources = resourceIds.length > 0 ? widget.activeResources.filter(idea => ideaIds.indexOf(idea.id) !== -1) : widget.activeResources;
       }

       return superOutput(widget, options);
     };

  }
};
