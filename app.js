var request = require('request');
var util = require('util');
const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

// get AAD config
var _config = require('./config.js');

rl.question('Save to 1. CSV (Default), 2. JSON, 3. DB? Enter number bewteen 1 ~ 3: ', (answer) => {

    var option = (answer) ? parseInt(answer) : 1;
    console.log('You selected:', option);

    // Get Azure Price
    getToken(function (body) {
        var json = JSON.parse(body);
        var access_token = json.access_token;

        console.log('\n#Azure Service Management Demo - Get Azure Price\n');
        //console.log('\n##Token\n');
        //console.log(access_token);

        getPrice(access_token, option);

        rl.close();
    });

});


function getToken(func) {

    var config = {
        uri: 'https://login.microsoftonline.com/' + _config.tenant_id + '/oauth2/token',
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        form: {
            grant_type: 'client_credentials',
            resource: 'https://management.core.windows.net/',
            client_id: _config.client_id,
            client_secret: _config.client_secret

        }
    };

    request(config, function (err, resp, body) {
        if (err) {
            console.log(err);
        } else {
            func(body);
        }
    });
}

function getPrice(token, opt) {
    if (!token) {
        console.log('NO access_token');
        return;
    }

    // REST API: https://msdn.microsoft.com/en-us/library/azure/mt219004.aspx
    // Offer ID: https://azure.microsoft.com/en-us/support/legal/offer-details/
    var filter = "&$filter=OfferDurableId eq 'MS-AZR-0003p' and Currency eq 'KRW' and Locale eq 'en-us' and RegionInfo eq 'KR'";

    var config = {
        uri: 'https://management.azure.com/subscriptions/' + _config.subscription + '/providers/Microsoft.Commerce/RateCard?api-version=2015-06-01-preview' + filter,
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

            switch (opt) {
                case 1:
                    saveToCSV(body.Meters);
                    break;
                case 2:
                    saveToJson(body);
                    break;
                case 3:
                    saveToDB(body.Meters);
                    break;
            }
        }
    });
}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
var fs = require('fs');
var filepath = 'c:\\';

function saveToCSV(meters) {

    var date = new Date();
    filepath += "azureprice_" + date.toDateString() + ".txt";

    var price_csv = 'MeterId, MeterName, MeterCategory, MeterSubCategory, MeterRegion, Unit, MeterRates[0]\r\n';
    for (var i = 0; i < meters.length; i++) {
        var meter = meters[i];

        price_csv += util.format("%s, %s, %s, %s, %s, %s, %d\r\n",
            meter.MeterId, meter.MeterName, meter.MeterCategory, meter.MeterSubCategory, meter.MeterRegion, meter.Unit, meter.MeterRates[0]);
    }

    fs.writeFile(filepath, price_csv, function (err) {
        if (err) {
            console.log(err);
        } else {
            console.log("The file saved at", filepath);
        }
    });

}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function saveToJson(body) {

    var date = new Date();
    filepath += "azureprice_" + date.toDateString() + ".json";

    var json = JSON.stringify(body, null, 4);

    fs.writeFile(filepath, json, function (err) {
        if (err) {
            console.log(err);
        } else {
            console.log("The file saved at", filepath);
        }
    });

}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
var connString = {
    user: _config.user,
    password: _config.password,
    server: _config.server,
    // When you connect to Azure SQL Database, you need these next options.  
    options: { encrypt: true, database: _config.database }
};

var sql = require('mssql');

function saveToDB(meters) {
    var sqlquery = '';

    sql.connect(connString).then(function () {

        // This is not good way to save bulk data to SQL db
        for (var i = 0; i < meters.length; i++) {
            var meter = meters[i];

            sqlquery = util.format("insert into AzurePrice (Id, Name, Category, SubCategory, Region, Unit, Rates) values ('%s', '%s', '%s', '%s', '%s', '%s', %d)",
                meter.MeterId, meter.MeterName, meter.MeterCategory, meter.MeterSubCategory, meter.MeterRegion, meter.Unit, meter.MeterRates[0]);

            //console.log(sqlquery);

            new sql.Request().query(sqlquery).then(function (recordset) {
                //console.log('inserted');
            }).catch(function (err) {
                console.log(err);
                process.exit(1);
            });
        }
        console.log('Done');

    }).catch(function (err) {
        console.log(err);
    });
}