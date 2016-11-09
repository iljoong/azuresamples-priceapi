var request = require('request');
var util = require('util');

var _config = require('./config.js');
var azutil = require('./azutil.js');


azutil.getToken(function (body) {
    var json = JSON.parse(body);
    var access_token = json.access_token;

    console.log('\n#Azure Service Management Demo - Get Azure Usage\n');

    var date = new Date();
    var startdate = util.format("%d-%d-%d", date.getFullYear(), date.getMonth() + 1, 1);
    var enddate = util.format("%d-%d-%d", date.getFullYear(), date.getMonth() + 1, date.getDate());

    var usageperiod = { startdate: startdate, enddate: enddate };
    getAzureUsage(access_token, usageperiod, function (val) {
        azutil.saveToJson(val, "usage");
    });

});

function getAzureUsage(token, range, cb) {
    if (!token) {
        console.log('NO access_token');
        return;
    }

    var params = "&reportedStartTime=" + range.startdate + "&reportedEndTime=" + range.enddate + "&aggregationGranularity=Daily&showDetails=false";
    var url = "https://management.azure.com/subscriptions/" + _config.subscription + "/providers/Microsoft.Commerce/UsageAggregates?api-version=2015-06-01-preview" + params;

    var config = {
        uri: url,
        method: 'GET',
        json: true,
        headers: {
            'Authorization': 'Bearer ' + token,
            'Content-Type': 'application/json;charset=utf-8'
        }
    };

    request(config, function (err, resp, body) {
        if (err) {
            console.log(err);
        }
        else {
            cb(body);
        }
    });
}
