bitcoin = require('bitcoin');

var client = new bitcoin.Client({
    host: '127.0.0.1',
    port: 12341,
    user: 'dogecoinrpc',
    pass: '8FZDgUAy81XtZbERtPW37G9AUG89ShgLJQTcpuHFhCrN'
});


client.getBlockCount(function(err, address) {
	if (err) console.log(err);
	console.log(address);

});