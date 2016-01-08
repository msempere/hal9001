var utils = require('../lib/utils.js');

var RDS = function(){
    this.namespace = 'RDS';
    this.period = 300;
    this.dimension = 'DBInstanceIdentifier';
}

RDS.prototype = {
    displayMetric: function displayMetric(aws, bot, channel, metric, unit, instance_id){
        bot.postMessage(channel, "*'" + instance_id + "'* for the last " + this.period + " minutes:", {as_user: true, mrkdwn: true});
        utils.displayMetric(aws, bot, channel, this.namespace, metric, unit, instance_id, this.dimension, this.period);
    },
    displayAllMetrics: function displayAllMetrics(aws, bot, channel, instance_id){
        bot.postMessage(channel, "*'" + instance_id + "'* for the last " + this.period + " minutes:", {as_user: true, mrkdwn: true});
        utils.displayMetric(aws, bot, channel, this.namespace, 'CPUUtilization', 'Percent', instance_id, this.dimension, this.period);
        utils.displayMetric(aws, bot, channel, this.namespace, 'DatabaseConnections', 'Count', instance_id, this.dimension, this.period);
        utils.displayMetric(aws, bot, channel, this.namespace, 'DiskQueueDepth', 'Count', instance_id, this.dimension, this.period);
        utils.displayMetric(aws, bot, channel, this.namespace, 'FreeStorageSpace', 'Bytes', instance_id, this.dimension, this.period);
        utils.displayMetric(aws, bot, channel, this.namespace, 'ReadIOPS', 'Count/Second', instance_id, this.dimension, this.period);
        utils.displayMetric(aws, bot, channel, this.namespace, 'WriteIOPS', 'Count/Second', instance_id, this.dimension, this.period);
    }
}

module.exports = RDS;
