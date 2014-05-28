 var jsdom = require("jsdom");
 var window = jsdom.jsdom().createWindow();
 var $ = require('./node_modules/jquery/dist/jquery')(window);
 var crypto = require('crypto');
 var fs = require('fs');
 var binary = require('binary');

 var mongoose = require('mongoose');

bitcoin = require('bitcoin');
var moment = require('moment');



//packages for website
var express = require('express'),
    socketio = require('socket.io'),
    app = express();
http = require('http');
var fs = require('fs');
var https = require('https');
var server = http.createServer(app);
var engines = require('consolidate');
var https = require('https');
var MongoStore = require('connect-mongo')(express);



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

        //app.use(express.favicon());
        app.use(express.static(__dirname + "/public"));
        app.use(app.router);
        //app.use(express.static(__dirname + "/views"));

    });



TRANSACTION_FEE = 1;
LOOSER_BACK = 1;


mongoose.connect("mongodb://localhost/helloExpress");

var processedSchema = new mongoose.Schema({
    txin: String,
    lucky_numbers: [Number],
    player_address: String,
    timestamp: Number,
    amount: Number
});

LottoTicket = mongoose.model('LottoTicket', processedSchema);

var lottery_ticket_array = new mongoose.Schema({
  numbers: [Number],
});

LotteryNumberArray = mongoose.model('LotteryNumberArray', lottery_ticket_array);

var altSchema = new mongoose.Schema({
    txin: String,
    lucky_numbers: [lottery_ticket_array],
    player_address: String,
    timestamp: Number,
    amount: Number,
    bet_address: String,
    email: String
});

LottoTicket2 = mongoose.model('LottoTicket2', altSchema);



var client = new bitcoin.Client({
  host: '127.0.0.1',
  port: 12341,
  user: 'dogecoinrpc',
  pass: '8FZDgUAy81XtZbERtPW37G9AUG89ShgLJQTcpuHFhCrN'
});

ADDRESS = 'DSMApoj2Lh7TN6ZfnkM8gyqwPH85vAiqQf';


var io = require('socket.io').listen(server);

io.sockets.on('connection', function (socket) {

  socket.emit('news', { hello: 'world' });
  socket.on('my other event', function (data) {
    console.log('ugh ' + data);
  });
});



/*
client.getBlockHash(50000, function(err, blockhash) {

client.listSinceBlock(blockhash, function(err, transactions) {

console.log('hell is going ' + JSON.stringify(transactions));

});


});*/



setInterval(function(){
//io.sockets.emit('new_ticket_purchase', { hello: 'hello' });

client.getBlockCount(function(err, blockcount) {




client.getBlockHash(158825, function(err, blockhash) {

client.listSinceBlock(blockhash, function(err, transactions) {


//console.log(transactions);

//console.log('the fuck is going on ' + JSON.stringify(transactions['transactions']));
//console.log('the fuck is going on ' + transactions['transactions'].length);

if (transactions != undefined){


LottoTicket2.find({}, function(err, lottotickets){

address_array = new Array();

$.each(lottotickets, function(key,val){

address_array.push(val['bet_address']);

});


$.each(transactions['transactions'], function(key,val){
transaction = val;
txid = transaction['txid'];
address = transaction['address'];
amount = transaction['amount'];

if ($.inArray(address, address_array) != -1 && transaction['category'] == 'receive'){

//console.log('fucked address ' + address);

(function(txid, address, amount){
LottoTicket.findOne({txin: txid}, function(error, tran){
//console.log('the tran ' + tran);
//console.log(tran + + '\r\n\r\n\r\n');
if (tran == null || tran == undefined){

console.log('shit is so fucked');
sent_address = address;
process_transaction(txid, address_array, sent_address, amount);



}

});

})(txid, address, amount);


}



});




});

}



});	


});	


}); 

 
},2000);


//end

txin = 'af5c9d127b39827d7cac77c875240b576fa8197f9a7ef169d6b699a9fdba9db4';

client.getRawTransaction(txin, 1, function(err, transactiondetails) {
amount = transactiondetails['vout'];
console.log('here it is ' + JSON.stringify(amount));

});


