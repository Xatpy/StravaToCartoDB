StravaToCartoDB
===============

## From Strava data to CartoDB maps

Import your data in CartoDB from Strava app, and create fancy maps about where you run. 

## Instructions

Create a table in your CartoDB with the following columns:

- name (string)
- time (number)
- date (string)

Then, insert your table name in app.js

### History 

11-28-2014: Get athlete photo and insert a map in the index.

11-22-2014: Insert all Strava activity to one CartoDB table. Example [TorqueCat map:]( http://team.cartodb.com/u/xatpy/viz/29edc996-726c-11e4-887c-0e018d66dc29/embed_map )

11-21-2014: First commit. Get list activities from Strava. Get info activity and insert to CartoDB.
