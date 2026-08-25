import WebSocket, { WebSocketServer } from 'ws';
import { messageHandler } from './messageHandler.js';
import { messageType } from './messageType.js';
import { leaveRoom } from './roomConnection.js';

export function initialiseWebSocketServer(server) {
    const wss = new WebSocketServer({ server });

    wss.on('connection', function connection(socket) {
        socket.on('error', function error(err) {
            console.log('Error during websocket server connection: ', err);
        });

        console.log('WebSocket server connected successfully!');

        socket.on('message', async function message(data) {
            try {
                const parsedData = JSON.parse(data);
                console.log('BACKEND RECEIVED THIS: ', parsedData)
                await messageHandler(socket, parsedData);
            } catch (err) {
                console.error('Failed to parse or handle WS message:', err);
                try {
                    socket.send(JSON.stringify({
                        type: 'ERROR',
                        payload: 'Invalid message format'
                    }));
                } catch (e) {
                    // ignore send errors
                }
            }
        });

       socket.on('close', function close() {
            console.log(`WebSocket closed: userId=${socket.userId}, roomCode=${socket.roomCode}`);

            if (socket.roomCode) {
                leaveRoom(socket); // just removes this one socket from the room's Set, nothing else
            }
        });
    });
}