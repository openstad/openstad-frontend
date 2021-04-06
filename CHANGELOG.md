# Changelog

## v0.15.0 (2020-04-06)
* Hide palette in global modal
* Move editUrl in resource overview widget to display so it's easier to find
* Add caption to vote counter in resource overview widget
* Add a bunch of selectable styling classes to section, title and raw widgets
* Make inline styling selected via a random CSS class, instead of relying on widget._id since this turns out to not always be unique after copying (when it's parent is copied)
* Remove warning not the right budgeting type
* Better export of choices-guide results
* Move google static map image to interactive map in Participatory Budgeting Widget
* Added configuration of idea types to global settings
* Select custom tiles server in idea-on-map.
* Use global area in ideas-on-map

## v0.14.1 (2020-03-17)
* Add check to make sure if href not exists in a tags Rich Text the sanitize functions fails

## v0.14.0 (2020-03-17)
* Load files with static middleware instead of sendFile, fallback to ApostropheCMS in case a file is not found
* Remove nlmaps map type from all widget files, not necessary to set MAP_TYPE env value anymore
* Check if maps exists in some places
* Add page cache for non logged in users
* Remove idea-single, idea-overview and idea-form files (templates will display warning for now)
* Update choices-guides to a production level
* CSS fix: Make sure logo is fully clickable and side menu doesn't overlap
* CSS fix: Adjust logout link in menu margin for better alignment
* CSS fix: Make padding for search box same as select
* CSS fix: Add small padding tweaks
* Fix displaying default image in gridder
* Fix gridder not working on pagination
* Remove googlemaps streetview fallback image from all widgets
* Disable mousewheel zoom on maps
* Add sanitize function to href in rich text, which adds siteUrl to relative paths

## v0.13.1 (2021-03-02)
* Better errors in participatory-budgeting when no plans are selected yet

## v0.13.0 (2020-02-23)
* Add login required to choices-guide results
* Use refactored react components
* Change default styling for toggle title in section
* Update apostrophe to 2.113.0 for @openstad/cms & run `npm update` in root to fix a YouTube oembed bug
* Add an oembed API endpoint to siteConfig for vimeo.com videos to prevent Vimeo blocking scrapes from oembetter
* Fix bug in Participatory Budgeting where removing ideas in the selection was stored wrongly.
* Fix incorrect closing tag in slider widget
* ideas-on-map fixes and extensions
* Fix openstreetmaps for Forms and Overview
* Move big libs and assets to dynamic loading
* Fixes on choices-guide result forms
* Add choices guide to /admin

## v0.12.0 (2021-01-27)
* Allow for running multiple sites on subdirectories
* Accessibility improvements

## v0.11.0 (2021-01-11)
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
