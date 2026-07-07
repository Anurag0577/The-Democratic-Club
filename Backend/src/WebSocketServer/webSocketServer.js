import WebSocket, {WebSocketServer} from 'ws';

export function initialiseWebSocketServer(server){
    const wss = new WebSocketServer({server})

    wss.on('connection', function connection(socket){
        socket.on('error', function error(err){
            console.log('Error during websocket server connection: ', err)
        })

        console.log('WebSocket server connected successfully!')

        socket.on('message', function message(data){

            const textMessage = JSON.stringify(data)

            if(socket.readyState === WebSocket.OPEN){
                wss.clients.forEach(client => {
                    client.send(textMessage)
                })
            }
        })
    })
}