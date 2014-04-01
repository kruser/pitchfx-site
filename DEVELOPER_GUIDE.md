# BaseballMod.com Developer Guide

## Overview
BaseballMod.com is a webapp for searching PitchFX baseball data. It is architected using all open-source 
technologies and is meant to be developed and improved by the baseball development community. This
document is a guide for all developers wanting to build features for BaseballMod.com or contribute simple
bug fixes.

Developers contributing significantly to the code base will get attribution on the BaseballMod.com home
page. This is an excellent way to get recognized by the several MLB teams that visit BaseballMod.com
and even watch/star this github repository.

Still interested in contributing? Read on....

## Setting up the server
This app is built with a MEAN stack, meaning the following technologies.

* MongoDB - all data is stored in a MongoDB database that has been created using the <a href="https://github.com/kruser/atbat-mongodb">atbat-mongodb project</a>
* ExpressJS - a web application framework for node
* AngularJS - client side UI framework
* Node.js - serves the static web content and REST APIs

### Installation
These installation instructions were written on Linux and MacOS. If you have updates for Windows please fork and update the instructions accordingly.

#### MongoDB
The first thing you should get setup in the database. This project uses a MongoDB database that is only accessed
via the localhost, so no additional security is necessary. 

Follow the MongoDB installation instructions here: http://docs.mongodb.org/manual/installation/

#### ETL
After you have MongoDB installed, you'll need to checkout the <a href="https://github.com/kruser/atbat-mongodb">atbat-mongodb project</a>.

    git clone https://github.com/kruser/atbat-mongodb.git
  
Follow the installation instructions here: https://github.com/kruser/atbat-mongodb/blob/master/README.md

Once you are able to run that ETL script and can ensure you have data in your database you can move on to checking out the code in 
this project.

#### NodeJS
Before checking out this website's code base you'll want to install NodeJS. Installation binaries are provided
for all popular operating systems by visiting the NodeJS website here: http://nodejs.org/

#### Installing the BaseballMod.com web application
First clone the BaseballMod.com repository and move into that directory.

    git clone https://github.com/kruser/pitchfx-site.git
    cd pitchfx-site
  
After the code base is checked out you'll need to install the dependencies using npm and bower commands below.

    sudo npm install -g grunt-cli
    sudo npm install -g bower
    cd app
    npm install
    bower install
    grunt serve

The *grunt serve* command sets up a socket-io connection to your browser and delivers any code changes live to your
browser without even a refresh. Give it a try by editing a simple file like *app/app/views/index.html*.
If things are setup correctly, your browser should reflect your changes immediately.

#### Working on the webapp
The BaseballMod.com app was created using a Yeoman generator. If you've never used Yeoman, you'll need to install
it now.

    npm install -g yo
    
More information about yeoman can be found here: http://yeoman.io/. Essentially it is a templating
system for setting up a folder structure and for generating chunks of code in the right places.

Next up you'll want to install the *angular-fullstack* yeoman generator.

    npm install generator-angular-fullstack
    
BaseballMod.com uses AngularJS heavily for the UI for templating and dependency injection. If you've never
used AngularJS before you'll need to learn a few things before continuing. You can either visit http://angularjs.org
or watch this great video: http://www.youtube.com/watch?v=i9MHigUZKEM

Once you know the basics of AngularJS you may know what you want to do next. Let's break these into a
couple different possibilities. Let's say you want to create a new AngularJS *directive*. To do
so using the angular-fullstack generator you'll simply run this yeoman command:

    yo angular-fullstack:directive <name-of-directive>
    
This will create two files, one for the directive and one for the unit test to test the directive.
The latter is just as important as the former. Fill out the test appropriately. There is more on
unit tests later in this document.

You can use the yeoman generator to build all sorts of angular things. The generator will
put the files in the appropriate location so you don't have to make these decisions.

More information about the generator can be found here: https://www.npmjs.org/package/generator-angular-fullstack

#### What to work on?
BaseballMod.com uses GitHub issue tracking for all issues, enhancements and discussions. If you're looking
for something to work on, just look through the open issue list here: https://github.com/kruser/pitchfx-site/issues?state=open

If you find something interesting that isn't assigned to anybody feel free to comment on it and start
working on it. If you have an idea for something that isn't there, you can submit your own issue and 
we'll discuss it with you.

#### How to submit code?
BaseballMod.com uses GitHub pull requests for all code submissions. In short, that means you'll...
* clone this repo
* create a branch for your work
* submit a pull request back using that branch

Full details on how to do that can be found in the GitHub documentation here: https://help.github.com/categories/63/articles

#### Continuous Integration Builds
When you submit a pull request, we automatically run our continuous integration builds thanks to 
the wonderful Travis CI build server.

Details of each build can be found directly on the Travis CI site here: https://travis-ci.org/kruser/pitchfx-site

In addition, you'll find the state of the build on each pull request and on the main GitHub page.

For example, the current state of the master branch build is....

[![Build Status](https://travis-ci.org/kruser/pitchfx-site.png?branch=master)](https://travis-ci.org/kruser/pitchfx-site)

Our builds run jshint and Karma unit/integration tests.

#### JSHint
JSHint is tool for enforcing coding standards into what can be the untamed world of javascript.
Running JSHint allows us to catch potential bugs before they enter the source base.

The rules of our jshint configuration can be found in the *.jshintrc* file in the root of this
project. There is a separate .jshintrc in the test directory as well since tests run with different
allowed globals.

You can point your favorite IDE at these .jshintrc files if you have a plugin that can understand
them. To run them via the command line, as does our Travis CI build, simply run this command:

    grunt jshint

#### Karma Tests
Karma is a test runner built by the AngularJS team. Along with Karma we describe tests using the Jasmine
spec. Examples of tests can be found in the *app/test/spec* directory.

To run unit tests simply run:
    
    grunt test
    
If you're developing code and want to keep tests running, you'll want to startup Karma such that
it watches all of your changes realtime. To do so, make sure the main server isn't running, and
startup karma directly using...

    karma start

Karma will then watch all of your files, and as you change either a test spec file or a source
file, Karma will run the entire suite of tests. It does this to promote quick development
using test-driven-development (TDD) ideas.

Like JSHint, the Karma test suite will be run on each branch and pull request. Failures in
tests will be evident on the pull request itself.

#### Beautiful Code
One of the things to worry about when working on a distributed codebase, is how to keep the code
readable across commits from any user. For this we use js-beautifier. While you're not strictly required
to beautify your code before you submit a pull request, doing so will mean that nobody else has to.

So, immediately before committing your code you should run this super simple grunt task:

    grunt jsbeautify
    
After running, you should see code changes to your files. Mainly these will be whitespace formatting
issues, resulting in beautiful code.