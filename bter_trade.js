    var bter = require('bter');

    var API_KEY = '3723B131-974B-4501-B261-F1C267FB199B', SECRET_KEY = 'd43a9349599fa596d3bdf56032983b854d5d78ba9deef802047d2f3465b5fe5e';


    /*
    bter.getAllPairs(function(err, result) {
        if(err) throw err;
        console.log(result);
    }); */

    /*
    bter.getTicker({ CURR_A: 'vtc', CURR_B: 'cny' }, function(err, result) {
        if(err) throw err;
        console.log(result);
    }); */


/*
var myVar = setInterval(function(){getDepth()},1000);

function getDepth()
{

    bter.getDepth({ CURR_A: 'vtc', CURR_B: 'cny' }, function(err, result) {
        if(err) throw err;

        $.each(result, function(key,val){
        
        console.log(result['bids'][0]);


        });


    });

} */

    // Gets the 80 most recent trade orders
    bter.getHistory({ CURR_A: 'vtc', CURR_B: 'cny' }, function(err, result) {
        if(err) throw err;
        console.log(result);
    });

/*
    // Gets all pairs available
    bter.getAllPairs(function(err, result) {
        if(err) throw err;
        console.log(result);
    });

    // Gets all ticker information for the given pair
    bter.getTicker({ CURR_A: 'doge', CURR_B: 'btc' }, function(err, result) {
        if(err) throw err;
        console.log(result);
    });

    // Gets all market depth including buy/ask orders
    bter.getDepth({ CURR_A: 'doge', CURR_B: 'btc' }, function(err, result) {
        if(err) throw err;
        console.log(result);
    });

    // Gets the 80 most recent trade orders
    bter.getHistory({ CURR_A: 'doge', CURR_B: 'btc' }, function(err, result) {
        if(err) throw err;
        console.log(result);
    });

    // Gets the current balance of the account
    bter.getFunds({ API_KEY: API_KEY, SECRET_KEY: SECRET_KEY }, function(err, result) {
        if(err) throw err;
        console.log(result);
    });

    // Places a new order (buy or sell)
    bter.placeOrder({ API_KEY: API_KEY, SECRET_KEY: SECRET_KEY, PAIR: 'doge_btc', TYPE: 'SELL', RATE: '0.00000225', AMOUNT: '300000' },
        function(err, result) {
            if(err) throw err;
            console.log(result);
        });

    // Cancels an open order
    bter.cancelOrder({ API_KEY: API_KEY, SECRET_KEY: SECRET_KEY, ORDER_ID: 9395299 }, function(err, result) {
        if(err) throw err;
        console.log(result);
    });

    // Gets the status of the given order
    bter.getOrderStatus({ API_KEY: API_KEY, SECRET_KEY: SECRET_KEY, ORDER_ID: 9395299 }, function(err, result) {
        if(err) throw err;
        console.log(result);
    });

    // Gets the entire open order list
    bter.getOrderList({ API_KEY: API_KEY, SECRET_KEY: SECRET_KEY }, function(err, result) {
        if(err) throw err;
        console.log(result);
    }); */