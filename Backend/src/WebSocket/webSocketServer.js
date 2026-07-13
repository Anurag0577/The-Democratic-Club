import WebSocket, {WebSocketServer} from 'ws';
import { messageHandler } from './messageHandler.js';

export function initialiseWebSocketServer(server){
    const wss = new WebSocketServer({server})

    wss.on('connection', function connection(socket){
        socket.on('error', function error(err){
            console.log('Error during websocket server connection: ', err)
        })

        console.log('WebSocket server connected successfully!')

        socket.on('message', async function message(data){
            try {
                const textMessage = JSON.parse(data);
                await messageHandler(socket, textMessage);
            } catch(err) {
                console.error('Failed to parse or handle WS message:', err);
                try {
                    socket.send(JSON.stringify({
                        type: 'ERROR',
                        payload: 'Invalid message format'
                    }));
                } catch(e) {
                    // ignore send errors
                }
            }
        })
    })
}