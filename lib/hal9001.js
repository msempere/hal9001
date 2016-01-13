'use strict';

var RDS = require('../lib/rds');
var EC2 = require('../lib/ec2');
var S3 = require('../lib/s3');
var common = require('../lib/utils');

var util = require('util');
var Bot = require('slackbots');
var AWS = require('aws-sdk');

var Hal9001 = function Constructor(settings) {
    this.settings = settings;
    this.settings.name = this.settings.name || 'hal9001';
};

util.inherits(Hal9001, Bot);

module.exports = Hal9001;

Hal9001.prototype.run = function () {
    Hal9001.super_.call(this, this.settings);

    this.on('start', this._onStart);
    this.on('message', this._onMessage);
};

Hal9001.prototype._onStart = function () {
    this._loadBotUser();
};

Hal9001.prototype._loadBotUser = function () {
    var self = this;

    // services to load
    this.plugins = [EC2, RDS, S3];

    AWS.config.update({region: 'eu-west-1'});
    this.AWS_services = {
        'cloudwatch': new AWS.CloudWatch({apiVersion: 'latest'}),
        's3': new AWS.S3({apiVersion: 'latest'})};

    this.user = this.users.filter(function (user) {
        return user.name === self.name;
    })[0];
};

Hal9001.prototype._isChatMessage = function (message) {
    return message.type === 'message' && Boolean(message.text);
};

Hal9001.prototype._isGroupConversation = function (message) {
    return typeof message.channel === 'string' &&
                    message.channel[0] === 'G';
};

Hal9001.prototype._isChannelConversation = function (message) {
    return typeof message.channel === 'string' &&
                    message.channel[0] === 'C';
};

Hal9001.prototype._isDirectConversation = function (message) {
    return typeof message.channel === 'string' &&
                    message.channel[0] === 'D';
};

Hal9001.prototype._isFromBot = function (message) {
    return message.user === this.user.id;
};

var isDirect = function(userId, messageText) {
    var userTag = common.makeMention(userId);
    return messageText &&
           messageText.length >= userTag.length &&
           messageText.substr(0, userTag.length) === userTag;
};

Hal9001.prototype._isMentioningBot = function (message) {
    return isDirect(this.user.id, message.text);
};

Hal9001.prototype._getChannelById = function (channelId) {
    return this.channels.filter(function (item) {
        return item.id === channelId;
    })[0];
};

var isHelp = function(message) {
    var re_help = new RegExp('.*help.*', 'i');
    if(re_help.exec(message)){
        return true;
    }
    return false;
}

Hal9001.prototype._displayHelp = function (channel) {
    var help_message = '\nUsage: <command> <id>\n\nwhere <command> is one of:\n';
    var descriptions = '';

    var index;
    for(index=0; index<this.plugins.length; index++){
        help_message += "\t" + common.bold(this.plugins[index]().getNamespace()) + ", ";
        descriptions += this.plugins[index]().getHelperDescription();
    }

    help_message += "\t" + common.bold("help") + "\n\n";
    help_message += descriptions;
    help_message += "\thal9001 " + common.bold("help") + "\t\t shows this help\n";

    this.postMessage(channel, help_message, {as_user: true, mrkdwn: true});
};

Hal9001.prototype._parseUserInput = function (message) {
    var self = this;
    var index;
    var re_plugins = '';

    // generate input regex taking into account loaded plugins from _loadBot
    for(index=0; index<this.plugins.length; index++){
        re_plugins += this.plugins[index]().getNamespace() + '|';
    }

    re_plugins = util.format('.*(%s)\\s+([a-zA-Z0-9\\-/]+)\\s*([a-zA-Z0-9\\-/]+)?.*', re_plugins.slice(0, re_plugins.length - 1));
    var m = message.text.match(new RegExp(re_plugins));

    // m[1] : service
    // m[2] : id / bucket
    // m[3] : metric / key

    if(m && m.length >= 3){
        console.log(m[1], m[2], m[3]);
        var service_found = false;

        // checks which service has to run from loaded plugins
        for(index=0; index<this.plugins.length; index++){
            var plugin = this.plugins[index](this.AWS_services,
                                            self,
                                            message.channel);
            if(m[1] == plugin.getNamespace()){
                plugin.displayMetric(m[2], m[3]);
                service_found = true;
            }
        }
        // service not recognized
        if(!service_found){
            self.postMessage(message.channel, "Service '" + m[1] + "' not loaded. Please contact my creator", {as_user: true});
        }
    }
    // input doesn't match regular expression
    else{
        self.postMessage(message.channel, "?", {as_user: true});
    }
};


Hal9001.prototype._reply = function (message) {
    var self = this;

    if(isHelp(message.text)){
        this._displayHelp(message.channel);
    }
    else{
        this._parseUserInput(message);
    }
};

Hal9001.prototype._onMessage = function (message) {
    if(this._isChatMessage(message) && (this._isDirectConversation(message) ||
                                        this._isChannelConversation(message) ||
                                        this._isGroupConversation(message))
                                        && this._isMentioningBot(message)) {
        this._reply(message);
    }
};


