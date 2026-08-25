import WebSocket from 'ws';

const roomConnections = new Map();

function joinRoom(roomCode, socket){
    if(!roomConnections.has(roomCode)){
        roomConnections.set(roomCode, new Set());
    }
    roomConnections.get(roomCode).add(socket);
    socket.roomCode = roomCode;
}


function leaveRoom(socket){
    const roomCode = socket.roomCode;
    if(!roomCode || !roomConnections.has(roomCode)){
        return;
    }
    const clients = roomConnections.get(roomCode);
    clients.delete(socket);
    if(clients.size === 0){
        roomConnections.delete(roomCode);
    }
}



function getRoomClients(roomCode){
    return roomConnections.get(roomCode) ?? new Set();
}



function closeRoom(roomCode){
    roomConnections.delete(roomCode);
}


function broadCastToRoom(roomCode, payload){
    if(!roomConnections.has(roomCode)){
        return;
    }
    const message = JSON.stringify(payload);
    const clients = roomConnections.get(roomCode);
    clients.forEach(client => {
        if(client.readyState === WebSocket.OPEN){
            try {
                client.send(message);
            } catch(err) {
                console.error('Failed to send message to client:', err);
            }
        }
    });
}

export { joinRoom, leaveRoom, closeRoom, getRoomClients, broadCastToRoom };