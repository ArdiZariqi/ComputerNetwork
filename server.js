const UDP = require('dgram');
const fs = require('fs');
// Server dëgjon në adresën IP "0.0.0.0" dhe portin 2222.
const server = UDP.createSocket('udp4');
const serverPort = 2222;
const serverAddress = '0.0.0.0';
// Përcakton një adresë IP të cilës i jepet akses i plotë.

const allowedFullAccessClient = { clientIpAddress: '10.11.65.19' };

server.on('listening', function () {
    var address = server.address();
    console.log(`Listening to:  ${address.address}:${address.port}`);
});

server.on('message', (message, remote) => {
    const request = message.toString().trim().split(' ');
    const command = request[0].toUpperCase();

    handleClientConnect(remote);

    console.log(`Client ${remote.address} is trying to ${command}`);

    if (remote.address == allowedFullAccessClient.clientIpAddress) {
        handleFullAccessCommand(command, request.slice(1).join(' '), remote);
    } else {
        handleLimitedAccessCommand(command, request.slice(1).join(' '), remote);
    }
});

function handleFullAccessCommand(command, args, remote) {
    switch (command) {
        case 'READ':
            handleReadFile(args, remote);
            break;
        case 'WRITE':
            handleWriteFile(args, remote);
            break;
        case 'EXECUTE':
            handleExecuteCommand(args, remote);
            break;
        case 'MESSAGE':
            handleMessage(args, remote);
            break;
        default:
            console.log('Invalid command from client');
    }
}

function handleLimitedAccessCommand(command, args, remote) {
    switch (command) {
        case 'READ':
            handleReadFile(args, remote);
            break;
        case 'MESSAGE':
            handleMessage(args, remote);
            break;
        default:
            const response = Buffer.from(`You don't have permissions to ${command}`);
            server.send(response, 0, response.length, remote.port, remote.address);
            console.log(`Unauthorized access attempt from ${remote.address}:${remote.port}`);
            break;
    }
}

server.bind(serverPort, serverAddress);

process.on('SIGINT', () => {
    console.log('Server is terminating...');
    server.close(() => {
        console.log('Server terminated.');
        process.exit();
    });
});

const connectedClients = [];

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
        console.log(errorMessage);
        server.send(errorMessage, 0, errorMessage.length, remote.port, remote.address);
        return;
    }

    fs.readFile(fileName, 'utf-8', (err, data) => {
        if (err) {
            console.error(`Error reading file: ${err.message} `);
            const errorMessage = Buffer.from(`Error reading file: ${err.message} `)
            server.send(errorMessage, 0, errorMessage.length, remote.port, remote.address)
        } else {
            const successReadMessage = `Client ${remote.address} has successfully read the contents of the file`;
            console.log(successReadMessage);
            const fileContent = Buffer.from(data);
            server.send(fileContent, 0, fileContent.length, remote.port, remote.address)
        }
    });
}

function handleWriteFile(fileData, remote) {
    const [fileName, content] = fileData.split(';');

    fs.appendFile(fileName, content, 'utf8', (err) => {
        if (err) {
            const errorMessage = Buffer.from(`Error appending to file ${fileName}`);
            console.error(errorMessage);
            server.send(errorMessage, 0, errorMessage.length, remote.port, remote.address);
        } else {
            const successMessage = `Content appended to file ${fileName} successfully!`;
            console.log(successMessage);
            server.send(successMessage, 0, successMessage.length, remote.port, remote.address);
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
