var bitcoin = require('bitcoin');


var client = new bitcoin.Client({
  host: 'localhost',
  port: 8332,
  user: 'bitcoinrpc',
  pass: '879ef0325183be0088b4f69cd9fb25dc'
});

client.cmd('getblockcount', function(err, balance){
  if (err) return console.log(err);
  console.log('Balance:', balance);
});


/*
client.cmd('decoderawtransaction', '34353235633834313131373435343161623631356537623462373735623866356130353332356537326264383633316664643439336432333436373061353830', function(err, balance){
  if (err) return console.log(err);
  console.log('Balance:', balance);
});*/

txid = '4525c8411174541ab615e7b4b775b8f5a05325e72bd8631fdd493d234670a580';
n= 0;
address = '13YteEVecArYiRETzyccPvG7nrTrjg1mhD';
amount = .0001;


client.cmd('createrawtransaction' , [{"txid":txid,"vout":n}], {address:amount}, function(err, balance){
  if (err) return console.log(err);
  console.log('Balance:', balance);
  console.log("fuck");
});


