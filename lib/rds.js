var Service = require('../lib/service.js');

function RDS(aws, bot, channel){
    var rds = {}

    var namespace = 'RDS';
    var period = 300;
    var dimension = 'DBInstanceIdentifier';
    var aws = aws
    var bot = bot
    var channel = channel
    var supported_metrics = ['cpuutilization',
                            'databaseconnections',
                            'diskqueuedepth',
                            'freestoragespace',
                            'readiops',
                            'writeiops'];

    rds.__proto__ = Service(aws, bot, channel, namespace, period, dimension, supported_metrics)

    rds.getHelperDescription = function() {
        return "\thal9001 *rds* <id> (metric)\t show metric <metric> for AWS RDS <id> instance. All if not specified\n";
    }

    return rds
}

module.exports = RDS
