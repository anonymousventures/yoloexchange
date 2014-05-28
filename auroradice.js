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


/*
D78tcgw7GDcyb6eByLWHFuS3fMJheKYMzA
DHwCe1krFX1auGdoZ8fHCZNDZawx7MQYKk
DNeNHyBjcW171bMsF2jTJW4JL1ioT9f2rg
DUQTkmvT1ubA5morWD4J6rjCbrPZifSSDy
D6Ahbgxj126v9Lxa23TKg444jHJcLq7fTB
*/


setInterval(function(){

client.getBlockCount(function(err, blockcount) {

client.getBlockHash(blockcount-50000, function(err, blockhash) {

client.listSinceBlock(blockhash,function(err, transactions) {

var game_addresses = {	"D78tcgw7GDcyb6eByLWHFuS3fMJheKYMzA": 10,
					  	"DHwCe1krFX1auGdoZ8fHCZNDZawx7MQYKk": 25,
						"DNeNHyBjcW171bMsF2jTJW4JL1ioT9f2rg": 50,
						"DUQTkmvT1ubA5morWD4J6rjCbrPZifSSDy": 75,
						"D6Ahbgxj126v9Lxa23TKg444jHJcLq7fTB": 90}

var game_odds = {
	//address => odds for the address
	"D78tcgw7GDcyb6eByLWHFuS3fMJheKYMzA": 9.810,
	"DHwCe1krFX1auGdoZ8fHCZNDZawx7MQYKk": 3.924,
	"DNeNHyBjcW171bMsF2jTJW4JL1ioT9f2rg": 1.962,
	"DUQTkmvT1ubA5morWD4J6rjCbrPZifSSDy": 1.308,
	"D6Ahbgxj126v9Lxa23TKg444jHJcLq7fTB": 1.090
}


if (transactions != undefined){
if (transactions.length !=0){
$.each(transactions['transactions'], function(key,val){
transaction = val;
txid = transaction['txid'];
address = transaction['address'];;


if (address in game_addresses && transaction['category'] == 'receive'){



(function(txid, game_addresses, address){
Processed.findOne({txin: txid}, function(error, tran){
//console.log('the tran ' + tran);

if (tran == null || tran == undefined){

//console.log("da address" + address);
console.log(game_addresses[address]);
console.log(txid);

process_transaction(txid, game_addresses[address], address, game_odds[address]);



/*
processed = new Processed({
txin: txid
});

processed.save(function(err){

console.log('saved');

});*/






}

});

})(txid, game_addresses, address);


}




});



}
}



});	


});	


}); 

 
},5000);


//end