function process_transaction(txid, address, sent_address, amount){

(function(txid, address, sent_address, amount){
client.getRawTransaction(txid, 1, function(err, transactiondetails) {

console.log('trans details ' + JSON.stringify(transactiondetails));

vintxid = transactiondetails['vin'][0]['txid'];
vinvout = transactiondetails['vin'][0]['vout'];

amount_array =  transactiondetails['vout'];
/*
amount = '';
$.each(amount_array, function(key,val){

if (val[key]['value'] == )


});*/

//amount = transactiondetails['vout'][0]['value'];


console.log(' amount again ' + amount);
k = 0;
kvin = 0;

stop = false;
$.each(transactiondetails['vout'], function(key,val){

td = val;

	if ( $.inArray(td["scriptPubKey"]["addresses"][0], address) != -1 && stop == false){
		

		vinscriptpubkey = td["scriptPubKey"]["hex"];
		kvin = k;
		stop = true;
		//break;
	}	
	k++;


});

	

(function(amount){
get_player_address(vintxid, vinvout, function(playeraddress){
console.log('the fucking amount ' + amount);
console.log(' player address ' + playeraddress);
console.log(txid);

//play game

console.log('amount ' + amount);
lucky_numbers = get_lucky_numbers(txid, amount);
console.log(lucky_numbers);



timestamp =  new Date().getTime();
console.log('right before');

ticket = new LottoTicket({
    txin: txid,
    lucky_numbers: lucky_numbers,
    player_address: playeraddress,
    timestamp: timestamp,
    amount: amount
});

//console.log("new fucking ticket" + ticket);


ticket.save(function(err){

console.log('ticket saved');

});

timestamp = timestamp.toString();
ten_digit_timestamp = timestamp.substr(0, timestamp.length -3);

console.log('ten ' + ten_digit_timestamp);

var formatted_time = moment.unix(ten_digit_timestamp).format('MMMM Do YYYY, h:mm:ss a');

ticket_info = new Object();
ticket_info.txin = txid;
ticket_info.lucky_numbers = lucky_numbers;
ticket_info.player_address = playeraddress;
ticket_info.ticket_purchase_time = formatted_time;
ticket_info.number_tickets = Math.floor(amount);
ticket_info.amount = amount;
ticket_info.bet_address = sent_address

console.log('here is the fucking address ' + sent_address);

io.sockets.emit('new_ticket_purchase', { ticket_info: ticket_info });


io.sockets.emit('update_t', { ticket_info: ticket_info });


/*
fs.appendFile('./views/lottery_tickets.html', JSON.stringify(ticket_info) + "\r\n", function (err) {
if (err) throw err;
console.log('The "data to append" was appended to file!');
});		*/




io.sockets.emit('update_table', { ticket_info: ticket_info });
console.log('shit emit');





}); 
}(amount));


//get_player_address(vintxid, vinvout);


});

}(txid, address, sent_address, amount));


}



/*
function doSomething() {
LottoTicket.find({}).sort({timestamp: 1}).limit(20).exec(function(err, tickets){

random_number = Math.floor(Math.random() * tickets.length);

random_ticket = tickets[random_number];
//console.log('fucking random ' + random_number + ' ' + random_ticket);

timestamp =  new Date().getTime();
ten_digit_timestamp = timestamp.toString().substr(0,timestamp.toString().length -3);

var formatted_time = moment.unix(ten_digit_timestamp).format('MMMM Do YYYY, h:mm:ss a');

ticket_info = new Object();
ticket_info.txin = random_ticket.txin;
ticket_info.ticket_purchase_time = formatted_time;
ticket_info.number_tickets = Math.floor(random_ticket.amount);
ticket_info.amount = random_ticket.amount;
//console.log('ticket info ' + random_ticket);

io.sockets.emit('update_table', { ticket_info: ticket_info });

});


}

(function loop() {
    var rand = Math.round(Math.random() * (3000)) + 1000;
    setTimeout(function() {
            doSomething();
            loop();  
    }, rand);
}());
*/






