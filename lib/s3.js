var filesize = require("filesize");
var dateFormat = require('dateformat');

var generateS3Params =  function(bucket, key) {
    var _key = '';
    var s3_path = bucket.split('/');

    // remove empties
    s3_path = s3_path.filter(function(n){ return n != '' });

    var _bucket = s3_path[0];

    // remove bucket from path
    if(s3_path.length > 1){
        s3_path.splice(0, 1)
        _key = s3_path.join('/');
    }

    // add '/' if key doesn't contain it at the end of the path
    if(_key && _key.charAt(_key.length - 1) != '/'){
        _key = _key + '/'
    }
    var data = {
                Bucket: _bucket,
                Delimiter: '/',
                MaxKeys: 100,
                };

    // add the key if exists
    if(_key){
        data['Prefix'] = _key;
    }
    return data;
};

function S3(aws, bot, channel){
    var s3 = {}

    var namespace = 'S3';
    var aws = aws
    var bot = bot
    var channel = channel

    s3.getNamespace = function(){
        return namespace.toLowerCase()
    }
    s3.displayMetric = function(bucket, key){
        var params = generateS3Params(bucket, key);
        aws.s3.listObjects(params, function(err, data) {
            var message = '';

            if (err){
                console.log(err.message);
                message = err.message;
            }
            else{
                // node

                if(data.CommonPrefixes.length > 0){
                    data.CommonPrefixes.forEach(function (val, index, array) {
                        var value = val['Prefix'].slice(data['Prefix'].length, val['Prefix'].length);
                        message += '- ' + value + '\n';
                    });
                }
                else{
                    // leaf
                    data.Contents.forEach(function (val, index, array) {
                        console.log(val);
                        var value = val['Key'].slice(data['Prefix'].length, val['Key'].length);
                        if(value.length > 0){
                            var d = new Date(val['LastModified']);
                            d = dateFormat(d, "dd/mm/yy HH:MM")

                            message += '- *' + value + '* -- [*Last Modified*: ' + d + ', *Size*: ' + filesize(val['Size']) + ']\n';
                        }
                    });
                }
            }
            bot.postMessage(channel, message, {as_user: true, mrkdwn: true});
        });
    }

    s3.getHelperDescription = function() {
        return"\thal9001 *s3* <s3>\t shows bucket <bucket> content. Example: s3 hubspot/plugins\n";
    }

    return s3
}

module.exports = S3
