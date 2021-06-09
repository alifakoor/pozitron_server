import { io } from 'socket.io-client'

const NETWORK = 'localhost'
const PORT = 8081
const URL = `http://${NETWORK}:${PORT}`
const OPTIONS = {}

export default class socketService {
    constructor () {
        this.socket = io(URL, OPTIONS)
    }

    addEventListener (event) {
        this.socket.on(event.type, event.callback)
    }

    sendEvent (event, callback) {
        this.socket.emit(event.type, event.data, callback)
    }

    disconnect () {
        this.socket.on('disconnect', () => {
            console.log(`You Disconnected from socket: ${this.socket.id}`)
        })
    }
}