/*
setInterval(function(){

LottoTicket.find({}).sort({timestamp: 1}).limit(20).exec(function(err, tickets){

random_number = Math.floor(Math.random() * tickets.length);

random_ticket = tickets[random_number];
console.log('fucking random ' + random_number + ' ' + random_ticket);

timestamp =  new Date().getTime();
ten_digit_timestamp = timestamp.toString().substr(0,timestamp.toString().length -3);

var formatted_time = moment.unix(ten_digit_timestamp).format('MMMM Do YYYY, h:mm:ss a');

ticket_info = new Object();
ticket_info.txin = random_ticket.txin;
ticket_info.ticket_purchase_time = formatted_time;
ticket_info.number_tickets = Math.floor(random_ticket.amount);
ticket_info.amount = random_ticket.amount;
console.log('ticket info ' + random_ticket);

io.sockets.emit('update_table', { ticket_info: ticket_info });

});

//io.sockets.emit('get_table_info');


}, 3000); */




function get_player_address(vintxid, vinvout, fn){


	client.getRawTransaction(vintxid, 1, function(err, transactionin){
		//console.log('raw ' + JSON.stringify(transactionin));

		//console.log('transaction vout' + JSON.stringify(transactionin['vout']));
		fodd = false;

		$.each(transactionin["vout"], function(key,vitem){
            //console.log(JSON.stringify('stupid ' + vitem["scriptPubKey"]["addresses"]));

            if (vitem["scriptPubKey"]["addresses"] != undefined){

			if ( $.inArray(vitem["scriptPubKey"]["addresses"][0], address_array) !=-1 ){
				fodd = true;
				console.log('f odd true');;
			}

                }

		});
		if ( fodd ){
			//console.log('fodd');
			vintxid = transactionin['vin'][0]['txid'];
			vinvout = transactionin['vin'][0]['vout'];
			get_player_address(vintxid, vinvout, fn);
		}else{
			console.log('stop');
			playeraddress = transactionin['vout'][vinvout]['scriptPubKey']['addresses'][0];
    		console.log(playeraddress + "$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$");
    		//check = true;
    		fn(playeraddress);
			//check = true;
			//don't continue				
		}



	});


}






function get_lucky_numbers(txid, amount){

var ticket_count = Math.floor(amount);

lucky_numbers = new Array();


var shasum = crypto.createHash('sha256');
shasum.update(txid);
var d = shasum.digest('hex');


var shasum2 = crypto.createHash('sha256');
shasum2.update(d.toString());
var d = shasum2.digest('hex');
last_nine_chars = d.substr(d.length -9);
random_number = parseInt(last_nine_chars, 16);
lucky_number = 10000000 - (random_number % 10000000);
console.log('the lucky number ' + lucky_number);

for (var i=0; i< ticket_count; i++){
	number = 10000000 / ticket_count;
	array_number = (lucky_number + (Math.floor(i * number)))%10000000;
	//console.log('in array lucky number ' + lucky_number);
	//console.log('in array array number ' + array_number);

	lucky_numbers.push(array_number);
}

//console.log('lucky array ' + lucky_numbers);


return lucky_numbers;


}

//console.log('the mod ' + 3%100);


app.get('/logs', function(req,res){

res.render('lottery_tickets.html');

});

