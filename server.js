const UDP = require('dgram');
const fs = require('fs');

const server = UDP.createSocket('udp4');
const serverPort = 2222;
const serverAddress = '0.0.0.0';

const allowedFullAccessClient = { clientIpAddress: '10.11.65.19' };

const connectedClients = [];

server.on('listening', function () {
    var address = server.address();
    console.log(`Serveri udp eshte aktiv ne adresen:  ${address.address}:${address.port}`);
});

server.on('message', (message, remote) => {
    const request = message.toString().trim().split(' ');
    const command = request[0].toUpperCase();

    handleClientConnect(remote);

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
        switch (command) {
            case 'READ':
                handleReadFile(request.slice(1).join(' '), remote);
                break;
            case 'MESSAGE':
                handleMessage(request.slice(1).join(' '), remote);
                break;
            default:
                const response = Buffer.from(`You don't have permissions to ${command}`);
                server.send(response, 0, response.length, remote.port, remote.address);
                console.log(`Unauthorized access attempt from ${remote.address}:${remote.port}`);
                break;
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
function handleReadFile(fileName, remote) {
    if (!fs.existsSync(fileName)) {
        const errorMessage = Buffer.from(`File ${fileName} does not exist`);
        server.send(errorMessage, 0, errorMessage.length, remote.port, remote.address);
        return;
    }

    fs.readFile(fileName, 'utf-8', (err, data) => {
        if (err) {
            console.error(`Error reading file: ${err.message} `);
            const errorMessage = Buffer.from(`Error reading file: ${err.message} `)
            server.send(errorMessage, 0, errorMessage.length, remote.port, remote.address)
        } else {
            const fileContent = Buffer.from(data);
            server.send(fileContent, 0, fileContent.length, remote.port, remote.address)
        }
    });
}

function handleWriteFile(fileData, remote) {
    const [fileName, content] = fileData.split(';');
    fs.writeFile(fileName, content, 'utf8', (err) => {
        if (err) {
            const errorMessage = Buffer.from(`Error writing to file ${fileName} `);
            console.error(errorMessage);
            server.send(errorMessage, 0, errorMessage.length, remote.port, remote.address);
        } else {
            const successMessage = `File ${fileName} written successfully!`;
            console.log(successMessage);
            server.send(successMessage, 0, successMessage.length, remote.port, remote.address)
        }
    });
}

function handleMessage(message, remote) {
    console.log(`Received message from client ${remote.address}:${remote.port}: ${message} `);
    const response = Buffer.from(`Server received your message: ${message} `);
    server.send(response, 0, response.length, remote.port, remote.address);
}

function handleExecuteCommand(command, remote) {
    console.log(`Executing command from ${remote.address}:${remote.port}: ${command} `);
    const exec = require('child_process').exec;
    exec(command, (error, stdout, stderr) => {
        if (error) {
            console.error(`Error executing command: ${error.message} `);
            const errorMessage = Buffer.from(`Error executing command: ${error.message} `);
            server.send(errorMessage, 0, errorMessage.length, remote.port, remote.address);
        } else {
            console.log(`Command executed successfully: \n${stdout} `);
            const successMessage = Buffer.from(`Command executed successfully: \n${stdout} `);
            server.send(successMessage, 0, successMessage.length, remote.port, remote.address);
        }
    });
}
