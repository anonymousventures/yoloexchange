
bitcoin = require('bitcoin');
var litecoin_client = new bitcoin.Client({
    host: '127.0.0.1',
    port: 12344,
    rpcuser: 'litecoinrpc',
    pass: '8FZDgUAy81XtZbERtPW37G9AUG89ShgLJQTcpuHFhCrN'
});

litecoin_client.getBlockCount(function(err, blockcount) {

console.log("wtf " + blockcount);

});