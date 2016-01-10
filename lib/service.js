var utils = require('../lib/utils.js');

function Service(aws, bot, channel, namespace, period, dimension, supported_metrics) {

    var namespace = namespace;
    var period = period;
    var dimension = dimension;
    var aws = aws;
    var bot = bot;
    var channel = channel;
    var supported_metrics = supported_metrics;

    function getNamespace(){
        return namespace.toLowerCase()
    }

    function displayMetric(instance_id, metric){
        // check if metric is a correct metric and is part of the supported metrics
        if(metric && supported_metrics.indexOf(metric) != -1){

            // display header
            bot.postMessage(channel, "*'" + instance_id + "'* for the last " + period + " minutes:", {as_user: true, mrkdwn: true});

            // display standalone metric
            utils.displayMetric(aws, bot, channel, namespace, metrics[metric].name, metrics[metric].unit, instance_id, dimension, period);
        }
        else{
            // display header
            bot.postMessage(channel, "*'" + instance_id + "'* for the last " + period + " minutes:", {as_user: true, mrkdwn: true});

            // display all supported metrics
            var index;
            for (index = 0; index < supported_metrics.length; index++) {
                utils.displayMetric(aws,
                                    bot,
                                    channel,
                                    namespace,
                                    metrics[supported_metrics[index]].name, metrics[supported_metrics[index]].unit,
                                    instance_id,
                                    dimension,
                                    period);
            }
        }
    }

    function getHelpDescription(){
        return ''
    }

    return {
        displayMetric: displayMetric,
        getHelpDescription: getHelpDescription,
        getNamespace: getNamespace
    }

}

module.exports = Service
