"use strict";

var Unit = require('deadunit/deadunit.browser')

var blocks = require("../blocks.browser")
blocks.dev = true

require('./performanceTests/add.performance')