function process_transaction(txid, game_odds, odd_address, multiplier){

//console.log('test ' + txid);


stx = txid;
odd = game_odds;
odd_address = odd_address;


max_bet = 10;
min_bet = 0.00001;


play_log = new Object();

play_log.txin = txid;
play_log.oddaddress = odd_address;
play_log.odd = game_odds;

(function(stx, odd, odd_address, max_bet, min_bet, play_log){
client.getRawTransaction(txid, 1, function(err, transactiondetails) {


vintxid = transactiondetails['vin'][0]['txid'];
vinvout = transactiondetails['vin'][0]['vout'];


k = 0;
kvin = 0;
bet = '';

stop = false;
$.each(transactiondetails['vout'], function(key,val){

td = val;

	if ( td["scriptPubKey"]["addresses"][0] == odd_address && stop == false){
		
		bet = td["value"];
		vinscriptpubkey = td["scriptPubKey"]["hex"];
		kvin = k;
		stop = true;
		//break;
	}	
	k++;


});

play_log.bet = bet;
play_log.timestamp = new Date().getTime();


if (bet >= min_bet && bet <= max_bet ){
	
	//console.log('inside min bet thing');
	//console.log('test again ' + txid);
		check = false;
		//while ( !check ){
		//console.log(vintxid);
		//console.log(vinvout);



(function(play_log){
get_player_address(vintxid, vinvout, function(playeraddress){

			console.log('in here');

			//console.log('the player address ' + playeraddress);
			play_log.betaddress = playeraddress;
			//console.log('play log ' + JSON.stringify(play_log));

			//play game
			salt = 'c17f1727a0b869e8bb207d220101cdf1';
			txidrnd = play_log.txin;


			var md5sum = crypto.createHash('md5');

			md5sum.update(txidrnd + salt);

			var d = md5sum.digest('hex');
			
			//play game

			last_four_chars = d.substr(d.length -4);
			//console.log(last_four_chars);
			random_number = parseInt(last_four_chars, 16);
			lucky_number = 100 - (random_number % 100);


			win = true;

			if (play_log.odd == 10){
				if (lucky_number > 9 )
				win = false
			}
			else if (play_log.odd == 25){
				if (lucky_number > 24 )
				win = false
			}
			else if (play_log.odd == 50){
				if (lucky_number > 49 )
				win = false
			}
			else if (play_log.odd == 75){
				if (lucky_number > 74 )
				win = false
			}
			else if (play_log.odd == 90){
				if (lucky_number > 89 )
				win = false
			}

			if (!win){

			console.log('loss');

			ttt = play_log.bet-LOOSER_BACK-TRANSACTION_FEE;

			client.sendToAddress(play_log.betaddress, LOOSER_BACK, function(err, txout){

			//console.log('money back ' + txout);
   			//play_log.txout = txout;
			play_log.outcome = 0;
			play_log.sumout = LOOSER_BACK;

			console.log(JSON.stringify(play_log));


			//save info

				processed = new Processed({
				txin: play_log.txin,
			    betaddress: play_log.oddaddress,
			    odds: play_log.odd,
			    bet: play_log.bet,
			    player_address: play_log.betaddress,
			    outcome: play_log.outcome,
			    sumout: play_log.sumout,
			    timestamp: play_log.timestamp
				});

			console.log(processed);

			var formatted_time = moment.unix(play_log.timestamp).format('MMMM Do YYYY, h:mm:ss a');

			betaddress = play_log.oddaddress;
			player_address = play_log.betaddress;

			delete play_log.oddaddress;
			play_log.betaddress = betaddress;
			play_log.player_address = player_address;
			play_log.timestamp = formatted_time;

			console.log(JSON.stringify(play_log));

				fs.appendFile('log.txt', JSON.stringify(play_log) + "\r\n", function (err) {
  				if (err) throw err;
  				console.log('The "data to append" was appended to file!');
				});			


			processed.save(function(err){

			console.log('saved');

			});



			});


			}
			else{
			console.log('win');

			win = play_log.bet * multiplier;


			client.sendToAddress(play_log.betaddress, win, function(err, txout){
				//play_log.txout = txout;

				//console.log('money back ' + txout);

				play_log.outcome = 1;
				play_log.sumout = win;

				//console.log(JSON.stringify(play_log));

				//save info

				processed = new Processed({
				txin: play_log.txin,
			    betaddress: play_log.oddaddress,
			    odds: play_log.odd,
			    bet: play_log.bet,
			    player_address: play_log.betaddress,
			    outcome: play_log.outcome,
			    sumout: play_log.sumout,
			    timestamp: play_log.timestamp
				});

				console.log(processed);

				var formatted_time = moment.unix(play_log.timestamp).format('MMMM Do YYYY, h:mm:ss a');

				betaddress = play_log.oddaddress;
				player_address = play_log.betaddress;

				delete play_log.oddaddress;
				play_log.betaddress = betaddress;
				play_log.player_address = player_address;
				play_log.timestamp = formatted_time;

				console.log(JSON.stringify(play_log));

				processed.save(function(err){

				console.log('saved ah');

				});


				fs.appendFile('log.txt', JSON.stringify(play_log) + "\r\n", function (err) {
  				if (err) throw err;
  				console.log('The "data to append" was appended to file!');
				});			





			});

			}


});

})(play_log);


function get_player_address(vintxid, vinvout, fn){
	client.getRawTransaction(vintxid, 1, function(err, transactionin){
		//console.log('raw ' + JSON.stringify(transactionin));

		//console.log('transaction vout' + JSON.stringify(transactionin['vout']));

		fodd = false;

		$.each(transactionin["vout"], function(key,vitem){
			if ( vitem["scriptPubKey"]["addresses"][0] == odd_address ){
				fodd = true;
				console.log('f odd true');;
			}
		});
		if ( fodd ){
			//console.log('fodd');
			vintxid = transactionin['vin'][0]['txid'];
			vinvout = transactionin['vin'][0]['vout'];
			lol(vintxid, vinvout);

		}else{
			//console.log('stop');
			playeraddress = transactionin['vout'][vinvout]['scriptPubKey']['addresses'][0];
    		//console.log(playeraddress + "$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$");
    		fn(playeraddress);

			//check = true;
			//don't continue				
		}

	});

	}




}




});

}(stx, odd, odd_address, max_bet, min_bet, play_log));







}



