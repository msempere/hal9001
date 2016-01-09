var utils = require('../lib/utils.js');
var metrics = require('../lib/metrics.js');

var EC2 = function(){
    this.namespace = 'EC2';
    this.period = 60;
    this.dimension = 'InstanceId';
    this.supported_metrics = ['cpuutilization', 'networkin', 'networkout'];
}

EC2.prototype = {

    displayMetric: function displayMetric(aws, bot, channel, instance_id, metric){

        // check if metric is a correct metric and is part of the supported metrics
        if(metric && this.supported_metrics.indexOf(metric) != -1){

            // display header
            bot.postMessage(channel, "*'" + instance_id + "'* for the last " + this.period + " minutes:", {as_user: true, mrkdwn: true});

            // display standalone metric
            utils.displayMetric(aws, bot, channel, this.namespace, metrics[metric].name, metrics[metric].unit, instance_id, this.dimension, this.period);
        }
        else{
            // display header
            bot.postMessage(channel, "*'" + instance_id + "'* for the last " + this.period + " minutes:", {as_user: true, mrkdwn: true});

            // display all supported metrics
            var index;
            for (index = 0; index < this.supported_metrics.length; index++) {
                utils.displayMetric(aws,
                                    bot,
                                    channel,
                                    this.namespace,
                                    metrics[this.supported_metrics[index]].name, metrics[this.supported_metrics[index]].unit,
                                    instance_id,
                                    this.dimension,
                                    this.period);
            }
        }
    },

    getHelpDescription: function getHelpDescription(){
        return "\thal9001 *ec2* <id> (metric)\t show metric <metric> for AWS EC2 <id> instance. All if not specified\n";
    }
}

module.exports = EC2;
