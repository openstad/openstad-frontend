/**
 * Resource overview is a generic widget for display data from the openstad REST api
 * The widget allows for different settings in resource type, display and pagination settings etc.
 *
 * Different view and vote settings are resource specific and dependent on API settings
 *
 * Status: Allows for voting on one idea, participatory budget widget allows for voting on multiple ideas, refactor plans are to move voting to one module and a refactored JS
 */
const cacheLifespan = 15 * 60; // set lifespan of 15 minutes;
const cache = require('../../../services/cache').cache;

/*
  CURRENTLY IN TRANSITION.
  SOME ASSETS FILES ARE IN THE IDEA overview
  MAIN ISSUE IS
 */
const Promise = require('bluebird');
const rp = require('request-promise');
const moment = require('moment');
const url = require('url');
const qs = require('qs');
const fields = require('./lib/fields');
const sortingOptions = require('../../../config/sorting.js').apiOptions;
const PARSE_DATE_FORMAT = 'YYYY-MM-DD HH:mm:ss';
const googleMapsApiKey = process.env.GOOGLE_MAPS_API_KEY;
const loadGrants = require('../resource-form-widgets/lib/load-grants');
const sanitize = require('sanitize-html');

const MAX_PAGE_SIZE = 100;

module.exports = {
  extend: 'apostrophe-widgets',
  label: 'Resource overview',
  addFields: fields,
  playerData: false,
  construct: function (self, options) {
    require('./lib/arrangeFields.js')(self, options);

    self.apos.app.use(loadGrants);

    const superPushAssets = self.pushAssets;

    self.pushAssets = function () {
      superPushAssets();
      self.pushAsset('stylesheet', 'main0', { when: 'always' });
      self.pushAsset('stylesheet', 'tile', { when: 'always' });
      self.pushAsset('stylesheet', 'grid', { when: 'always' });
      self.pushAsset('stylesheet', 'duration', { when: 'always' });

      self.pushAsset('stylesheet', 'vote-creator', { when: 'always' });
      self.pushAsset('stylesheet', 'gridder', { when: 'always' });
      self.pushAsset('stylesheet', 'nr-of-votes', { when: 'always' });
      self.pushAsset('stylesheet', 'main', { when: 'always' });
      self.pushAsset('stylesheet', 'pagination', { when: 'always' });

      //for now uses the one from participatory budgetting, should move to ASSETS
      //but order issues then, probably moving initialisation code to play will fix that.
      //       self.pushAsset('script', 'jquery.gridder', { when: 'always' });

      self.pushAsset('script', 'thumbnail-tile-loading', { when: 'always' });
      self.pushAsset('script', 'tabs', { when: 'always' });
      //self.pushAsset('script', 'fotorama', { when: 'always' });
      self.pushAsset('script', 'vote', { when: 'always' });
      self.pushAsset('script', 'main', { when: 'always' });
      self.pushAsset('script', 'ideas-lister', { when: 'always' });
    };

    const superLoad = self.load;
    self.load = function (req, widgets, next) {
      const promises = [];
      const globalData = req.data.global;

      widgets.forEach((widget) => {
        // Add function for rendering raw string with nunjucks templating engine
        // Yes this ia a powerful but dangerous feature :), admin only
        widget.renderString = (data, activeResource) => {
          data.activeResource = activeResource;

          try {
            return self.apos.templates.renderStringForModule(
              req,
              widget.rawInput,
              data,
              self
            );
          } catch (e) {
            console.log('eee', e);
            return 'Error....';
          }
        };

        widget.formatTagSelectUrl = self.formatTagSelectUrl;
        widget.formatTagRemoveUrl = self.formatTagRemoveUrl;
        widget.isTagSelected = self.isTagSelected;
        widget.formatTargetAudienceSelectUrl =
          self.formatTargetAudienceSelectUrl;
        widget.formatTargetAudienceRemoveUrl =
          self.formatTargetAudienceRemoveUrl;
        widget.isTargetAudienceSelected = self.isTargetAudienceSelected;
        widget.formatGrantSelectUrl = self.formatGrantSelectUrl;
        widget.formatGrantRemoveUrl = self.formatGrantRemoveUrl;
        widget.isGrantSelected = self.isGrantSelected;
        widget.parseDateToTime = (date) => {
          return new Date(date).getTime();
        };

        // check if dateTime is before  a certain dateTime expects sql date format
        widget.isBefore = (date, time, unit) => {
          time = time ? time : 15;
          unit = unit ? unit : 'minutes';
          const dateTimeAgo = moment().subtract(time, unit);
          return moment(date, PARSE_DATE_FORMAT).isBefore(dateTimeAgo);
        };

        // check if dateTime is after a certain dateTime expects sql date format
        widget.isAfter = (date, time, unit) => {
          time = time ? time : 15;
          unit = unit ? unit : 'minutes';
          const dateTimeAgo = moment().subtract(time, unit);
          return moment(date, PARSE_DATE_FORMAT).isAfter(dateTimeAgo);
        };

        const queryObject = Object.assign({}, req.query);

        widget.themes = req.data.global.themes;
        widget.areas = req.data.global.areas;

        const containerId = self.apos.utils.generateId();
        widget.containerId = containerId;

        widget.parseDateToTime = (date) => {
          return new Date(date).getTime();
        };

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

        widget.isArchiveFilterChecked = () => {
          return !!req.query.showArchive;
        };

        //    widget.selectedTheme = req.data.query.theme ? req.data.query.theme : (widget.defaultTheme ? widget.defaultTheme : '');
        //    widget.selectedArea = req.data.query.area ? req.data.query.area : (widget.defaultArea ? widget.defaultArea : '');

        // exclude ideas with a certain theme
        //
        if (widget.filterExcludeThemes) {
          const excludeThemes = widget.filterExcludeThemes
            .split(',')
            .map(function (item) {
              return item.trim();
            });

          widget.excludeThemes = excludeThemes;

          //filter out themes so they dont show up in select
          widget.themes =
            excludeThemes.length > 0
              ? widget.themes.filter(
                  (theme) => excludeThemes.indexOf(theme.value) === -1
                )
              : widget.themes;
        }

        // only include ideas with a certain theme
        if (widget.filterIncludeThemes) {
          const includeThemes = widget.filterIncludeThemes
            .split(',')
            .map(function (item) {
              return item.trim();
            });

          widget.includeThemes = includeThemes;

          widget.themes =
            includeThemes.length > 0
              ? widget.themes.filter(
                  (theme) => includeThemes.indexOf(theme.value) > -1
                )
              : widget.themes;
        }

        widget.cssHelperClassesString = widget.cssHelperClasses
          ? widget.cssHelperClasses.join(' ')
          : '';

        if (widget.containerStyles) {
          widget.formattedContainerStyles = styleSchema.format(
            containerId,
            widget.containerStyles
          );
        }

        const siteConfig = req.data.global.siteConfig;
        const resource = widget.resource;
        const apiUrl = self.apos.settings.getOption(req, 'apiUrl');

        // Get the pageSize
        const maxPageSize =
          siteConfig && siteConfig[resource] && siteConfig[resource].maxPageSize
            ? siteConfig[resource].maxPageSize
            : MAX_PAGE_SIZE;
        let pageSize = widget.pageSize ? widget.pageSize : 10;
        pageSize = queryObject.pageSize ? queryObject.pageSize : pageSize;
        pageSize = pageSize > maxPageSize ? maxPageSize : pageSize;

        // Get sorting, default to newest first
        const defaultSort = widget.defaultSorting
          ? widget.defaultSorting
          : 'createdate_desc';

        //format the pagination, theme, vote and other query paramters
        const params = {
          page: queryObject.page ? queryObject.page : 0,
          pageSize: pageSize,
          includeUserVote: 1,
          // include vote count per resource
          includeVoteCount: 1,
          includeArgsCount: 1,
          sort: queryObject.sort ? queryObject.sort : defaultSort,
          tags: queryObject.oTags ? queryObject.oTags : '',
          targetAudiences: queryObject.oTargetAudiences
            ? queryObject.oTargetAudiences
            : '',
          grants: queryObject.oGrants ? queryObject.oGrants : '',
          filters: {
            theme: queryObject.theme ? queryObject.theme : '',
            area: queryObject.area ? queryObject.area : '',
          },
          showArchive: 0,
        };

        if (widget.excludeThemes) {
          params.exclude = {
            theme: widget.excludeThemes,
          };
        }

        if (widget.includeThemes) {
          params.filters = {
            theme: widget.includeThemes,
          };
        }

        const resourceSiteConfigKey = `${resource}s`;
        widget.countdownPeriod =
          (siteConfig[resourceSiteConfigKey] &&
            siteConfig[resourceSiteConfigKey].automaticallyUpdateStatus &&
            siteConfig.ideas.automaticallyUpdateStatus.afterXDays) ||
          0;

        if (queryObject.search) {
          params.search = {
            criteria: [
              {
                title: queryObject.search,
              },
              {
                description: queryObject.search,
              },
            ],
            options: {
              andOr: 'or',
            },
          };
        }

        if (queryObject.showArchive) {
          params.showArchive = 1;
        }

        const siteId = widget.siteId ? widget.siteId : req.data.global.siteId;

        // format string
        const getUrl = `/api/site/${siteId}/${resource}?${qs.stringify(
          params
        )}`;
        const cacheKey = encodeURIComponent(getUrl);

        const options = {
          uri: `${apiUrl}${getUrl}`,
          headers: { Accept: 'application/json', 'Cache-Control': 'no-cache' },
          json: true,
        };

        /*
                   We explicitly don't add JWT since results are cached
                  if (req.session.jwt) {
                    options.headers["X-Authorization"] = `Bearer ${req.session.jwt}`;
                  }
                */

        const queryParams = Object.assign({}, queryObject);

        widget.pathname = widget.pathname
          ? widget.pathname
          : req.data.currentPathname;
        widget.isVotingActive =
          siteConfig && siteConfig.votes && siteConfig.votes.isActive
            ? siteConfig.votes.isActive
            : false;
        widget.voteType =
          siteConfig && siteConfig.votes && siteConfig.votes.voteType
            ? siteConfig.votes.voteType
            : '';

        widget.siteConfig = {
          // TODO: bovenstaande waaarden moeten ook hier in gezet worden
          minimumYesVotes:
            siteConfig && siteConfig.ideas && siteConfig.ideas.minimumYesVotes,
          voteValues: (siteConfig &&
            siteConfig.votes &&
            siteConfig.votes.voteValues) || [
            {
              label: 'voor',
              value: 'yes',
              screenReaderAddition: 'dit plan stemmen',
            },
            {
              label: 'tegen',
              value: 'no',
              screenReaderAddition: 'dit plan stemmen',
            },
          ],
        };

        widget.openstadTags = req.data.openstadTags
          ? req.data.openstadTags.map((tag) => {
              return Object.assign({}, tag);
            })
          : [];

        widget.openstadTargetAudiences = req.data.openstadTargetAudience
          ? req.data.openstadTargetAudience
          : [];
        widget.openstadGrants = req.data.openstadGrants
          ? req.data.openstadGrants
          : [];

        let response;

        // if cache is turned on, check if current url is available in cache
        if (globalData.cacheIdeas) {
          response = cache.get(cacheKey);

          if (response) {
            try {
              response = JSON.parse(response);
            } catch (e) {
              // error in the above string
              console.log(
                'Error in parsing resource overview JSON for url: ',
                getUrl,
                e
              );
            }
          }
        }

        // if cache is set then render from cache, otherwise
        if (response) {
          // pass query obj without reference
          widget = self.formatWidgetResponse(
            widget,
            response,
            Object.assign({}, req.query),
            req.data.currentPathname
          );
        } else {
          promises.push(
            (function (req, self) {
              return new Promise((resolve, reject) => {
                rp(options)
                  .then((response) => {
                    // set the cache by url key, this is perfect unique identifier
                    if (globalData.cacheIdeas) {
                      cache.set(cacheKey, JSON.stringify(response), {
                        life: cacheLifespan,
                      });
                    }

                    // pass query obj without reference
                    widget = self.formatWidgetResponse(
                      widget,
                      response,
                      Object.assign({}, req.query),
                      req.data.currentPathname
                    );

                    resolve(response);
                  })
                  .catch((err) => {
                    reject(err);
                  });
              });
            })(req, self)
          );
        }
      });

      if (promises.length > 0) {
        Promise.all(promises)
          .then(function (response) {
            return superLoad(req, widgets, next);
          })
          .catch(function (err) {
            console.log('errrr', err);
            return superLoad(req, widgets, next);
          });
      } else {
        return superLoad(req, widgets, next);
      }
    };

    self.formatPaginationUrls = (pageCount, baseUrl, defaultParams) => {
      const urls = [];

      for (let i = 0; i < pageCount; i++) {
        // create the url by merging the base url and the pagination paramters and the default params
        urls.push(
          `?${qs.stringify(
            Object.assign(defaultParams, {
              page: i,
            })
          )}`
        );
      }

      // in case only one url, return empty array, pagination is not necessary for one page.
      return urls.length < 2 ? false : urls;
    };

    //selection means it is set to url, so it will be used to query the api
    self.formatTagSelectUrl = (tag, defaultParams) => {
      let getParams = defaultParams ? Object.assign({}, defaultParams) : {};

      defaultParams.page = 0;

      // make sure tags is an array
      getParams.oTags = Array.isArray(getParams.oTags) ? getParams.oTags : [];

      // if not oTags queryparams add it, so a click will "select" this link
      getParams.oTags = self.isTagSelected(tag, defaultParams)
        ? getParams.oTags
        : [...getParams.oTags, tag.id];

      return `?${qs.stringify(getParams)}`;
    };

    self.formatTagRemoveUrl = (tag, defaultParams) => {
      let getParams = defaultParams ? Object.assign({}, defaultParams) : {};

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
      getParams.oTags = self.isTagSelected(tag, defaultParams)
        ? getParams.oTags.filter((tagId) => tagId !== tag.id)
        : getParams.oTags;
      return `?${qs.stringify(getParams)}`;
    };

    self.isTagSelected = (tag, defaultParams) => {
      // console.log('isTagSelected', params);
      let params = defaultParams ? defaultParams : {};

      // make sure the ids are integers, get parameters from url are returned as a string
      if (Array.isArray(params.oTags)) {
        params.oTags = params.oTags.map((tag) => {
          return parseInt(tag, 10);
        });
      }

      return (
        params && Array.isArray(params.oTags) && params.oTags.includes(tag.id)
      );
    };

    //selection means it is set to url, so it will be used to query the api
    self.formatTargetAudienceSelectUrl = (tag, defaultParams) => {
      let getParams = defaultParams ? Object.assign({}, defaultParams) : {};

      defaultParams.page = 0;

      // make sure tags is an array
      getParams.oTargetAudiences = Array.isArray(getParams.oTargetAudiences)
        ? getParams.oTargetAudiences
        : [];

      // if not oTargetAudiences queryparams add it, so a click will "select" this link
      getParams.oTargetAudiences = self.isTargetAudienceSelected(
        tag,
        defaultParams
      )
        ? getParams.oTargetAudiences
        : [...getParams.oTargetAudiences, tag.id];

      return `?${qs.stringify(getParams)}`;
    };

    self.formatTargetAudienceRemoveUrl = (tag, defaultParams) => {
      let getParams = defaultParams ? Object.assign({}, defaultParams) : {};

      defaultParams.page = 0;

      // make sure we have an array
      getParams.oTargetAudiences = Array.isArray(getParams.oTargetAudiences)
        ? getParams.oTargetAudiences
        : [];

      //make sure the ids are integers, get parameters from url are returned as a string
      if (Array.isArray(getParams.oTargetAudiences)) {
        getParams.oTargetAudiences = getParams.oTargetAudiences.map((tag) => {
          return parseInt(tag, 10);
        });
      }

      // if not in queryparams add it, so a click will "select" this link
      getParams.oTargetAudiences = self.isTargetAudienceSelected(
        tag,
        defaultParams
      )
        ? getParams.oTargetAudiences.filter((tagId) => tagId !== tag.id)
        : getParams.oTargetAudiences;
      return `?${qs.stringify(getParams)}`;
    };

    self.isTargetAudienceSelected = (tag, defaultParams) => {
      let params = defaultParams ? defaultParams : {};

      //make sure the ids are integers, get parameters from url are returned as a string
      if (Array.isArray(params.oTargetAudiences)) {
        params.oTargetAudiences = params.oTargetAudiences.map((tag) => {
          return parseInt(tag, 10);
        });
      }

      return (
        params &&
        Array.isArray(params.oTargetAudiences) &&
        params.oTargetAudiences.includes(tag.id)
      );
    };

    //selection means it is set to url, so it will be used to query the api
    self.formatGrantSelectUrl = (grant, defaultParams) => {
      let getParams = defaultParams ? Object.assign({}, defaultParams) : {};

      defaultParams.page = 0;

      // make sure tags is an array
      getParams.oGrants = Array.isArray(getParams.oGrants)
        ? getParams.oGrants
        : [];

      // if not oGrants queryparams add it, so a click will "select" this link
      getParams.oGrants = self.isGrantSelected(grant, defaultParams)
        ? getParams.oGrants
        : [...getParams.oGrants, grant.id];

      return `?${qs.stringify(getParams)}`;
    };

    self.formatGrantRemoveUrl = (grant, defaultParams) => {
      let getParams = defaultParams ? Object.assign({}, defaultParams) : {};

      defaultParams.page = 0;

      // make sure we have an array
      getParams.oGrants = Array.isArray(getParams.oGrants)
        ? getParams.oGrants
        : [];

      //make sure the ids are integers, get parameters from url are returned as a string
      if (Array.isArray(getParams.oGrants)) {
        getParams.oGrants = getParams.oGrants.map((grant) => {
          return parseInt(grant, 10);
        });
      }

      // if not in queryparams add it, so a click will "select" this link
      getParams.oGrants = self.isGrantSelected(grant, defaultParams)
        ? getParams.oGrants.filter((grantId) => grantId !== grant.id)
        : getParams.oGrants;
      return `?${qs.stringify(getParams)}`;
    };

    self.isGrantSelected = (grant, defaultParams) => {
      let params = defaultParams ? defaultParams : {};

      //make sure the ids are integers, get parameters from url are returned as a string
      if (Array.isArray(params.oGrants)) {
        params.oGrants = params.oGrants.map((grant) => {
          return parseInt(grant, 10);
        });
      }

      return (
        params &&
        Array.isArray(params.oGrants) &&
        params.oGrants.includes(grant.id)
      );
    };

    self.formatWidgetResponse = (widget, response, queryParams, pathname) => {
      // Remove all tags & attributes from the search query param
      const sanitizedSearch =
        queryParams.search &&
        sanitize(queryParams.search, {
          allowedTags: [],
          allowedAttributes: {},
        });

      widget.paginationIndex = response.metadata.page + 1;
      widget.totalItems = response.metadata.totalCount;
      widget.paginationUrls = self.formatPaginationUrls(
        response.metadata.pageCount,
        pathname,
        queryParams
      );
      widget.formattedResultCountText = widget.resultCountText
        ? widget.resultCountText
            .replace('[visibleCount]', response.records.length)
            .replace('[totalCount]', response.metadata.totalCount)
        : '';
      widget.formattedSearchText =
        widget.searchText && queryParams.search
          ? widget.searchText.replace('[searchTerm]', sanitizedSearch)
          : '';
      widget.activeResources = response.records
        ? response.records.map((record) => {
            // delete because they are added to the data-attr and will get very big
            //  delete record.description;
            let daysOld = parseInt(
              (Date.now() - new Date(record.startDate).getTime()) /
                (24 * 60 * 60 * 1000)
            );
            record.countdown = widget.countdownPeriod - daysOld;
            return record;
          })
        : [];

      return widget;
    };

    const superOutput = self.output;

    self.output = function (widget, options) {
      // count amount of filters active in topbar
      widget.itemsInTopFilterBar = [
        widget.displaySearch,
        widget.displayAreaFilter,
        widget.displayThemeFilter,
      ].filter((displayFilter) => displayFilter).length;

      // add the label to the select sort options for displaying in the select box
      widget.selectedSorting = widget.selectedSorting
        ? widget.selectedSorting.map((sortingValue) => {
            const sortingOption = sortingOptions.find(
              (sortingOption) => sortingOption.value === sortingValue
            );

            return {
              value: sortingValue,
              label: sortingOption ? sortingOption.label : sortingValue,
            };
          })
        : [];

      widget.formatImageUrl = function (
        image,
        location,
        widget,
        width,
        height,
        crop,
        cookieConsent
      ) {
        let url;
        if (image) {
          url = image + '/:/rs=w:' + width + ',h:' + height;
          url = crop ? url + ';cp=w:' + width + ',h:' + height : url;
        } else if (widget.defaultImage) {
          url = self.apos.attachments.url(widget.defaultImage);
        } else {
          url = '/modules/openstad-assets/img/placeholders/idea.jpg';
        }

        return url;
      };

      widget.getTitleText = function (resource, fieldname) {
        fieldname = fieldname || 'title';
        let value = resource;
        fieldname.split('.').forEach((key) => {
          value = value[key];
        });
        value = value || '';
        return value;
      };

      if (widget.filterResources) {
        const resourceIds = widget.filterResources
          .split(',')
          .map(function (item) {
            return parseInt(item.trim(), 10);
          });

        widget.activeResources =
          resourceIds.length > 0
            ? widget.activeResources.filter(
                (idea) => resourceIds.indexOf(idea.id) !== -1
              )
            : widget.activeResources;
      }

      return superOutput(widget, options);
    };
  },
};
