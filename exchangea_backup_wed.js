 var conditionalCSRF; // be careful with hoisting
 var lusca = require( 'lusca' );
 var csrf = lusca.csrf();
 var csrfFreeRoutes = {
  '/buy_order': true,
  '/sell_order': true
};
 
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
var sendgrid  = require('sendgrid')('anonymousventures', 'mogulskier');


    app.configure(function() {
        app.set('views', __dirname + '/views');
        app.set('port', process.env.PORT || 8000);
        app.set('view engine', 'html');

        app.set('view options', {
            layout: false
        });

        app.engine('.html', engines.handlebars);
        app.use(express.json());
		    app.use(express.urlencoded());
        app.use(express.methodOverride());
        app.use(express.cookieParser('asdfsecret'));
        app.use(express.cookieSession());
        var csrf = express.csrf();

        var conditionalCSRF = function (req, res, next) {
          //compute needCSRF here as appropriate based on req.path or whatever
          if (req.url.indexOf('buy_order') != -1 || req.url.indexOf('sell_order') != -1  || req.url.indexOf('market') != -1 ) {
            console.log('shits ' + req.url);
            csrf(req, res, next);
          } else {
            next();
          }
        }

        app.use(conditionalCSRF);



        //app.use(express.csrf());
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
        //app.use(express.static(__dirname + "/public/withdraw"));
        app.use(app.router);
        //app.use(express.static(__dirname + "/views"));

    });




TRANSACTION_FEE = 1;
LOOSER_BACK = 1;


mongoose.connect("mongodb://localhost/helloExpress");


var User = new mongoose.Schema({
    email: String,
    password: String,
    full_name: String,
    hash: String,
    activated: { type: Boolean, default: false},
    dogecoin: { type: mongoose.Schema.ObjectId, ref: 'Coin' },
    bitcoin: { type: mongoose.Schema.ObjectId, ref: 'Coin' },
    deposits: [{ type: mongoose.Schema.ObjectId, ref: 'Deposit' }],
    withdrawals: [{ type: mongoose.Schema.ObjectId, ref: 'Withdrawal' }],
    orders: [{ type: mongoose.Schema.ObjectId, ref: 'Order' }],
});



var Deposit = new mongoose.Schema({
    time: Number,
    coin:  { type: mongoose.Schema.ObjectId, ref: 'Coin' },
    amount: Number,
    deposit_address: String,
    status: String,
    pending: { type: Boolean, default: true},
    txid: String,
    coin_name: String,
    coin_ticker: String
});



var Withdrawal = new mongoose.Schema({
    time: Number,
    coin_name: String,
    coin_ticker: String,
    txid: String,
    amount: Number,
    fee: Number,
    receiving_address: String,
    status: String,
    pending: { type: Boolean, default: true},
    hash: String,
    coin:  { type: mongoose.Schema.ObjectId, ref: 'Coin' }
});

var Order = new mongoose.Schema({
    time: Number,
    coin_one_name: String,
    coin_two_name: String,
    coin_one_ticker: String,
    coin_two_ticker: String,
    order_number: Number,
    side: String,
    price: Number,
    quantity: Number,
    quantity_left: Number,
    coin_one:  { type: mongoose.Schema.ObjectId, ref: 'Coin' },
    coin_two:  { type: mongoose.Schema.ObjectId, ref: 'Coin' },
    pending: { type: String, default: 'pending'},
    user:  { type: mongoose.Schema.ObjectId, ref: 'User' },
});


var Coin = new mongoose.Schema({
    coin_name: String,
    code: String,
    balance: { type: Number, default: 0 },
    pending_deposits:{ type: Number, default: 0 },
    pending_withdrawals:{ type: Number, default: 0 },
    held_for_orders: { type: Number, default: 0 },
    deposits: [{ type: mongoose.Schema.ObjectId, ref: 'Deposit' }],
    withdrawal: [{ type: mongoose.Schema.ObjectId, ref: 'Withdrawal' }],
    deposit_address: String,
    user: { type: mongoose.Schema.ObjectId, ref: 'User'},
    confirmation: { type: Number, default: 0 },
    coin_number: Number,
    withdraw_fee: Number,
    min_order: Number,
    orders: [{ type: mongoose.Schema.ObjectId, ref: 'Order' }],
});


User = mongoose.model('User', User);
Coin = mongoose.model('Coin', Coin);
Deposit = mongoose.model('Deposit', Deposit);
Withdrawal = mongoose.model('Withdrawal', Withdrawal);
Order = mongoose.model('Order', Order);

