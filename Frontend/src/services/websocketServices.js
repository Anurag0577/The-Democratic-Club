
class websocketService {
    constructor(){
        this.socket = null;
        this.messageHandlers = {};
        this.isConnected = false;
    }

    connect(roomId, userId){

        if(this.socket){
            this.socket.close()
        }


        const wsUrl = `ws://localhost:5173/ws?roomId=${roomId}&userId=${userId}`
        this.socket = new WebSocket(wsUrl)

        this.socket.onopen = () => {
            console.log('Websocket connected.');
            this.isConnected = true
        }

        this.socket.onclose = () => {
            console.log('Websocket disconnected!');
            this.isConnected = false;
        }

        this.socket.error = (error) => {
            console.log(`Websocket disconnected! Error: ${error}`);
            this.isConnected = false;
        }


        this.socket.onmessage = (res) => {

            try {
                const data = JSON.parse(res.data);
                this.handleMessage(data)
                console.log(`This is the data I received from backend: Type: ${data.type}, payload: ${data.data}`)
            } catch (error) {
                console.error(`Error I am getting: ${error}`)
            }
        }
    }

    handleMessage(data){
        const {type, payload} = data;
        if(this.messageHandlers[type]){
            this.messageHandlers[type](payload)
        }
    }

    sendMessage(type, payload){
        if(this.socket || this.socket.readyState !== WebSocket.OPEN){
            console.log('Websocket not connected! Message not sent.', type)
            return false;
        }

        const message = JSON.stringify(payload);
        this.socket.sendMessage(message)
        console.log(`Send this message: ${message} `)
        return true
    }

    onMessage(type, handler) {
        this.messageHandlers[type] = handler;
        console.log("Registered handler for", type)
    }

    offMessage(type) {
        delete this.messageHandlers[type]
        console.log("Unregisterd handler for", type)
    }

    disconnected(){
        this.socket.close();
        this.socket = null;
        this.isConnected = false;
    }
}

export {websocketService};