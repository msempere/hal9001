var metrics = require('../lib/metrics.js');
var Service = require('../lib/service.js');

function EC2(aws, bot, channel){
    var ec2 = {}

    var namespace = 'EC2';
    var period = 60;
    var dimension = 'InstanceId';
    var aws = aws
    var bot = bot
    var channel = channel
    var supported_metrics = ['cpuutilization', 'networkin', 'networkout']

    ec2.__proto__ = Service(aws, bot, channel, namespace, period, dimension, supported_metrics)

    ec2.getHelperDescription = function() {
        return "\thal9001 *ec2* <id> (metric)\t show metric <metric> for AWS EC2 <id> instance. All if not specified\n";
    }

    return ec2
}

module.exports = EC2