var altSchema = new mongoose.Schema({
    txin: String,
    player_address: String,
    timestamp: Number,
    amount: Number,
    bet_address: String,
    email: String,
    paid: { type: Boolean, default: false },
    txout: String
});

Transaction = mongoose.model('Transactionb', altSchema);



var bitcoin_client = new bitcoin.Client({
  host: '127.0.0.1',
  port: 12343,
  user: 'bitcoinrpc',
  pass: '8FZDgUAy81XtZbERtPW37G9AUG89ShgLJQTcpuHFhCrN'
});

ADDRESS = '172f8Eg7KH7yznEPfbnaZ1UYBnryoQdiuA';



var dogecoin_client = new bitcoin.Client({
  host: '127.0.0.1',
  port: 12341,
  user: 'dogecoinrpc',
  pass: '8FZDgUAy81XtZbERtPW37G9AUG89ShgLJQTcpuHFhCrN'
});

all_clients = new Array();
all_clients.push(bitcoin_client);
all_clients.push(dogecoin_client);



var io = require('socket.io').listen(server);

io.sockets.on('connection', function (socket) {

  socket.emit('news', { hello: 'world' });
  socket.on('my other event', function (data) {
    console.log('ugh ' + data);
  });
});




//console.log('the mod ' + 3%100);




