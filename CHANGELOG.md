# Changelog


## pre-v0.10.0 (UNRELEASED)
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
