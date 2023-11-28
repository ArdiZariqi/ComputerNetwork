const UDP = require('dgram');
const readline = require('readline');

const client = UDP.createSocket('udp4');
const serverPort = 2222;  // Replace with the server's port
const serverAddress = '192.168.1.18';  // Replace with the server's IP address

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function sendRequest(command, data) {
    const request = Buffer.from(`${command} ${data}`);
    client.send(request, serverPort, serverAddress, (err) => {
        if (err) {
            console.error(`Failed to send ${command} request!`, err);
        } else {
            console.log(`${command} request sent!`);
        }
    });
}

function handleUserOptions() {
    rl.question('Choose an option:\n1. Read from file\n2. Write to file\n3. Send a message\n4. Execute file\nAny other number to exit\n', (choice) => {
        const option = parseInt(choice, 10);
        if (option === 1) {
            readFromFile();
        } else if (option === 2) {
            writeToFile();
        } else if (option === 3) {
            sendMessage();
        } else if (option === 4) {
            executeCommand();
        } else {
            rl.close();
            process.exit();
        }
    });
}