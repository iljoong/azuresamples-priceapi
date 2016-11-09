
var request = require('request');
var fs = require('fs');
// get AAD config
var _config = require('./config.js');

var azutil = {
    getToken: function (func) {

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
    },

    saveToJson: function (body, fname) {

        filepath = "c:\\azurevm_" + fname + ".json";

        var json = JSON.stringify(body, null, 4);

        fs.writeFile(filepath, json, function (err) {
            if (err) {
                console.log(err);
            } else {
                console.log("The file saved at", filepath);
            }
        });
    }
}

module.exports = azutil;