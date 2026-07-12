import {messageType} from '../WebSocket/messageType.js'

async function messageHandler(ws, data){
    switch(data.type){
        case messageType.JOIN_ROOM : {

        }
    }
}

export {messageHandler}