const UDP = require('dgram');
const readline = require('readline');

const client = UDP.createSocket('udp4');
const serverPort = 2222;
const serverAddress = '10.11.68.207'; // Replace with the server's IP address

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function sendRequest(command, data) {
    const message = `${command} ${data}`;
    const request = Buffer.from(message);

    client.send(request, serverPort, serverAddress, (err) => {
        if (err) {
            console.error(`Failed to send ${command} request!`, err);
        } else {
            console.log(`${command} request sent: ${message}`);
        }
    });
}

function handleServerResponse() {
    client.on('message', (message) => {
        console.log('Response from server:', message.toString());
    });
}

function handleUserOptions() {
    rl.question('Choose an option:\n1. Read from file\n2. Write to file\n3. Send a message\n4. Execute file\nAny other key to exit\n', (choice) => {
        const option = parseInt(choice, 10);
        
        switch (option) {
            case 1:
                handleUserInput('READ', 'Enter the file name to read: ');
                break;
            case 2:
                handleUserInput('WRITE', 'Enter the file name and content to write (e.g., filename;content): ', validateFileData);
                break;
            case 3:
                handleUserInput('MESSAGE', 'Enter a message to send to the server: ');
                break;
            case 4:
                handleUserInput('EXECUTE', 'Enter a command to execute on the server: ');
                break;
            default:
                client.close();
                rl.close();
        }
    });
}

function handleUserInput(command, question, validator) {
    rl.question(question, (userInput) => {
        if (validator && !validator(userInput)) {
            console.error('Invalid input. Please try again.');
            handleUserInput(command, question, validator);
        } else {
            sendRequest(command, userInput);
        }
    });
}

function validateFileData(fileData) {
    const parts = fileData.split(';');
    return parts.length === 2 && !parts.some(part => part.trim() === "");
}

handleServerResponse();

handleUserOptions();