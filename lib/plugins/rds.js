var Service = require('../../lib/service.js');

function RDS(aws, bot){
    var rds = {}

    var namespace = 'RDS';
    var period = 300;
    var dimension = 'DBInstanceIdentifier';
    var aws = aws
    var bot = bot
    var supported_metrics = ['cpuutilization',
                            'databaseconnections',
                            'diskqueuedepth',
                            'freestoragespace',
                            'readiops',
                            'writeiops'];

    rds.__proto__ = Service(aws, bot, namespace, period, dimension, supported_metrics)

    rds.getHelperDescription = function() {
        var message = "\thal9001 *rds* <id> (metric)\t show metric <metric> for AWS RDS <id> instance. All if not specified\n";
        message += "\t\t where <metric> is one of:\n\t\t\t - " + supported_metrics.join('\n\t\t\t - ') + '\n';
        return message
    }

    return rds
}

module.exports = RDS
