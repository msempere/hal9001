'use strict';

var RDS = require('../lib/rds');
var EC2 = require('../lib/ec2');

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

    AWS.config.update({region: 'eu-west-1'});
    this.cloudwatch = new AWS.CloudWatch({apiVersion: 'latest'});

    this.user = this.users.filter(function (user) {
        return user.name === self.name;
    })[0];
};

Hal9001.prototype._isChatMessage = function (message) {
    return message.type === 'message' && Boolean(message.text);
};

Hal9001.prototype._isChannelConversation = function (message) {
    return typeof message.channel === 'string' &&
                    message.channel[0] === 'G';
};

Hal9001.prototype._isDirectConversation = function (message) {
    return typeof message.channel === 'string' &&
                    message.channel[0] === 'D';
};

Hal9001.prototype._isFromBot = function (message) {
    return message.user === this.user.id;
};

var makeMention = function(userId) {
        return '<@' + userId + '>';
};

var isDirect = function(userId, messageText) {
    var userTag = makeMention(userId);
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
    var ec2 = new EC2();
    var rds = new RDS();
    var help_message = '\nUsage: <command> <id>\n\nwhere <command> is one of:\n';
    help_message += "\tec2, rds, help\n\n";
    help_message += ec2.getHelpDescription();
    help_message += rds.getHelpDescription();
    help_message += "\thal9001 *help*\t\t shows this help\n";

    this.postMessage(channel, help_message, {as_user: true, mrkdwn: true});
};

Hal9001.prototype._displayEC2Metrics = function (message, id) {
};


Hal9001.prototype._reply = function (message) {
    var self = this;

    if(isHelp(message.text)){
        this._displayHelp(message.channel);
    }
    else{
        var m = message.text.match(/.*(ec2|rds)\s+([a-zA-Z0-9\-]+)\s*([a-zA-Z0-9\-]+)?.*/);

        // m[1] : service
        // m[2] : id
        // m[3] : metric

        if(m && m.length >= 3){
            console.log(m[1], m[2], m[3]);

            switch(m[1]){
                case('ec2'):
                    var ec2 = new EC2();
                    ec2.displayMetric(this.cloudwatch,
                                      self,
                                      message.channel,
                                      m[2],
                                      m[3]);
                    break;
                case('rds'):
                    var rds = new RDS();
                    rds.displayAllMetrics(this.cloudwatch,
                                      self,
                                      message.channel,
                                      m[2]);
                    break;
            }
        }
        else{
            self.postMessage(message.channel, "?", {as_user: true});
        }
    }
};

Hal9001.prototype._onMessage = function (message) {
    if(this._isChatMessage(message) && (this._isDirectConversation(message) || this._isChannelConversation(message))
                                        && this._isMentioningBot(message)) {
        this._reply(message);
    }
};


