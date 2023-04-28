const express = require('express');
const WebSocket = require('ws');
const path = require('path');

const app = express();
const server = require('http').createServer(app);
const wss = new WebSocket.Server({ server });

let connections = 0;

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// In-memory data store
const tasks = [];

wss.on('connection', (ws) => {
    console.log('Client connected');

    // Send the initial tasks list
    ws.send(JSON.stringify({ type: 'init', payload: tasks }));

    ws.on('message', (message) => {
        const data = JSON.parse(message);
        switch (data.type) {
            case 'request_init':
            ws.send(JSON.stringify({ type: 'init', payload: tasks }));
            break;
            case 'add':
                tasks.push(data.payload);
                // Broadcast the new task
                broadcastMessage({ type: 'add', payload: data.payload });
                break;
            case 'remove':
                const index = tasks.findIndex((task) => task.id === data.payload.id);
                if (index !== -1) {
                    tasks.splice(index, 1);
                }
                broadcastMessage({ type: 'update', payload: tasks });
                break;
            case 'toggle':
                const task = tasks.find((task) => task.id === data.payload.id);
                if (task) {
                    task.done = !task.done;
                }
                broadcastMessage({ type: 'update', payload: tasks });
                break;
            default:
                break;
        }

        // Broadcast the updated tasks list
        wss.clients.forEach((client) => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(JSON.stringify({ type: 'update', payload: tasks }));
            }
        });
    });

    ws.on('close', () => {
        console.log('Client disconnected');
    });

});

// Start the server
const PORT = process.env.PORT || 3000;
const HOST = '0.0.0.0'; // Listen on all network interfaces
server.listen(PORT, HOST, () => {
    console.log(`Server listening on http://${HOST}:${PORT}`);
});



function broadcastMessage(message) {
    wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify(message));
        }
    });
}
