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
var csrf = express.csrf();
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


        var conditionalCSRF = function (req, res, next) {
          //compute needCSRF here as appropriate based on req.path or whatever
          if ( req.path.indexOf('buy_order')!= -1  || req.path.indexOf('ask')!= -1 ) {
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
    last_trade_time: Number,
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
    order_fee: Number,
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


app.get('/market/:coin1/:coin2', csrf, function(req,res){
coin1 = req.params.coin1;
coin2 = req.params.coin2;


//csrf = req.session._csrf;
console.log('csrf ' + req.session._csrf);

current_time = Math.floor(new Date().getTime()/1000);
one_day_ago = current_time - (60 * 60 * 24);


Order.find({$and:[{coin_one_ticker: coin1}, {coin_two_ticker: coin2}, {pending: 'pending'}, {side: 'ask'}, {pending: {'$ne': 'cancelled' }}]}, function(err, pending_asks){
Order.find({$and:[{coin_one_ticker: coin1}, {coin_two_ticker: coin2}, {pending: 'pending'}, {side: 'bid'}, {pending: {'$ne': 'cancelled' }}]}, function(err, pending_bids){
//find all orders within past day
Order.find({$and:[{coin_one_ticker: coin1}, {coin_two_ticker: coin2}, {time: {$gte: one_day_ago}}, {pending: {'$ne': 'cancelled' }}]}, function(err, orders_within_day){
//find last order
Order.findOne({$and:[{coin_one_ticker: coin1}, {coin_two_ticker: coin2}, {last_trade_time: {'$ne': null }}, {pending: {'$ne': 'cancelled' }}]}).sort('-last_trade_time').limit(1).exec(function(err, last_order){
//find lowest price in 24 hours
Order.findOne({$and:[{coin_one_ticker: coin1}, {coin_two_ticker: coin2}, {last_trade_time: {'$ne': null }}, {pending: {'$ne': 'cancelled' }}]}).sort({price: 1}).limit(1).exec(function(err, lowest_order){
//find highest price in 24 hours
Order.findOne({$and:[{coin_one_ticker: coin1}, {coin_two_ticker: coin2}, {last_trade_time: {'$ne': null }}, {pending: {'$ne': 'cancelled' }}]}).sort({price: -1}).limit(1).exec(function(err, highest_order){

Coin.findOne({code: coin1}, function(err, coin_one){
Coin.findOne({code: coin2}, function(err, coin_two){
User.findOne({email: req.session.user.email}).populate(coin_one.coin_name + ' ' + coin_two.coin_name).exec(function (err, coin) {

coin_one_balance = coin[coin_one.coin_name].balance;
coin_two_balance = coin[coin_two.coin_name].balance;

coin_one_name = coin_one.coin_name;
coin_two_name = coin_two.coin_name;
console.log("coin one balance " + coin_one_balance);
console.log("coin two balance " + coin_two_balance);

if (last_order == null){
last_price = 0;
low_price = 0;
high_price = 0;
volume = 0;
pending_asks = null;
pending_bids = null;

}
else{
last_price = last_order.price;
low_price = lowest_order.price;
high_price = highest_order.price;


console.log('last_price ' + last_price);
console.log('low price ' + low_price);
console.log('high price ' + high_price);

volume = 0;
$.each(orders_within_day, function(key,val){

volume += (val.quantity - val.quantity_left);

});

volume = volume/2;
console.log('volume ' + volume);
console.log('pending asks ' + pending_asks);
console.log('pending bids ' + pending_bids);

}

console.log('last_price ' + last_price);
console.log('low price ' + low_price);
console.log('high price ' + high_price);

console.log('volume ' + volume);
console.log('pending asks ' + pending_asks);
console.log('pending bids ' + pending_bids);


res.render('trade.html', {csrf: JSON.stringify(req.session._csrf), volume: volume, coin_one_balance: coin_one_balance, coin_two_balance: coin_two_balance, last_price: last_price, low_price: low_price, high_price: high_price, coin_one_name: JSON.stringify(coin_one_name), coin_two_name: JSON.stringify(coin_two_name), coin_one_ticker: JSON.stringify(coin1), coin_two_ticker: JSON.stringify(coin2), pending_asks: JSON.stringify(pending_asks), pending_bids: JSON.stringify(pending_bids)});


});
});
});
});
});
});


});
});
});


});



app.post('/buy_order',  csrf, function(req,res){
//req.session.processing = false;
console.log('overhere' + req.session._csrf);
console.log(req.session.processing);

if (req.session.processing == undefined)
    req.session.processing = false;

if (req.session.processing == false){
req.session.processing = true;


quantity = req.body.bid_quantity;
price = req.body.bid_price;
bid_price = price;
bid_quantity = quantity;

coin_one_name = req.body.coin_name_one;
coin_two_name = req.body.coin_name_two;
coin_one_ticker = req.body.coin_ticker_one
coin_two_ticker = req.body.coin_ticker_two;

//console.log('coinone' + coin_one_name);

console.log('coin one ticker ' + coin_one_ticker);
console.log('coin two ticker ' + coin_two_ticker);
console.log('bid price ' + bid_price);
//coin_one_ticker = 'doge';
//coin_two_ticker = 'btc';
//price = 100;
//res.end('done');


Order.find({$and: [{coin_one_ticker: coin_one_ticker}, {coin_two_ticker: coin_two_ticker}, {side: 'ask'}, {pending: 'pending'}, {price: {$lte: bid_price}}]}).populate('user').sort({time: 1}).exec(function(err, ask){

console.log('ask ' + ask)
//console.log('sell ordera ' + sell_order);
//console.log('sell orderb ' + sell_order['user']);
//coin_name_one = coin_one_ticker + 'coin';

//gets info for user that submitted the post request, and info on the relevant coins he owns
User.findOne({email: req.session.user.email}).populate(coin_one_name + ' ' + coin_two_name).exec(function (err, coin) {

//console.log('dacoin ' + coin);

//Coin.findOne({code: coin_one_ticker}, function(err, coin){

min_order = .00001;

balance = coin[coin_two_name].balance;
bid_value = bid_price * bid_quantity;

console.log('bid ' + bid_price);
console.log('quantity ' + bid_quantity);
console.log('dabalance ' + balance);
console.log('buyvalue ' + bid_value);


if (balance >= bid_value){

if (ask.length == 0 && quantity > min_order){

console.log("it is in here lol");

User.findOne({email: req.session.user.email}, function(err, user){

order = new Order({
                time: new Date().getTime(),
                //last_trade_time: new Date().getTime(),
                coin_one_ticker: coin_one_ticker,
                coin_two_ticker: coin_two_ticker,
                side: 'bid',
                price: price,
                quantity: quantity,
                quantity_left: quantity,
                user: user
});

user.orders.push(order);


user.save(function(err){

});


order.save(function(err){

console.log('order saved');

});



req.session.processing = false;
res.end('done');

//console.log(req.session.processing);





});


}
else{

console.log(coin_one_name);
//console.log('coinfucker '  + coin);
//console.log('fucker ' + coin[coin_two_name].balance);

balance = coin[coin_one_name].balance;
bid_value = bid_price * bid_quantity
bid_value_left = bid_value;
bid_quantity_left = bid_quantity;

console.log('buy quantity lefta ' + bid_quantity_left);

complete = false;

total = 0;



$.each(ask, function(key,val){
ask_value = val.price * val.quantity_left;
ask_order_id = val._id;
ask_price = val.price;
ask_quantity_left = val.quantity_left;

(function(ask_value, ask_order_id, ask_price, ask_quantity_left, key){
if (!complete ){
    if (ask_quantity_left >= bid_quantity_left){
        quantity_left = ask_quantity_left - bid_quantity_left;
        //update sell order

        if (ask_quantity_left == bid_quantity_left)
            Order.findByIdAndUpdate(ask_order_id, {$set: {quantity_left: quantity_left, pending: 'complete', last_trade_time: new Date().getTime()}}, function(err, order){

            });
        else
            Order.findByIdAndUpdate(ask_order_id, {$set: {quantity_left: quantity_left, last_trade_time: new Date().getTime()}}, function(err, order){

            });

        //create buy order record and update balance
        User.findOne({email: req.session.user.email}).populate(coin_one_name + ' ' + coin_two_name).exec(function(err, user){

        //buy_quantity_left = buy_value_left / buy_price;


        //update buyer balance
        purchase_cost = bid_quantity_left * val.price;

        console.log('buy quantity left ' + key + ' ' + bid_quantity_left);
        console.log('purchase cost ' + key + ' ' + ask_value);

        user[coin_one_name].update({$inc: {balance: bid_quantity_left}}, { w: 1 }, callback);
        user[coin_two_name].update({$inc: {balance: -1 * purchase_cost}}, { w: 1 }, callback);

        function callback(){}
        //done updating buyer balance

        order = new Order({
                        time: new Date().getTime(),
                        //last_trade_time: new Date().getTime(),
                        coin_one_ticker: coin_one_ticker,
                        coin_two_ticker: coin_two_ticker,
                        side: 'bid',
                        price: bid_price,
                        quantity: bid_quantity,
                        quantity_left: 0,
                        user: user,
                        pending: 'complete'
        });

        user.orders.push(order);


        user.save(function(err){

        });


        order.save(function(err){

        console.log('order saved');

        });

        });

        //update balance on seller

        //console.log('sell order user ' + sell_order);
        User.findById(val['user']).populate(coin_one_name + ' ' + coin_two_name).exec(function(err, seller){
            //console.log('dasell ' + seller);
            console.log('buy quantity left ' + bid_quantity_left);
            console.log('buy value left ' + bid_value_left);

            seller[coin_one_name].update({$inc: {balance: -1 * bid_quantity_left}}, { w: 1 }, function(err){

                purchase_cost = bid_quantity_left * val.price;
                seller[coin_two_name].update({$inc: {balance: purchase_cost}}, { w: 1 }, function(err){

                    req.session.processing = false;
                    res.end('done');

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
        bid_quantity_left -= ask_quantity_left;

        Order.findByIdAndUpdate(ask_order_id, {$set: {quantity_left: 0, pending: 'complete', last_trade_time: new Date().getTime()}}, function(err, order){

        });

        //create buy order record and update balance
        User.findOne({email: req.session.user.email}).populate(coin_one_name + ' ' + coin_two_name).exec(function(err, user){

        function callback(){}

        console.log('sell quantity left ' + key + ' ' + ask_quantity_left);
        console.log('sell value ' + key + ' ' + ask_value);
        //update buyer balance
        user[coin_one_name].update({$inc: {balance: ask_quantity_left}}, { w: 1 }, callback);
        user[coin_two_name].update({$inc: {balance: -1 * ask_value}}, { w: 1 }, callback);
        //done updating buyer balance

        if (key == ask.length -1 ){


            order = new Order({
                    time: new Date().getTime(),
                    last_trade_time: new Date().getTime(),
                    coin_one_ticker: coin_one_ticker,
                    coin_two_ticker: coin_two_ticker,
                    side: 'bid',
                    price: bid_price,
                    quantity: bid_quantity,
                    quantity_left: bid_quantity_left,
                    user: user,
                    pending: 'pending'
            });

            user.orders.push(order);


            user.save(function(err){

            });


            order.save(function(err){

            console.log('order saved');

            });


        }



        });

        //update balance on seller
        User.findById(val['user']).populate(coin_one_name + ' ' + coin_two_name).exec(function(err, seller){
            seller[coin_one_name].update({$inc: {balance: -1 * ask_quantity_left}}, { w: 1 }, function(err){

                seller[coin_two_name].update({$inc: {balance: ask_value}}, { w: 1 }, function(err){

                    req.session.processing = false;
                    res.end('done');
                });

            });


        });


    }






}
}(ask_value, ask_order_id, ask_price, ask_quantity_left, key));


});



}




}
});


});

}

});




app.post('/ask', csrf, function(req,res){



console.log( 'ask + \r\n')

if (req.session.processing_sell == undefined)
    req.session.processing_sell = false;

if (req.session.processing_sell == false){
req.session.processing_sell = true;

ask_quantity = req.body.ask_quantity;
ask_price = req.body.ask_price;
console.log(' ap ' + ask_price);

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

Order.find({$and: [{coin_one_ticker: coin_one_ticker}, {coin_two_ticker: coin_two_ticker}, {side: 'bid'}, {pending: 'pending'}, {price: {$gte: ask_price}}]}).populate('user').sort({time: 1}).exec(function(err, bid){

//console.log('sell ordera ' + sell_order);
//console.log('sell orderb ' + sell_order['user']);
//coin_name_one = coin_one_ticker + 'coin';

//gets info for user that submitted the post request, and info on the relevant coins he owns
User.findOne({email: req.session.user.email}).populate(coin_one_name + ' ' + coin_two_name).exec(function (err, coin) {

//console.log('dacoin ' + coin);

//Coin.findOne({code: coin_one_ticker}, function(err, coin){
min_order = .00001;

balance = coin[coin_one_name].balance;
ask_value = ask_price * ask_quantity;

console.log('bid ' + ask_price);
console.log('quantity ' + ask_quantity);
console.log('dabalance ' + balance);
console.log('buyvalue ' + ask_value);


if (balance >= ask_value){
console.log('inside');

if (bid.length == 0 && ask_quantity > min_order){

console.log("it is in here lol");

User.findOne({email: req.session.user.email}, function(err, user){

order = new Order({
                time: new Date().getTime(),
                coin_one_ticker: coin_one_ticker,
                coin_two_ticker: coin_two_ticker,
                side: 'ask',
                price: ask_price,
                quantity: ask_quantity,
                quantity_left: ask_quantity,
                user: user
});

user.orders.push(order);


user.save(function(err){

});


order.save(function(err){

console.log('order saved');

});

});

}
else{

console.log(coin_one_name);
//console.log('coinfucker '  + coin);
console.log('fucker ' + coin[coin_two_name].balance);



ask_value_left = ask_value;
ask_quantity_left = ask_quantity;

//console.log('sell quantity lefta ' + key + ' ' + ask_quantity_left);

complete = false;

total = 0;

console.log('orignal ask quantity left ' + ask_quantity_left);

$.each(bid, function(key,val){
bid_value = val.price * val.quantity_left;
bid_order_id = val._id;
bid_price = val.price;
bid_quantity_left = val.quantity_left;


(function(bid_value, bid_order_id, bid_price, bid_quantity_left, key){

console.log('here ask quantity left ' + key + ' ' + ask_quantity_left);


if (!complete ){
console.log("fuckingtest" + bid_quantity_left + ' ' + ask_quantity_left);
    if (bid_quantity_left >= ask_quantity_left){
        quantity_left = bid_quantity_left - ask_quantity_left;
        console.log('bid quantity leftb ' + key + ' ' + bid_quantity_left);
        //update bid order
        console.log('yoloa '  + key + ' ' + ask_quantity_left);
        if (bid_quantity_left == ask_quantity_left)
            Order.findByIdAndUpdate(bid_order_id, {$set: {quantity_left: quantity_left, pending: 'complete', last_trade_time: new Date().getTime()}}, function(err, order){

            });
        else
            Order.findByIdAndUpdate(bid_order_id, {$set: {quantity_left: quantity_left, last_trade_time: new Date().getTime()}}, function(err, order){

            });

        //create ask order record and update balance
        User.findOne({email: req.session.user.email}).populate(coin_one_name + ' ' + coin_two_name).exec(function(err, user){

        //buy_quantity_left = buy_value_left / buy_price;


        //update askers balance
        sell_price = ask_quantity_left * bid_price;

        console.log('bid price ' + bid_price);
        console.log('bid quantity leftb ' + bid_quantity_left );
        console.log('yolob '  + key + ' ' + sell_price);
        //console.log('sell price ' + key + ' ' + sell _price);

        user[coin_one_name].update({$inc: {balance: -1 * ask_quantity_left}}, { w: 1 }, callback);
        user[coin_two_name].update({$inc: {balance: sell_price}}, { w: 1 }, callback);

        function callback(){}
        //done updating buyer balance

        order = new Order({
                        time: new Date().getTime(),
                        coin_one_ticker: coin_one_ticker,
                        coin_two_ticker: coin_two_ticker,
                        side: 'ask',
                        price: ask_price,
                        quantity: ask_quantity,
                        quantity_left: 0,
                        user: user,
                        pending: 'complete'
        });

        user.orders.push(order);


        user.save(function(err){

        });

        order.save(function(err){

        console.log('order saved');

        });

        });

        //update balance on buyer

        //console.log('sell order user ' + sell_order);
        User.findById(val['user']).populate(coin_one_name + ' ' + coin_two_name).exec(function(err, buyer){
            //console.log('dabuy ' + buyer);
            //console.log('buy quantity left ' + bid_quantity_left);
            //console.log('buy value left ' + ask_value_left);

            buyer[coin_one_name].update({$inc: {balance: ask_quantity_left}}, { w: 1 }, function(err){

                buy_price = ask_quantity_left * bid_price;
                buyer[coin_two_name].update({$inc: {balance: -1 * buy_price}}, { w: 1 }, function(err){
                    req.session.processing_sell = false;
                    res.end('done');
                });

            });



        });


        complete = true;
    }
    else{
        //if bid quantity is less than the ask quantity
        console.log('shit is in elseb');

        //quantity_left = (sell_value - buy_value_left)/sell_price;
        //update bid order
        //console.log('bid quantity lefta ' + key + ' ' + bid_quantity_left);

        ask_quantity_left -= bid_quantity_left;
        console.log('elsea ask quantity left ' + key + ' ' + ask_quantity_left);

        Order.findByIdAndUpdate(bid_order_id, {$set: {quantity_left: 0, pending: 'complete', last_trade_time: new Date().getTime()}}, function(err, order){

        });

        //update balance for user that submitted ask order
        User.findOne({email: req.session.user.email}).populate(coin_one_name + ' ' + coin_two_name).exec(function(err, user){

        function callback(){}



        console.log('elseb ask quantity left ' + key + ' ' + ask_quantity_left);

        sell_price = bid_quantity_left * bid_price;


        console.log('bid quantity leftai ' + key + ' ' + bid_quantity_left);

        console.log('bid quantity left ' + bid_quantity_left);
        console.log('bid price ' + bid_price);
        console.log('sell price ' + sell_price);

        //update asker's balance
        user[coin_one_name].update({$inc: {balance: -1 * bid_quantity_left}}, { w: 1 }, callback);
        user[coin_two_name].update({$inc: {balance: sell_price}}, { w: 1 }, callback);
        //done updating  asker's balance

        //create ask order after processing last bid
        if (key == bid.length -1 ){


            order = new Order({
                    time: new Date().getTime(),
                    coin_one_ticker: coin_one_ticker,
                    coin_two_ticker: coin_two_ticker,
                    side: 'ask',
                    price: ask_price,
                    quantity: ask_quantity,
                    quantity_left: ask_quantity_left,
                    user: user,
                    pending: 'pending'
            });

            user.orders.push(order);

            user.save(function(err){

            });


            order.save(function(err){

            console.log('order saved');

            });


        }



        });

        //update balance on bidder
        User.findById(val['user']).populate(coin_one_name + ' ' + coin_two_name).exec(function(err, buyer){
            buyer[coin_one_name].update({$inc: {balance: bid_quantity_left}}, { w: 1 }, function(err){

                //sell_price = bid_quantity_left * bid_price;
                buyer[coin_two_name].update({$inc: {balance: -1 * sell_price}}, { w: 1 }, function(err){
                    req.session.processing_sell = false;
                    res.end('done');
                });

            });


        });


    }





}
}(bid_value, bid_order_id, bid_price, bid_quantity_left, key));

});



}




}
});


});

}




});


app.post('/sell_order_prior', function(req,res){

console.log('in sell order');

quantity = req.body.sell_amount;
price = req.body.sell_price;
coin_one_ticker = req.body.coin_ticker_one;
coin_two_ticker = req.body.coin_ticker_two;


Order.find({$and: [{coin_one_ticker: coin_one_ticker}, {coin_two_ticker: coin_two_ticker}, {side: 'bid'}, {pending: true}, {price: {$gte: price}}]}).sort({time: 1}).exec(function(err, buy_order){

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
                side: 'ask',
                price: price,
                quantity: quantity,
                quantity_left: quantity,
                user: user
});

user.orders.push(order);


user.save(function(err){

});



order.save(function(err){

console.log('order saved');

});

});



}



});


});


});



app.get('/chart', function(req,res){

res.render("samples/stockMultiplePanels.html");

});

app.get('/chart2', function(req,res){

res.render("samples/chart2.html");

});

app.get('/chart3', function(req,res){

res.render("samples/chart3.html");

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
    withdraw_fee: 1,
    order_fee: .015
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
    withdraw_fee: .0002,
    order_fee: .015
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




app.get('/orders', function(req,res){

console.log("theemail " + req.session.user.email);

User.findOne({email:req.session.user.email}).populate({
  path: 'orders',
  match: { pending: 'pending'}
})
.exec(function (err, populated) {

console.log('popular ' + populated.orders);

res.render('tab_template.html', {data: JSON.stringify(populated.orders)});

});

});

app.post('/cancel_order', function(req,res){

console.log(req.body.order_id);

Order.findByIdAndUpdate(req.body.order_id, {$set: {pending: 'cancelled'}}, function(err, order){

console.log("order cancelled");
res.end("done");
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

console.log("status changed" + deposit);
if (deposit != null){
console.log(deposit.amount);
console.log('deposit ' + deposit);

Coin.findOneAndUpdate({coin_name: coin_name}, {$inc:{pending_deposits: -1 * deposit.amount, balance: deposit.amount}},function(err, coin){
console.log('status changed coin' + coin);


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



