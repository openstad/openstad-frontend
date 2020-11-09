# Changelog

## UNRELEASED
* Update NPM modules for security
* Don't add JWT when doing a resource overview call since results are cached
* Empty cache on DELETE call via api proxy
* Styling: alignment of carter in list-style link button
* In moderator warning change the if so no extra div's are rendered when no warning is shown


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
