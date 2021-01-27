# Changelog

## v0.11.0 (2020-01-11)
* Make the (Google) Analytics block configurable to provide for a new version and also other options
* Add html class name to resource overview
* Clear cached session openstad user when making api call or logging out
* Add an extra choices type to the choices guide
* Accessibility improvements

## v0.10.1 (2020-12-09)
* Cache openstad user longer when logged in to cms

## v0.10.0 (2020-12-09)
* Make description textarea in icon-section
* Show message that user needs to be logged in for viewing admin widget
* Add SVG captcha to newsletter signup
* Content fields in ideas-on-map now include an old deprecated value as fallback
* Content fields helptekst is updated
* Limit user cache to 5 seconds, and only for CMS users

## v0.9.1 (2020-12-07)
* Turning of synchronising incorrect idea settings to the API

## v0.9.0 (2020-11-25)
* Fix: Ideas Map had an option to not link Flags. The option had disappeared but is now back.
* Feature: Better explanations in global newsletter settings
* Add admin warning to vote counter if vote count is not publicly available
* Update NPM modules for security
* Don't add JWT when doing a resource overview call since results are cached
* Empty cache on DELETE call via api proxy
* Styling: alignment of caret in list-style link button
* In moderator warning change the if statement so no extra div's are rendered when no warning is shown
* Remove global field translations, not used anymore
* Fix: Ideas Map had an option to not link Flags. The option had disappeared but is now back.
* Better explanations in global newsletter settings
* Feature: Add option count-per-theme to voting in participatory budgeting
* Bugfix: participatory budgeting per theme showed error in the wrong tab
* Bugfix: participatory budgeting showed wrong button text in count mode
* Bugfix: participatory budgeting ran into a js error when the pricetag was not shown
* Bugfix: participatory budgeting next button in step 0 showed an incorrect error
* Bugfix: voting in resource overview widget no also works in conjunction with pagination
* Bugfix: remove images after update of idea resource
* Make cookie max age configurable
* Add ability to make cookie message fixed to the bottom per page
* Fix: api/area needs to be called without authentication header
* Remove button-blue class from vote counter
* Fix wrong error in budgeting
* Fix previous/next buttons CSS in budgeting
* Possibility to display top links dependent on user logged in status
* Fix: Ideas Map had an option to not link Flags. The option had disappeared but is now back.
* Feature: Better explanations in global newsletter settings
* Add admin warning to vote counter if vote count is not publicly available
* Allow public profile status (viewablebyRole) to be edited by the user


## v0.8.3 (2020-11-06)
* Fix: api/area needs to be called without authentication header

## v0.8.2 (2020-11-03)
* Update react-admin

## v0.8.1 (2020-11-02)
* Vimeo fix for old idea form
* Vimeo secrets moved to siteConfig

## v0.8.0 (2020-11-02)
* Feature: ideas-on-map has a simple view
* Feature: ideas-on-map details can link to user profile page
* Bugfix: counterbuttons will now work if multiple buttons on exist on a page
* Bugfix: counterbuttons will no longer show -1 on zero votes
* Bugfix: Edit url in resource overview with gridder would only work with resource type Idea, now will work with every resource type
* Bugfix: added callback for resource page, in some cases an endless loading page would appear
* Bugfix: Display showVoteCounter field when gridder option is selected in resource overview widget
* Add field to resource overview  edit to base edit url for gridder overview edit link ("bewerken")
* Add siteId option to resource overview, allowing for displaying ideas and other resources from other site in an overview
* Add ability to link to resource pages with complexer placeholder url (For example #idea:id -> #idea8)
* Remove deprecated show admin bar field from global
* Update default openstad logo
* Add raw and hidden input field to resource form, and option to prefill dynamic fields from url
* Resource form give warning when leaving with unsaved changes
* Add ability to hide the edit and delete button in resource admin button, for existing sites need to be set to display manually
* Add min/max number of to budgeting voting
* Bugfix use Buffer.byteLength instead of .length for content-length for body api proxy, this breaks with special characters
* Add refreshSiteConfig call after updating a site config
* Correct metaTitle for idea and other resources
* Extra config options in ideas-on-map for search and details presentations

## v0.8.0-PRERLEASE (2020-17-07)
* Feature: ideas-on-map has extra configuration options on search and idea details

## 0.7.4
* Hotfix: make resource form is usable by any moderator, not just admins

## 0.7.3
* Fix for html containerId using widget._id for icon-section, otherwise when duplicating multiple sections share the same html id

## 0.7.2 (2020-09-28)
* Fix for resource admin buttons not appearing
* Fix for description in resource overview not displaying in gridder

## 0.7.1
* Hotfix: apply oembetter whitelist to openGraph requests to prevent SSRF

## 0.7.0 (2020-09-15)
* Start of using version numbers in changelog
