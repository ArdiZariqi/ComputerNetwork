# UDP Client-Server Communication

## Overview

This project demonstrates a simple UDP client-server communication system. The server listens on IP "0.0.0.0" and port 2222, handling various commands from clients, including reading from files, writing to files, executing commands, and sending messages. The server grants full access to a specific client with IP address '10.11.65.19' and restricts access for other clients to specific commands.

The project was developed as part of the "Computer Networks" course, exploring fundamental concepts in networking.

## Contributors

* Anjeza Gashi
* Anjeza Sfishta
* Arbnore Qorraj
* Ardi Zariqi

## Technologies Used

- Node.js
- dgram (UDP module in Node.js)
- fs (File System module in Node.js)

## Usage

1. Start the server:

    node server.js

2. In a separate terminal, run the client:

    node client.js

3. Follow the prompts to choose different options (read from file, write to file, send a message, execute a command).

## Features

- Read from files
- Write to files
- Execute commands
- Send messages