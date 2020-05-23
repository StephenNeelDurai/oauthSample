var local = require("./conf/local.js");
var conf =
    local;

var confObj = JSON.parse(JSON.stringify(conf));
module.exports = confObj;