var cluster = require('cluster');


var RedisStore = require('socket.io/lib/stores/redis');
redis = require("redis");
pub = redis.createClient();
sub = redis.createClient();
cmd = redis.createClient();

    console.log('timestamp test: ' + new Date().getTime());
    var express = require('express'),
        socketio = require('socket.io'),
        app = express();
    http = require('http');
    var fs = require('fs');
    var https = require('https');
    var server = http.createServer(app);
    var io = socketio.listen(server);
    io.set('store', new RedisStore({
        redisPub: pub,
        redisSub: sub,
        redisClient: cmd
    }));
    var engines = require('consolidate');
    var $ = require('jquery');

    var util = require('util');
    
    var bcrypt = require('bcrypt-nodejs');
    var crypto = require('crypto');
    var apn = require('apn');
    var mongoose = require('mongoose');
    var https = require('https');
    var MongoStore = require('connect-mongo')(express);
    //var $ = require('jquery').create();
    var url = require("url");
    var check = require('validator').check,
        sanitize = require('validator').sanitize;
    var Browser = require("zombie");
    var assert = require("assert");
    var passport = require('passport'),
        FacebookStrategy = require('passport-facebook');
    var querystring = require('querystring');
    var expressValidator = require('express-validator');
	var dogecoin = require('node-dogecoin')();
	dogecoin.auth('doge', 'wow');


    app.configure(function() {
        app.set('views', __dirname + '/views');
        app.set('port', process.env.PORT || 8080);
        app.set('view engine', 'html');

        app.set('view options', {
            layout: false
        });

        app.engine('.html', engines.handlebars);
        app.use(express.json());
		app.use(express.urlencoded());
        app.use(expressValidator());
        app.use(express.methodOverride());
        app.use(express.cookieParser());
        // changed app.use(express.session({ secret: 'asdfsecret'}));
        //var db = mongoose.createConnection("mongodb://localhost/helloExpress");
        var testMongooseDb = mongoose.createConnection('mongodb://localhost/helloExpress');
        //var options_with_mongoose_connection = { mongoose_connection: testMongooseDb.connections[0] };
        app.use(express.session({
            secret: 'secretdawg',
            store: new MongoStore({
                mongoose_connection: testMongooseDb
            })
        }));
        app.use(passport.initialize());
        var csrf = express.csrf();
        //app.use(express.csrf());
/*app.use(function(req, res, next) {

  console.log('what the fuck');
  console.log(req.url);


  res.locals.token = req.session._csrf;
  next();
});*/
        var conditionalCSRF = function(req, res, next) {
                //compute needCSRF here as appropriate based on req.path or whatever
                // console.log(req.url);
                if ((req.url.indexOf('main_post') != -1 && req.url.indexOf('non_csrf') == -1) || req.url.indexOf('dashboard') != -1 || (req.url.indexOf('action') != -1 && req.url.indexOf('non_csrf') == -1) || (req.url.indexOf('reply') != -1 && req.url.indexOf('non_csrf') == -1) || req.url.indexOf('activate') != -1 || req.url.indexOf('posts_mobile') != -1 || req.url.indexOf('post') != -1 && req.url.indexOf('get_posts') == -1 && req.url.indexOf('non_csrf') == -1) {
                    csrf(req, res, next);
                } else {
                    next();
                }
            }
        
        app.use(conditionalCSRF);
        //app.use(express.favicon());
        app.use(app.router);
        //app.use(express.static(__dirname + "/views"));
        app.use(express.static(__dirname + "/public"));
    });





mongoose.connect("mongodb://localhost/helloExpress");

var dogSchema = new mongoose.Schema({
    name: String,
    id: Number,

});
Dog = mongoose.model('Dog', dogSchema);

var userSchema = new mongoose.Schema({
    username: String,
    timestamp: Number,
    ip_address: String

});
User = mongoose.model('User', userSchema);


var addressSchema = new mongoose.Schema({
    address: String,
    id: Number,
    active: { type: Boolean, default: false}
});
Address = mongoose.model('Address', addressSchema);





