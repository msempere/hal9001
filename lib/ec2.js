var utils = require('../lib/utils.js');

var EC2 = function(){
    this.namespace = 'EC2';
    this.period = 60;
    this.dimension = 'InstanceId';
}

EC2.prototype = {
    displayMetric: function displayMetric(aws, bot, channel, metric, unit, instance_id){
        utils.displayMetric(aws, bot, channel, this.namespace, metric, unit, instance_id, this.dimension, this.period);
    }
}

module.exports = EC2;
