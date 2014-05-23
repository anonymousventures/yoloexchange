bitcoin = require('bitcoin');

var client = new bitcoin.Client({
  host: 'localhost',
  port: 12341,
  user: 'AuroraCoinrpc',
  pass: 'E5cN8iXUa6vh8ncvtM9hjM2G9ScLSBhqdH58FoN74N9m'
});

client.getBalance('*', 6, function(err, balance) {
  if (err) return console.log(err);
  console.log('Balance:', balance);
});
