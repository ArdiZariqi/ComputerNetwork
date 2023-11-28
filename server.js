const UDP = require('dgram');
const fs = require('fs');

const server = UDP.createSocket('udp4');
const serverPort = 2222;
const serverAddress = '0.0.0.0';

const allowedFullAccessClient = { clientIpAddress: '192.168.0.109' };

const connectedClients = [];

server.on('listening', function () {
    var address = server.address();
    console.log(`Serveri udp eshte aktiv ne adresen:  ${address.address}:${address.port}`);
});

server.on('message', (message, remote) => {
    const request = message.toString().trim().split(' ');
    const command = request[0].toUpperCase();

    handleClientConnect(remote);

    // Check if the client is allowed for full access
    if (remote.address == allowedFullAccessClient.clientIpAddress) {
        switch (command) {
            case 'READ':
                handleReadFile(request.slice(1).join(' '), remote);
                break;
            case 'WRITE':
                handleWriteFile(request.slice(1).join(' '), remote);
                break;
            case 'EXECUTE':
                handleExecuteCommand(request.slice(1).join(' '), remote);
                break;
            case 'MESSAGE':
                handleMessage(request.slice(1).join(' '), remote);
                break;
            default:
                console.log('Invalid command from client');
        }
    } else {
        if (command === 'READ') {
            handleReadFile(request.slice(1).join(' '), remote);
        } else {
            const response = Buffer.from(`You don't have permissions to ${command}`);
            server.send(response, 0, response.length, remote.port, remote.address);
            console.log(`Unauthorized access attempt from ${remote.address}:${remote.port}`);
        }

    }
});

server.bind(serverPort, serverAddress);

process.on('SIGINT', () => {
    console.log('Server is terminating...');
    server.close(() => {
        console.log('Server terminated.');
        process.exit();
    });
});

function handleClientConnect(remote) {
    const existingClient = connectedClients.find(
        (client) => client.address === remote.address && client.port === remote.port
    );

    if (!existingClient) {
        connectedClients.push({ address: remote.address, port: remote.port });
        console.log(`Client connected: ${remote.address}:${remote.port} `);
    }
}