app.post('/submit_lucky_numbers', function(req,res){
body = req.body;
txin =  body.txin; 
lucky_numbers = body.lucky_numbers;
player_address = body.player_address; 
ticket_purchase_time = body.ticket_purchase_time;
number_tickets = body.number_tickets;
amount = body.amount;
bet_address = body.bet_address;



console.log('here is the bet address' + bet_address);


console.log('stupidshit' + JSON.stringify(req.body));
number_array = new Array();


LottoTicket2.findOne({bet_address: bet_address}, function(err, doc){
console.log('ah' + doc.lucky_numbers);
console.log('check closure ' + number_array);

$.each(lucky_numbers, function(key,val){

numbers = new LotteryNumberArray({
numbers: val
});

doc.lucky_numbers.push(numbers);

});
//console.log(numbers);


doc.save(function(err){
console.log('success now');

LottoTicket2.findOneAndUpdate({bet_address: bet_address}, {'$set': {
    'txin': txin,
    //'lucky_numbers': number_array,
    'player_address': player_address,
    'ticket_purchase_time:=' : ticket_purchase_time,
    'number_tickets' : number_tickets,
    'amount' : amount,
    'bet_address' : bet_address
}}, function(err, doc) { 

console.log('aha ' + JSON.stringify(doc));

object = new Object();
object.txin = txin;
object.player_address = player_address;
object.ticket_purchase_time = ticket_purchase_time;
object.number_tickets = number_tickets;
object.amount = amount;
object.bet_address = bet_address;
object.lucky_numbers = lucky_numbers;

fs.appendFile('./views/lottery_tickets.html', JSON.stringify(object) + "\r\n", function (err) {
if (err) throw err;
console.log('The "data to append" was appended to file!');
});     


console.log('shitwow');

});



});


});




res.end('done');

});


app.post('/get_new_address', function(req,res){

client.getNewAddress(function(err,address){

console.log('new fucking address ' + address);
console.log('email is ' + req.body.email_address);

lotto_ticket = new LottoTicket2({
    bet_address: address,
    email: req.body.email_address
});

lotto_ticket.save(function(err){

console.log('lotto ticket saved');

});



res.end(address);

});


});

bet_address = 'DQJYE69xaUAP6aaDTNR7vBm5R3nzq659xV';





/*
LottoTicket2.findOne({bet_address: bet_address}, function(err, doc){
console.log('ah' + doc.lucky_numbers);

numbers = new LotteryNumberArray({
numbers: [3,4,5]
});

console.log(numbers);
doc.lucky_numbers.push(numbers);

doc.lucky_numbers.push(numbers);
console.log(numbers);

doc.save(function(err){
console.log('success now');
});


});
*/


app.get('/modal_window.html', function(req,res){

res.render('modal_window.html');

});


app.get('/', function(req,res){
console.log('info path logged');


//res.render('index_bitcoin.html');
LottoTicket.find({}).sort({timestamp: 1}).limit(20).exec(function(err, tickets){


total = 0;
bets = new Array();
$.each(tickets, function(key,ticket){

total += ticket.amount;

bet = new Object();
bet.txin = ticket.txin;
bet.amount= ticket.amount;
bet.number_tickets = Math.floor(ticket.amount);

timestamp = ticket.timestamp.toString();
ten_digit_timestamp = timestamp.substr(0, timestamp.length -3);
var formatted_time = moment.unix(ten_digit_timestamp).format('MMMM Do YYYY, h:mm:ss a');

bet.ticket_purchase_time = formatted_time;
bets.push(bet);





});

jackpot_amount = new Object();
jackpot_amount.bitcoin = total;

var https = require('https');

dollar = '';
https.get('https://www.bitstamp.net/api/ticker/', function(resb) {
  resb.on('data', function(d) {
    //process.stdout.write(d);
    var obj = $.parseJSON(d);
    console.log(obj['last']);
    dollar = obj['last'];
    jackpot_amount.dollar = dollar;



console.log(JSON.stringify(jackpot_amount));
res.render('index_bitcoin.html', {bets: JSON.stringify(bets), jackpot_amount: JSON.stringify(jackpot_amount)});
});



});
});
});


app.get('/tester', function(req,res){

res.render('tester.html');

});


app.get('/process_ticket', function(req,res){

res.render('process_ticket.html');

});






server.listen(app.get('port'));




/*
//select winner
hash  = '000000000000000029a93c458eb30b33730cb516ad33b9b6af26fae41efec645';

var shasum = crypto.createHash('sha256');

shasum.update(hash);

var d = shasum.digest('hex');

var shasum2 = crypto.createHash('sha256');

shasum2.update(d.toString());

var d = shasum2.digest('hex');

//console.log('winner ' + d);

last_nine_chars = d.substr(d.length -9);

random_number = parseInt(last_nine_chars, 16);
winning_number = 10000000 - (random_number % 10000000);

console.log('winning ' + winning_number);

*/