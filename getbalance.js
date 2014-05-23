 var jsdom = require("jsdom");
 var window = jsdom.jsdom().createWindow();
 var $ = require('./node_modules/jquery/dist/jquery')(window);
 var crypto = require('crypto');
 var fs = require('fs');
 var binary = require('binary');

 var mongoose = require('mongoose');

bitcoin = require('bitcoin');
var moment = require('moment');

TRANSACTION_FEE = 1;
LOOSER_BACK = 1;


mongoose.connect("mongodb://localhost/helloExpress");

var processedSchema = new mongoose.Schema({
    txin: String,
    betaddress: String,
    odds: Number,
    bet: Number,
    player_address: String,
    outcome: Number,
    sumout: Number,
    timestamp: Number
});
Processed = mongoose.model('Processed', processedSchema);



var client = new bitcoin.Client({
  host: '127.0.0.1',
  port: 12341,
  user: 'dogecoinrpc',
  pass: 'CSjQiFf9UeC8bNVKYryDrk6fqtY2t2mLK3bjXKCoQP7U'
});



client.getBalance(function(err, balance) {

console.log('balance ' + balance);

});

client.getBlockCount(function(err, balance) {

console.log('block count ' + balance);

});

