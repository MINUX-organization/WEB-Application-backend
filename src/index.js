// Services
import { HttpServer } from "./server/httpServer.js"
import { mainDatabase } from "./database/mainDatabase.js"
import { WebSocketServer } from "./server/webSocketServer.js"
// Dotenv
import dotenv from 'dotenv'
dotenv.config()

class MainServer {
    async start() {
        mainDatabase.start()
        .then(() => {
            this.startedHttpServer = new HttpServer(process.env.PORT)
            this.startedWebSocketServer = new WebSocketServer(process.env.PORT, this.startedHttpServer.httpServer)
        })
    }
}

const mainServer = new MainServer()
mainServer.start()

