var spark = require('textspark');

var generateMetricParams =  function(namespace, metric, unit, instance_id, dimension, period) {
     var endDate = new Date();
     var startDate = new Date(endDate);
     var durationMinutes = 60;

     return {
         EndTime: endDate,
         MetricName: metric,
         Namespace: 'AWS/' + namespace,
         Period: period,
         StartTime: new Date(startDate.setMinutes(endDate.getMinutes() - durationMinutes)),
         Statistics: [ 'Average' ],
         Dimensions: [{Name: dimension, Value: instance_id}],
         Unit: unit
     };
};

module.exports = {
    displayMetric: function(aws, bot, channel, namespace, metric, unit, instance_id, dimension, period){
        var params = generateMetricParams(namespace, metric, unit, instance_id, dimension, period);

        aws.getMetricStatistics(params, function(err, data) {
            if (err){
                console.log(err);
            }
            else{
                var datapoints = data['Datapoints']

                datapoints.sort(function(x, y){
                        return x.Timestamp - y.Timestamp;
                })
                var processed_data = [];
                datapoints.forEach(function (val, index, array) {
                    processed_data.push(Number(val['Average']).toFixed(2));
                });
                bot.postMessage(channel, metric + ": " + spark(processed_data), {as_user: true});
            }
        });
    }
};