app.get('/doge', function(req,res){

ip_address = req.connection.remoteAddress;
req.session.ip_address = ip_address;


User.findOne({ip_address: ip_address}, function(err, user){

if (user == null){

	random_number = Math.floor((Math.random()*462)+0);

	Dog.findOneAndUpdate( {$and: [ {id: random_number}, {active: false}] }, { active: true }, function(err, random_dog){
    console.log(random_dog);

	req.session.username = random_dog['name'];
	timestamp = new Date().getTime();

	new User({      
		username: random_dog['name'],
		timestamp: timestamp,
		ip_address: ip_address
	}).save(function(err){
		console.log('user saved');
	});
		

	res.render('index.html', {name: JSON.stringify(req.session.username) });



});



}
else{

	req.session.username = user['username'];
	//console.log('current user is ' + req.session.username);
	res.render('index.html', {name: JSON.stringify(req.session.username) });





}


});




dogecoin.getbalance(function(err, balance) {



})


});


app.get('/fb', function(req,res){


res.render('fb.html');


});


app.post('/enter_username', function(req,res){

console.log('ugh');
username = req.body.username;
ip_address = req.session.ip_address;
console.log(ip_address);
console.log('updated username ' + username);


User.findOneAndUpdate( {ip_address: ip_address}, {username: username}, function(err, random_dog){
console.log('updated');
});


});

app.post('/get_random_address', function(req,res){



Address.findOneAndUpdate( {active: false},{ active: true }, function(err, random_address){

random_address = random_address.address;
console.log(random_address);

res.end(JSON.stringify(random_address));
//res.end();
});


console.log('getting address');


});


app.get('/doge2', function(req,res){



    var file = __dirname + '/breeds.txt';
     
    fs.readFile(file, 'utf8', function (err, data) {
      if (err) {
        console.log('Error: ' + err);
        return;
      }
     
      matches = data.match(/<tr>\s(.*?)<td><a href=\"\/wiki\/(.*?)<\/a><\/td>/gi);
      


      $.each(matches, function(key,val){
      	index = val.indexOf('title');
      	val = val.substr(index + 7);
      	index = val.indexOf('"');
      	val = val.substr(0,index);
      	//console.log(val);

      	dog = new Dog({
      		name: val,
      		id: key

      	});

      	dog.save(function(err){
      		if (err)
      			console.log(err);
      		else console.log('saved');

      	});



      });


    });



});

app.get('/save_addresses', function(req,res){

r1 = 'DSMApoj2Lh7TN6ZfnkM8gyqwPH85vAiqQf';
r2 = 'DJBmnuXWf16yeFHpD4HEe76gJuSKX8kd4i';
r3 = 'DKiFHirTFopDavSuaPcjfraarkLotFp2ky';
r4 = 'D5SKTyAxqu6tWghYuEkeb1iJSQu3TRFQes';
r5 = 'DTFnppeQKvnMLz2w11EBfzddArCgRXMc9q';

array = new Array();
array.push(r1); array.push(r2);array.push(r3);array.push(r4);array.push(r5);

$.each(array, function(key,val){

id = key + 1;
new Address({
  address: val,
  id: id
}).save(function(err){

console.log('address saved');
});


});



});


/*
dogecoin.getDifficulty(function() {
    console.log(arguments);
})


dogecoin.getbalance(function(err, address) {

console.log(address);

})


*/

/*
txid = '6c537e5db8f5608bc8f6207a5da2bcd4e5014687527902a71bd41b6f90cef180';

dogecoin.getrawtransaction(txid, function(err, raw) {

console.log(raw);


dogecoin.decoderawtransaction(raw, function(err, info) {

console.log(info);

})



})*/



//6c537e5db8f5608bc8f6207a5da2bcd4e5014687527902a71bd41b6f90cef180

// [{txid:aaaaaaaa,vout=1}] {m2222=90,m3333=9}

/* real

txid = '6c537e5db8f5608bc8f6207a5da2bcd4e5014687527902a71bd41b6f90cef180';
address = 'DMsmB1rZws83FFk7GjtUL6WTe9Xt76TX4e'; */


/*

<hexstring> [{"txid":txid,"vout":n,"scriptPubKey":hex},...] [<privatekey1>,...]

*/



/* real

dogecoin.createrawtransaction( [{"txid":txid,"vout":1}], {'DMsmB1rZws83FFk7GjtUL6WTe9Xt76TX4e':499}, function(err, hex) {

dogecoin.signrawtransaction(hex, function(err, yolo){

	signed = yolo['hex'];

dogecoin.sendrawtransaction(signed, function(err, sent){

console.log(sent);

});


});



}); */



    server.listen(app.get('port'));


/*
dogecoin.createrawtransaction( [{ 'txid': txid, 'vout':1}], {address: 499}, function(err, address) {

console.log(address);

})*/




/*
dogecoin.createrawtransaction(function(err, address) {

console.log(address);

})*/


//createrawtransaction