If you are seeing this message, the site is not yet complete.
============

pitchfx-site
============

### Overview
A webapp for searching PitchFX data. This app is built with the following technologies.

* Node.js - serves the static web content and REST APIs
* AngularJS - client side UI framework
* MongoDB - all data is stored in a MongoDB database that has been created using the <a href="https://github.com/kruser/atbat-mongodb">atbat-mongodb project</a>

### Installation

#### Prereqs

You'll need to install MongoDB and Node.js. Installation of those two pieces of software is beyond the scope of this document.

You'll also need to setup your atbat database using the ETL program <a href="https://github.com/kruser/atbat-mongodb">atbat-mongodb project</a>

#### Install
To install and start this node application, execute these commands

  cd app
  npm install
  node app

### APIs
This site, in addition to having an awesome UI, provides two APIs. Yes, just two.

#### At-Bats API
You can access at-bats for any batter or pitcher in any time frame by using the atbats API. Example usage is as follows.

To access for the batter with the ID 150275 for the month of August 2013

  http://localhost:3000/api/atbats?batter=150275&start=8/1/2013&end=9/1/2013
  
To access for the pitcher with the ID 89231 for the month of August 2013

  http://localhost:3000/api/atbats?batter=89231&start=8/1/2013&end=9/1/2013
  
Note, the start and end dates take simple javascript date formats as they are parsed with *new Date(str)*.

#### Players API
To get at bats for a batter or a pitcher you'll first need to know that players ID. You can use the player API to retrieve such information.

TODO: kruser
