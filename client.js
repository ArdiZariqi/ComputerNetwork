const UDP = require('dgram');
const readline = require('readline');

const client = UDP.createSocket('udp4');
const serverPort = 2222;  // Replace with the server's port
const serverAddress = '10.11.68.207';  // Replace with the server's IP address

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
function readFromFile() {
    rl.question('Enter the file name to read: ', (fileName) => {
        sendRequest('READ', fileName);
    });
}

function writeToFile() {
    rl.question('Enter the file name and content to write (e.g., filename;content): ', (fileData) => {
        if (fileData.trim() === "") {
            console.error('Invalid input. Please provide file name and content.');
            handleUserOptions();
            return;
        }
        sendRequest('WRITE', fileData);
    });
}

function sendMessage() {
    rl.question('Enter a message to send to the server: ', (userInput) => {
        sendRequest('MESSAGE', userInput);
    });
}

function executeCommand() {
    rl.question('Enter a command to execute on the server: ', (command) => {
        sendRequest('EXECUTE', command);
    });
}

function waitForResponse() {
    client.on('message', (message) => {
        console.log('Response from server: ', message.toString());
        handleUserOptions();
    });
}

// Call waitForResponse to start listening for server responses
waitForResponse();

// Start the initial user interaction
handleUserOptions();