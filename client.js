const prompt = require("prompt-sync")({ sigint: true });
var PORT = 33333;
const clientIP = prompt("Sheno IP Addresen tuaj: ");
var client = clientIP;
const ipAddress = prompt("Sheno IP Addresen me te cilen doni te lidheni : ");
var HOST = ipAddress;
const fs = require('fs');
var path = 'example.txt';
errorcode = "NUK KENI QASJE!"


var dgram = require('dgram');


if (client == '172.16.4.22') {
    console.log("\nKeni qasje ne lexim the mbishkrim te file");
    fs.chmod("example.txt", 0o600, () => {

        console.log("\nPermbajtja e file");
        console.log(fs.readFileSync("example.txt", 'utf8'));
        const ndryshimi = prompt("Ndryshoni file si read and write: ");

        console.log("Ndryshimi i bere: ");
        fs.appendFileSync('example.txt', ndryshimi);
        console.log(fs.readFileSync("example.txt", 'utf8'));

    });
}