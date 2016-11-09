var request = require('request');
var util = require('util');

var _config = require('./config.js');
var azutil = require('./azutil.js');

var azregions = [
    'eastus',
    'eastus2',
    'westus',
    'centralus',
    'northcentralus',
    'southcentralus',
    'northeurope',
    'westeurope',
    'eastasia',
    'southeastasia',
    'japaneast',
    'japanwest',
    'australiaeast',
    'australiasoutheast',
    'brazilsouth',
    'southindia',
    'centralindia',
    'westindia',
    'canadacentral',
    'canadaeast',
    'westus2',
    'westcentralus',
    'uksouth',
    'ukwest'];


azutil.getToken(function (body) {
    var json = JSON.parse(body);
    var access_token = json.access_token;

    console.log('\n#Azure Service Management Demo - Get Azure VM size\n');

    var vmsizeall = { vmsize: [] }
    var count = 0;

    for (var i = 0; i < azregions.length; i++) {
        getVMsize(access_token, azregions[i], function (region, val) {
            console.log("got vmszies from " + region);
            vmsizeall.vmsize.push({ region: region, value: val.value })

            count++;

            if (count == azregions.length) {
                azutil.saveToJson(vmsizeall, 'allregion');
            }
        });
    }
});

function getVMsize(token, loc, cb) {
    if (!token) {
        console.log('NO access_token');
        return;
    }

    var config = {
        uri: 'https://management.azure.com/subscriptions/' + _config.subscription + '/providers/Microsoft.Compute/locations/' + loc + '/vmSizes?api-version=2016-03-30',
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
            cb(loc, body);
        }
    });
}

