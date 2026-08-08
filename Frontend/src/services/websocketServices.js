
class WebSocketService {
    constructor() {
        this.socket = null;
        this.messageHandlers = {};
        this.isConnected = false;
    }

    connect(roomId, userId, onOpenCallback) {
        if (this.socket) {
            this.socket.close();
        }

        const wsUrl = `ws://localhost:3000/ws?roomId=${roomId}&userId=${userId}`;
        this.socket = new WebSocket(wsUrl);

        this.socket.onopen = () => {
            console.log('Websocket connected.');
            this.isConnected = true;
            
            // Execute callback ONLY after the socket opens
            if (onOpenCallback) {
                onOpenCallback();
            }
        };

        this.socket.onclose = () => {
            console.log('Websocket disconnected!');
            this.isConnected = false;
        };

        this.socket.onerror = (error) => {
            console.log('Websocket connection error:', error);
            this.isConnected = false;
        };

        this.socket.onmessage = (res) => {
            try {
                const data = JSON.parse(res.data);
                console.log( "Websocket (backend -> frontend):", "Type:", data.type, "Payload:", data.payload );
                this.handleMessage(data);
            } catch (error) {
                console.error('Error I am getting:', error);
            }
        };
    }

    handleMessage(data) {
        const { type, payload } = data;
        if (this.messageHandlers[type]) {
            this.messageHandlers[type](payload);
        }
    }

    sendMessage(type, payload) {
        if (!this.socket || this.socket.readyState !== WebSocket.OPEN) {
            console.log('Websocket not connected! Message not sent.', type);
            return false;
        }

        const message = JSON.stringify({ type, payload });
        console.log("FRONTEND SENDING THIS: ", message);
        this.socket.send(message);
        return true;
    }

    onMessage(type, handler) {
        this.messageHandlers[type] = handler;
        console.log('Registered handler for', type);
    }

    offMessage(type) {
        delete this.messageHandlers[type];
        console.log('Unregisterd handler for', type);
    }

    disconnect() {
        if (this.socket) {
            this.socket.close();
        }

        this.socket = null;
        this.isConnected = false;
    }

    disconnected() {
        this.disconnect();
    }
}

const websocketService = new WebSocketService();

export { websocketService };