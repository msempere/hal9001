var spark = require('textspark');

var generateMetricParams =  function(namespace, metric, unit, instance_id, dimension, period) {
     var endDate = new Date();
     var startDate = new Date(endDate);
     var durationMinutes = 120;

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
    bold: function(message){
        return '*' + message + '*';
    },
    makeMention: function(userId) {
            return '<@' + userId + '>';
    },
    displayMetric: function(aws, bot, channel, namespace, metric, unit, instance_id, dimension, period, index){
        var params = generateMetricParams(namespace, metric, unit, instance_id, dimension, period);
        var message = '';

        aws.getMetricStatistics(params, function(err, data) {
            if (err){
                console.log(err.message);
                message = err.message + " while loading " + metric;
            }
            else{
                var datapoints = data['Datapoints']

                if(datapoints && datapoints.length > 0){

                    datapoints.sort(function(x, y){
                            return x.Timestamp - y.Timestamp;
                    })
                    var processed_data = [];
                    var total = 0;
                    var max = 0;

                    datapoints.forEach(function (val, index, array) {
                        processed_data.push(Number(val['Average']).toFixed(2));
                        total = total + val['Average'];
                        if(val['Average'] > max){
                            max = val['Average'];
                        }
                    });
                    message = "*" + metric + "*: " + spark(processed_data) + "  [*AVG*: " +
                        (total/processed_data.length).toFixed(2) + " " + unit + ", *MAX*: " +
                            max.toFixed(2) + " " + unit + "]";
                    bot.postMessage(channel, message, {as_user: true});
                }
                else{
                    // in case of loop, first iteration would show the error only, avoiding a verbose output
                    if(index == 0)
                        bot.postMessage(channel, "Id '" + instance_id + "' not found", {as_user: true, mrkdwn: true});
                }
            }
        });
    }
};
