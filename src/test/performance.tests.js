"use strict";

var Unit = require('deadunit/deadunit.browser')

var Gem = require("../Gem.browser")
Gem.dev = true

require('./performanceTests/add.performance')
require('./performanceTests/style.performance')