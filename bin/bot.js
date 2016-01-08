'use strict';

var Hal9001 = require('../lib/hal9001');

var token = process.env.HAL9001_SLACK_TOKEN;
var name = 'hal9001';

var hal9001 = new Hal9001({
    token: token,
    name: name
});

hal9001.run();
