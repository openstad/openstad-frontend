# Changelog

## UNRELEASED
* Add submission to resource form with configurable confirmation settings

## v0.40.0
* Update version number

## v0.24.0
* Make autoCenter configurable in idea-map-widgets
* Let idea-page like buttons use the site config
* Fixed: remove freshLogin param also removed #hashpart from an url
* Remove progressbar on idea-page when no like buttons are available
* Fix login email links
* Fix: add an iconSectionId field which can be used to link via URL
* Fix weird tab behaviour
* Fix resource form input counter
* Remove hideVotes option from resource representation
* Move docker builds from travis to github actions
* Remove global option mapImageFlag

## v0.23.0
* Remove gebiedsontwikkelings tool widget
* Add choices guide option to counter widget
* resource-form-widgets: Make login text configurable
* Make My account button text configurable
* Add first batch of accessibility fixes from retest
  * Add an accessible location field to the resource form
  * Add screen reader labels to the filter input fields above the resource overview. Also an autocomplete attribute was added to the resource overview filter.
  * Add a focus indicator to the thumbs up button inside an argument form
  * Update the red amsterdam variable and changed old hex codes to the @amsterdam-red variable
  * Change the html order of the menu so that the focus goes directly into the submenu.
  * Add the aria-current attribute to the current page menu item
  * Add a screen reader only text to the voting progress bar at a single idea page and in the ideas in the resource overview.
  * Add a focus psuedo element to the delete button in the participatory budgeting widget.
  * Change the javascript so that the message for the characters in a form is accessible and audible.

## v0.22.0
* Fix countdown in resource-overview
* Use User.displayName instead of first/lastName. Remove hideUserLastName, userNameFields, showLastName.
* Add alias to user form (nickname)
* Styling user activity list
* New tab layout and styling according to Asmterdam design system
* Make sure only freshly returned users autosubmit voting

## v0.21.0
* Add global option to disable newsletter captcha
* Add options to hide votes / status / last name in resource-representation-widgets
* Allow title above share buttons to be changed in resource-representation-widgets
* Allow counter-widgets to display the argument count for a specific idea
* Make embedded auth forms label en button text configurable in widget
* Fix counter button urls in subdir sites
* Fix HTML injection in search form in the resource overview widget
* Add CMS_DEFAULTS to environment vars; specifically analyticsType and analyticsCodeBlock
* Reorganise Participatory Budget fields in widget
* Reorganise Status Label fields in Resource Overview widget

## v0.20.3
* Make sure ideas are existing on the page in Participatory budgetting

## Unreleased
* Add a new text style to select in the rich text editor.

## v0.20.2
* Fix resource overview widget error: TypeError: Cannot read property 'automaticallyUpdateStatus' of undefined

## v0.20.1
* Version made for build fixes in travis

## v0.20.0
* Replace arguments widgets bij openstad-components widgets
* Add automatic update of idea status after a given number of days
* Allow button & links to only be visible for moderators
* Make embedded auth forms label en button text configurable in widget
* Fix stats for subdirs

## v0.19.0 (2021-08-17)
* Better settings for closed reactions on idea-on-map
* Don't show pagination if only one page
* Add larger minimum height to prevent overlapping controls on the map application
* Make sure default logo's width is correct
* Add user account features: active user in resource form, user activity & sites logged in resource representation, type account page

## v0.18.0
* Autosubmit vote in resource overview after ret2urn from oauth
* Autosubmit vote in participatory budgeting after returning from oauth
* Set default noOfQuestionsToShow to 100
* Add components cdn and version automation - OPENSTAD_COMPONENTS_URL in .env is now optional, and renamed to OPENSTAD_COMPONENTS_CDN
* Add react-admin cdn and version automation - OPENSTAD_REACT_ADMIN_URL in .env is now optional, and renamed to OPENSTAD_REACT_ADMIN_CDN
* Make sure that basic auth is handled before anything else
* Resource-overview: show api error on failed vote
* Show API status code on error (was always 500)
* Make the vote button in resource-overview editable
* Fix location picker if no polygon

## v0.17.1 (2021-07-14)
* Add user authorization to imgage upload

## v0.17.0 (2021-06-08)
* Add config options to openstad components: default image, aspect ratio, allow multiple
* Fix cookie warning in iframes
* Fix js error when editing choices guides

## v0.16.1 (2021-06-01)
* Add option startWithAllQuestionsAnsweredAndConfirmed to Choices Guide

## v0.16.0 (2021-04-26)
* Add cookie consent for video widget

## v0.15.0 (2021-04-06)
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

## v0.14.1 (2021-03-17)
* Add check to make sure if href not exists in a tags Rich Text the sanitize functions fails

## v0.14.0 (2021-03-17)
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

## v0.13.0 (2021-02-23)
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