app.get('/ponzi', function(req,res){

res.render('ponzi.html');

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




app.get('/add_coin', function(req,res){

console.log("fucked");
coin = new Coin({
    coin_name: 'bitcoin',
    code: 'btc'
});

coin.save(function(err){

console.log('coin saved');

});




});




app.get('/register', function(req,res){

res.render('register.html');

});

app.get('/login', function(req,res){

res.render('login.html');

});


app.get('/market/:coin1/:coin2', function(req,res){
coin1 = req.params.coin1;
coin2 = req.params.coin2;

csrf = req.session._csrf;
console.log('csrf ' + csrf)

res.render('trade.html', {csrf: JSON.stringify(csrf)});



});



/*
coin_one_ticker = 'doge';
coin_two_ticker = 'btc';
price = 100;
Order.find({$and: [{coin_one_name: coin_one_name}, {coin_two_name: coin_two_name}, {side: 'sell'}, {pending: 'pending'}, {price: {$lte: price}}]}, function(err, yolo){

console.log(yolo);

});
*/

app.post('/buy_order',  function(req,res){

if (req.session.processing == undefined)
    req.session.processing = false;

if (req.session.processing == false){
req.session.processing = true;

quantity = req.body.buy_amount;
price = req.body.buy_price;
buy_price = price;
buy_quantity = quantity;

coin_one_name = req.body.coin_name_one;
coin_two_name = req.body.coin_name_two;
coin_one_ticker = req.body.coin_ticker_one
coin_two_ticker = req.body.coin_ticker_two;

console.log('coinone' + coin_one_name);

console.log('coin one ticker ' + coin_one_ticker);
console.log(coin_two_ticker);
//coin_one_ticker = 'doge';
//coin_two_ticker = 'btc';
//price = 100;

Order.find({$and: [{coin_one_ticker: coin_one_ticker}, {coin_two_ticker: coin_two_ticker}, {side: 'sell'}, {pending: 'pending'}, {price: {$lte: price}}]}).populate('user').sort({time: 1}).exec(function(err, sell_order){

//console.log('sell ordera ' + sell_order);
//console.log('sell orderb ' + sell_order['user']);
//coin_name_one = coin_one_ticker + 'coin';
User.findOne({email: req.session.user.email}).populate(coin_one_name + ' ' + coin_two_name).exec(function (err, coin) {

console.log('dacoin ' + coin);

//Coin.findOne({code: coin_one_ticker}, function(err, coin){

min_order = .00001;

balance = coin[coin_two_name].balance;
buy_value = buy_price * buy_quantity;
console.log('dabalance ' + balance);
console.log('buyvalue ' + buy_value);


if (balance >= buy_value){

if (sell_order.length == 0 && quantity > min_order){

console.log("it is in here lol");

User.findOne({email: req.session.user.email}, function(err, user){

order = new Order({
                time: new Date().getTime(),
                coin_one_ticker: coin_one_ticker,
                coin_two_ticker: coin_two_ticker,
                side: 'buy',
                price: price,
                quantity: quantity,
                quantity_left: quantity,
                user: user
});

user.orders.push(order);
coin.orders.push(order);

user.save(function(err){

});
coin.save(function(err){

});

order.save(function(err){

console.log('order saved');

});

});

}
else{

console.log(coin_one_name);
console.log('coinfucker '  + coin);
console.log('fucker ' + coin[coin_two_name].balance);

balance = coin[coin_one_name].balance;
buy_value = buy_price * buy_quantity;
buy_value_left = buy_value;
buy_quantity_left = buy_quantity;

console.log('buy quantity lefta ' + buy_quantity_left);

filled = 0;
complete = false;

total = 0;
quantity_purchased = 0;


$.each(sell_order, function(key,val){
sell_value = val.price * val.quantity_left;
quantity_purchased += val.quantity_left;
sell_order_id = val._id;
sell_price = val.price;
sell_quantity_left = val.quantity_left;

if (!complete ){
    if (sell_quantity_left >= buy_quantity_left){
        quantity_left = sell_quantity_left - buy_quantity_left;
        //update sell order

        if (sell_quantity_left == buy_quantity_left)
            Order.findByIdAndUpdate(sell_order_id, {$set: {quantity_left: quantity_left, pending: 'complete'}}, function(err, order){

            });
        else
            Order.findByIdAndUpdate(sell_order_id, {$set: {quantity_left: quantity_left}}, function(err, order){

            });

        //create buy order record and update balance
        User.findOne({email: req.session.user.email}).populate(coin_one_name + ' ' + coin_two_name).exec(function(err, user){

        //buy_quantity_left = buy_value_left / buy_price;


        //update buyer balance
        purchase_cost = buy_quantity_left * val.price;

        console.log('buy quantity left ' + key + ' ' + buy_quantity_left);
        console.log('purchase cost ' + key + ' ' + purchase_cost);

        user[coin_one_name].update({$inc: {balance: buy_quantity_left}}, { w: 1 }, callback);
        user[coin_two_name].update({$inc: {balance: -1 * purchase_cost}}, { w: 1 }, callback);

        function callback(){}
        //done updating buyer balance

        order = new Order({
                        time: new Date().getTime(),
                        coin_one_ticker: coin_one_ticker,
                        coin_two_ticker: coin_two_ticker,
                        side: 'buy',
                        price: buy_price,
                        quantity: buy_quantity,
                        quantity_left: 0,
                        user: user,
                        pending: 'complete'
        });

        user.orders.push(order);
        coin.orders.push(order);

        user.save(function(err){

        });
        coin.save(function(err){

        });

        order.save(function(err){

        console.log('order saved');

        });

        });

        //update balance on seller

        //console.log('sell order user ' + sell_order);
        User.findById(val['user']).populate(coin_one_name + ' ' + coin_two_name).exec(function(err, seller){
            console.log('dasell ' + seller);
            console.log('buy quantity left ' + buy_quantity_left);
            console.log('buy value left ' + buy_value_left);

            seller[coin_one_name].update({$inc: {balance: -1 * buy_quantity_left}}, { w: 1 }, function(err){

                purchase_cost = buy_quantity_left * val.price;
                seller[coin_two_name].update({$inc: {balance: purchase_cost}}, { w: 1 }, function(err){
                    req.session.processing = false;
                });

            });



        });


        complete = true;
    }
    else{
        //if sell quantity is less than the buy quantity
        console.log('shit is in elseb');

        //quantity_left = (sell_value - buy_value_left)/sell_price;
        //update sell order
        buy_quantity_left -= sell_quantity_left;

        Order.findByIdAndUpdate(sell_order_id, {$set: {quantity_left: 0, pending: 'complete'}}, function(err, order){

        });

        //create buy order record and update balance
        User.findOne({email: req.session.user.email}).populate(coin_one_name + ' ' + coin_two_name).exec(function(err, user){

        function callback(){}

        console.log('sell quantity left ' + key + ' ' + sell_quantity_left);
        console.log('sell value ' + key + ' ' + sell_value);
        //update buyer balance
        user[coin_one_name].update({$inc: {balance: sell_quantity_left}}, { w: 1 }, callback);
        user[coin_two_name].update({$inc: {balance: -1 * sell_value}}, { w: 1 }, callback);
        //done updating buyer balance

        if (key == sell_order.length -1 ){


            order = new Order({
                    time: new Date().getTime(),
                    coin_one_ticker: coin_one_ticker,
                    coin_two_ticker: coin_two_ticker,
                    side: 'buy',
                    price: buy_price,
                    quanitity: buy_quantity,
                    quantity_left: buy_quantity_left,
                    user: user,
                    pending: 'pending'
            });

            user.orders.push(order);
            coin.orders.push(order);

            user.save(function(err){

            });
            coin.save(function(err){

            });

            order.save(function(err){

            console.log('order saved');

            });


        }



        });

        //update balance on seller
        User.findById(val['user']).populate(coin_one_name + ' ' + coin_two_name).exec(function(err, seller){
            seller[coin_one_name].update({$inc: {balance: -1 * sell_quantity_left}}, { w: 1 }, function(err){

                seller[coin_two_name].update({$inc: {balance: sell_value}}, { w: 1 }, function(err){
                    req.session.processing = false;
                });

            });


        });


    }





}


});



}




}
});


});

}

});



app.post('/sell_order', function(req,res){

console.log('in sell order');

quantity = req.body.sell_amount;
price = req.body.sell_price;
coin_one_ticker = req.body.coin_ticker_one;
coin_two_ticker = req.body.coin_ticker_two;


Order.find({$and: [{coin_one_ticker: coin_one_ticker}, {coin_two_ticker: coin_two_ticker}, {side: 'buy'}, {pending: true}, {price: {$gte: price}}]}).sort({time: 1}).exec(function(err, buy_order){

Coin.findOne({code: coin_one_ticker}, function(err, coin){

min_order = .00001;

if (buy_order.length == 0 && quantity > min_order){

console.log("it is in here lol");
console.log(req.session.user.email);
User.findOne({email: req.session.user.email}, function(err, user){

console.log('da user ' + user);

order = new Order({
                time: new Date().getTime(),
                coin_one_ticker: coin_one_ticker,
                coin_two_ticker: coin_two_ticker,
                side: 'sell',
                price: price,
                quantity: quantity,
                quantity_left: quantity,
                user: user
});

user.orders.push(order);
coin.orders.push(order);

user.save(function(err){

});
coin.save(function(err){

});


order.save(function(err){

console.log('order saved');

});

});



}



});


});


});




app.get('/activate/:token', function(req,res){
token = req.params.token;

User.findOneAndUpdate({hash: token},  { $set: { activated: true }}, function(err, user){
if (user != null && user != undefined){

object = new Object();
object.email = user.email;
object.full_name = user.full_name;


req.session.activated = true;
req.session.user = object;
res.redirect('/');



}


else{



}

});

});


app.post('/login', function(req,res){

email = req.body.email;
password = req.body.password;

User.findOne({$and: [{email: email}, {password: password}]}, function(err, user){


if (user == null)
res.end('incorrect');


else if (user.activated){

object = new Object();
object.email = user.email;
object.full_name = user.full_name;
object.user_id = user._id;

req.session.activated = true;
req.session.user = object;

res.end(JSON.stringify(user));

}

else {

    res.end('unactivated');
}



});


});

app.post('/register', function(req,res){
body = req.body;

console.log(body);

require('crypto').randomBytes(48, function(ex, buf) {
    token = buf.toString('base64').replace(/\//g,'_').replace(/\+/g,'-');

    activation_url = 'http://localhost:8000/activate/' + token;


    console.log(token);
    user = new User({
                full_name: body.full_name,
                email: body.email,
                password: body.password,
                hash: token
    });
    user.save(function(err){
        console.log('user has been saved');



dogecoin_client.getNewAddress(function(err, address) {

dogecoin = new Coin({
    coin_name: 'dogecoin',
    code: 'doge',
    user: user,
    deposit_address: address,
    confirmation: 3,
    coin_number: 2,
    withdraw_fee: 1
});

dogecoin.save(function(err){

User.findOneAndUpdate({hash: token}, {$set: {dogecoin: dogecoin}},function(err, user){
console.log("did find" + JSON.stringify(user));
console.log("edited");

});

console.log('coin saved');

});


});

bitcoin_client.getNewAddress(function(err, address) {

bitcoin = new Coin({
    coin_name: 'bitcoin',
    code: 'btc',
    user: user,
    deposit_address: address,
    confirmation: 1,
    coin_number: 1,
    withdraw_fee: .0002
});

bitcoin.save(function(err){

User.findOneAndUpdate({hash: token}, {$set: {bitcoin: bitcoin}},function(err, user){
console.log("did find" + JSON.stringify(user));
console.log("edited");

});

console.log('coin saved');

});

});



});


sendgrid.send({
  to:       body.email,
  from:     'info@cryptox.com',
  subject:  'Hello World',
  text:     activation_url
}, function(err, json) {
  if (err) { return console.error(err); }
  console.log(json);
  res.end("done");


}); 






}); 

});




app.get('/balances2', function(req,res){

res.render('balances2.html');

});

app.post('/get_address', function(req,res){
coin_name = req.body.coin_name;

email = req.session.user.email;



User
.findOne({ email: email })
.populate(coin_name)
.exec(function (err, populated) {
    //console.log(populated.dogecoin.deposit_address)

    res.end(JSON.stringify(populated[coin_name]));

})




});

app.get('/balances', function(req,res){
email = req.session.user.email;
console.log(email);

User
.findOne({ email: email })
.populate('bitcoin dogecoin')
.exec(function (err, data) {
    console.log(data);
    res.render('tab_template.html', {data: JSON.stringify(data)});

    //res.end(JSON.stringify(populated.dogecoin));

})



});


app.get('/loggedin', function(req,res){
activated = true;
user = req.session.user;



res.render('index_exchange_logged_in.html', {activated: activated, user: JSON.stringify(user) });


});

app.get('/', function(req,res){

activated = req.session.activated;
user = req.session.user;

//console.log(activated);
if (activated == undefined) 
    activated = false;


console.log(activated);
console.log(user);
res.render('index_exchange.html', {activated: activated, user: JSON.stringify(user) });


});


app.get('/tester', function(req,res){

res.render('tester.html');

});


app.get('/process_ticket', function(req,res){

res.render('process_ticket.html');

});




app.get('/withdraw/:coin', function(req,res){
code = req.params.coin;
console.log("testing " + code);
Coin.findOne({code: code}, function(err, coin){
console.log('testcoin ' + coin);
res.render('tab_template_second.html',{data: JSON.stringify(coin)});

});

});

app.get('/withdraw2', function(req,res){

res.render("withdraw2.html");

});


app.get('/confirm', function(req,res){

res.render('withdraw_confirm.html');

});

app.get('/withdrawal', function(req,res){

console.log("theemail " + req.session.user.email);

User.findOne({email:req.session.user.email}).populate('withdrawals withdrawals.coin')
.exec(function (err, populated) {

console.log('popular ' + populated.withdrawals);

res.render('tab_template.html', {data: JSON.stringify(populated.withdrawals)});

});

});

app.get('/withdraw/confirm/:hash', function(req,res){
hash = req.params.hash;

Withdrawal.findOneAndUpdate({$and:[{hash: hash}, {pending: true}]}, {$set: {pending: false}}).populate('coin')
.exec(function (err, withdrawal) {
if (withdrawal != null){
res.render('withdraw_confirm.html');

console.log('duh ' + withdrawal.coin._id);

Coin.findByIdAndUpdate(withdrawal.coin._id, {$inc:{ pending_withdrawals: -1 * (withdrawal.amount + withdrawal.fee)}} , function(err, coin){

console.log("updated coin");

});

console.log(withdrawal);
console.log('the number ' + withdrawal.coin.coin_number);

index = withdrawal.coin.coin_number -1;
all_clients[index].sendToAddress(withdrawal.receiving_address, withdrawal.amount, function(err, txout){

Withdrawal.findOneAndUpdate({hash:hash }, {$set: {txid: txout}}, function(err, result){

console.log("withdraw updated");

});


console.log('sent trans ' + txout);

});






}

});



});

app.get('/deposit', function(req,res){

User.findOne({email:req.session.user.email}).populate('deposits deposits.coin')
.exec(function (err, populated) {
console.log('popular ' + populated.deposits);

res.render('tab_template.html', {data: JSON.stringify(populated.deposits)});

});

});


app.post('/withdraw', function(req,res){
console.log(req.body.amount);
console.log(req.body.address);
console.log(req.body.password);
console.log(req.body.email);
amount = req.body.amount;
coin_name = req.body.coin_name;
address = req.body.address;


User.findOne({$and:[{email: req.body.email}, {password: req.body.password}]}).populate(req.body.coin_name)
.exec(function (err, populated) {

if (populated == null)
    res.end("Incorrect password. Please try again!");
else{
console.log('in else');
available_balance = populated[req.body.coin_name].balance;

left = available_balance - amount;

if (left >= 0){

console.log(JSON.stringify(populated));
console.log(JSON.stringify(populated[coin_name]));

Coin.findById(populated[coin_name], function(err, test){

//console.log(test);

});

Coin.findByIdAndUpdate(populated[coin_name],{$inc:{balance: -1 * (amount), pending_withdrawals: amount}}, function(err, coin){

//console.log(coin);


require('crypto').randomBytes(48, function(ex, buf) {
    token = buf.toString('base64').replace(/\//g,'_').replace(/\+/g,'-');

    withdrawal = new Withdrawal({
        time: new Date().getTime(),
        coin_name: req.body.coin_name,
        amount: amount - coin.withdraw_fee,
        fee: coin.withdraw_fee,
        receiving_address: address,
        hash: token,
        coin: coin,
        coin_ticker: coin.code
    });

id = coin.user;

User.findByIdAndUpdate(id,{$push: {withdrawals: withdrawal}}, function(err, user){
console.log(user);

console.log('shit has saved');

});


    withdrawal.save(function(err){
        console.log('withdrawal saved');
    });

    res.end("withdraw");


});

/*
sendgrid.send({
  to:       body.email,
  from:     'info@cryptox.com',
  subject:  'Hello World',
  text:     activation_url
}, function(err, json) {
  if (err) { return console.error(err); }
  console.log(json);
  res.end("done"); */


}); 



}


}


});




});







setInterval(function(){


for (var i=0; i<2; i++){
(function(i){
all_clients[i].getBlockCount(function(err, blockcount) {

all_clients[i].getBlockHash(blockcount-2000, function(err, blockhash) {

all_clients[i].listSinceBlock(blockhash, 1, function(err, transactions) {



if (transactions != null && transactions != undefined){
coin_type = all_clients[i]['rpc']['opts']['user'];
coin_type = coin_type.substr(0, coin_type.indexOf('coin'));
coin_name = coin_type + 'coin';


//console.log(transactions);

$.each(transactions['transactions'], function(key,val){
transaction = val;
txid = transaction['txid'];
address = transaction['address'];
amount = transaction['amount'];
confirmations = transaction['confirmations'];
//process_transaction(txid, address_array, sent_address, amount);
if ( transaction['category'] == 'receive'){

//console.log("the amount " + amount);


(function(txid, address, amount, confirmations, coin_name){
Coin.findOne({deposit_address: address}).populate('user').exec(function(err, coin){

if (coin!= null){

Deposit.findOne({txid: txid}, function(err, deposit){


if (deposit == null){

//console.log('the address ' + address + ' the amount ' + amount);

Coin.findOneAndUpdate({deposit_address: address}, {$inc: {"pending_deposits": amount}}, function(err, coin){

//console.log('updated coin ' + coin);

coin_type = coin.coin_name.substr(0, coin.coin_name.indexOf('coin'));

    var deposit = new Deposit({
        time:  new Date().getTime(),
        coin_name: coin_type + 'coin',
        amount: amount,
        deposit_address: address,
        txid: txid,
        coin: coin,
        coin_ticker: coin.code
    });

id = coin.user;
//console.log('daid' + id);
User.findByIdAndUpdate(id,{$push: {deposits: deposit}}, function(err, user){
//console.log(user);

//console.log('shit has saved');

});

    console.log(deposit);

    coin.deposits.push(deposit);
    coin.save(function(err){
        //console.log('coin updated');
    });

    deposit.save(function(err){
        //console.log('saved');

    });


});



}

else{

Coin.findOne({coin_name: coin_name}, function(err, coin){

min_confirmations = coin['confirmation'];
console.log(min_confirmations);

if (confirmations > min_confirmations){

Deposit.findOneAndUpdate({$and: [{pending: true}, {txid: txid}]},{$set: {pending: false}} ,function(err, deposit){

//console.log("status changed" + deposit);
if (deposit != null){

Coin.findOneAndUpdate({coin_name: coin_name}, {$inc:{pending_deposits: -1 * deposit.amount, balance: deposit.amount}},function(err, coin){



});

}



});


}
else console.log('nonono')

});

}


});
}

});
}(txid, address, amount, confirmations, coin_name));


}




});


}
});

}); 

});
}(i));

}
},8000);

//update deposits that have been confirmed




server.listen(app.get('port'));



