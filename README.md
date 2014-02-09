PitchFX.org
============

### Overview
PitchFX.org is are webapp for searching PitchFX data. This app is built with a MEAN stack, meaning the following technologies.

* MongoDB - all data is stored in a MongoDB database that has been created using the <a href="https://github.com/kruser/atbat-mongodb">atbat-mongodb project</a>
* ExpressJS - a web application framework for node
* AngularJS - client side UI framework
* Node.js - serves the static web content and REST APIs

### Installation

#### Prereqs

You'll need to install the following technologies first.
* MongoDB
* Node.js

Installation of those two pieces of software is beyond the scope of this document.

You'll also need to setup your atbat database using the ETL program <a href="https://github.com/kruser/atbat-mongodb">atbat-mongodb project</a>

#### Install
To install and start this node application, execute these commands

    sudo npm install -g grunt-cli
    sudo npm install -g bower
    cd app
    npm install
    bower install
    grunt serve

### APIs
This site, in addition to having an awesome UI, provides two APIs. Yes, just two.

#### At-Bats API
You can access at-bats for any batter or pitcher in any time frame by using the atbats API. Example usage is as follows.

To access for the batter with the ID 150275 for the month of August 2013

    http://localhost:3000/api/atbats?batter=150275&start=8/1/2013&end=9/1/2013
  
To access for the pitcher with the ID 89231 for the month of August 2013

    http://localhost:3000/api/atbats?pitcher=89231&start=8/1/2013&end=9/1/2013
  
Note, the start and end dates take simple javascript date formats as they are parsed with *new Date(str)*.

#### Players API
To get at bats for a batter or a pitcher you'll first need to know that players ID. You can use the player API to retrieve such information.

    http://localhost:3000/api/players?search=joe%20mau
    
And, to get a full list of players, simply HTTP GET the following

    http://localhost:3000/api/players
    
If you know a players ID, like 89231, you can retrieve the player in question with a GET to...

    http://localhost:3000/api/players/89231

The players API also supports the paging parameters *from* and *size*. For example...

    http://localhost:3000/api/players?from=0&size=20
    http://localhost:3000/api/players?from=20&size=20
    http://localhost:3000/api/players?from=40&size=20

