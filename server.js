var PORT = 33333;
var HOST = '0.0.0.0';
const fs = require('fs');
var path = 'example.txt';
errorcode = "Nuk keni qasje!"

const { info } = require('console');
var dgram = require('dgram');
var server = dgram.createSocket('udp4');

server.on('listening', function () {
    var address = server.address();
    console.log(`Serveri udp eshte aktiv ne adresen: ${address.address}:${address.port}`);
});