# Changelog

## UNRELEASED
* Make submissions listable & viewable, and allow them to be filtered by formId

## v0.17.0
* Add option to anonymize only selected users at /api/site/:SITE_ID/user/:USER_ID/do-anonymizeall
* Add automatic update of idea status after a given number of days
* Add 'Project has ended' to site configuration
* Add endpoints /api/site/:id/(do|will)-anonymize-all-users

## v0.16.0
* Add endpoint /user/:id/activity
* Add endpoints /user/:id/(do|will)-anonymize(all?)
* Areas only create, edit, delete by admin
* User email no longer editable by owner
* Fix extraData returning for Article by adding includeSite to the scope
* Fix users can create/update/delete users with a higher role
* Statuscode for error 'Already voted' was 500 and is now 403

## v0.15.1 (2020-07-14)
* Give anonymous user the default correct role

## v0.15.0 (2020-06-08)
* Add create/update date to choices-guide results
* Allow moderators to update role of users to member (but not to moderator or admin role)


## v0.14.0 (2020-03-17)
* Add stats overview route for displaying statistics, currently used in react admin on CMS and Admin panel
* Add isActive check on choices-guide
* ChoicesGuide: add list results endpoint
* Bugfix on nested argument attributes

## v0.13.0 (2020-02-23)
* Add login required to choices-guide results
* Include areas with polygons when fetching all site, fixes not showing of polygons. But makes site call substantially bigger, in future might have to move to a different call somewhere.
* Add user create logic to the User route, syncs tih the OAuth API

## v0.12.0 (2021-01-27)
* Remove auth express session and refactor user middleware (auth is now stateless)
* Fix fallback authClientId
* Use correct env variable for default client_id and client_secret values

## v0.11.0 (2020-11-09)
* Release user listableByRole

## v0.10.0 (2020-12-09)
* Open /stats/site/:SITE_ID/vote/total for everybody
* Add sanitizeIfNotNull decorator to the sanitize util to prevent transforming of null into the string 'null'
* Rename users.viewableByRole to listableByRole and fix the corresponding scope
* Add users.detailsViewableByRole, i.e. authorisation on fields defined per instance

## v0.9.1 (2020-12-9)
* Add idea votes to user me call

## v0.9.0 (2020-11-25)
* Update NPM modules for security
* Fix site reset config
* Remove unused global vimeo fields
* Added possibility to query GET overview routes with NOT (!=) and substring (like%%) operator
* Add option to list user data publically or per role
* Allow viewablebyRole to be edited by the user


## v0.8.0 (2020-11-02)
* Add id & extraData to properties included in idea GET call with param includeUser=1
* On update user of for all sites add check if site exists, otherwise update breaks
* If extraData.images is set then the new value ovreplaces the old value instead of being merged (it waas impossible to delete images)
* Add min/max number of to budgeting voting
* Make sure postcode validation doesn't fail on an empty string
* Add Delete route for vote
* Feature: Add option count-per-theme to voting in participatory budgeting

## 0.7.6 (2020-10-07)
* Votes were viewable when they should not be

## 0.7.5 (2020-10-05)
* Correct lat & lng parsing when uploading a polygon with geoJSON, it's lng, lat instead of more common used lat, lng

## 0.7.4 (2020-09-22)
* Define per user fields which role is allowed to see it

## 0.7.3 (2020-09-16)
* Fix turned around clientId for admin site creation

## 0.7.2 (2020-09-16)
* Integrate migration changes for generating proper database

## 0.7.1 (2020-09-16)
* Fix ideaTags constraint error on creating databases with node reset.js with certain mysql settings (k8s issue)

## 0.7.0 (2020-09-15)
* Start of using version numbers in changelog
