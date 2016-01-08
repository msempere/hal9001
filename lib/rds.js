var utils = require('../lib/utils.js');

var RDS = function(){
    this.namespace = 'RDS';
    this.period = 300;
    this.dimension = 'DBInstanceIdentifier';
}

RDS.prototype = {
    displayMetric: function displayMetric(aws, bot, channel, metric, unit, instance_id){
        utils.displayMetric(aws, bot, channel, this.namespace, metric, unit, instance_id, this.dimension, this.period);
    }
}

module.exports = RDS;
