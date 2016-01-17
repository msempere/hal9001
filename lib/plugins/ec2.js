var metrics = require('../../lib/metrics.js');
var Service = require('../../lib/service.js');

function EC2(aws, bot){
    var ec2 = {}

    var namespace = 'EC2';
    var period = 60;
    var dimension = 'InstanceId';
    var aws = aws
    var bot = bot
    var supported_metrics = ['cpuutilization', 'networkin', 'networkout']

    ec2.__proto__ = Service(aws, bot, namespace, period, dimension, supported_metrics)

    ec2.getHelperDescription = function() {
        var message = "\thal9001 *ec2* <id> (metric)\t show metric <metric> for AWS EC2 <id> instance. All if not specified\n";
        message += "\t\t where <metric> is one of:\n\t\t\t - " + supported_metrics.join('\n\t\t\t - ') + '\n';
        return message
    }

    return ec2
}

module.exports = EC2
