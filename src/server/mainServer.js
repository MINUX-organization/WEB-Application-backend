// Libs
import cors from 'cors'
import express from 'express'
import session from 'express-session'
import SequelizeConnectSession from 'connect-session-sequelize'
// Services
import { WebSocketServer } from './webSocketServer.js'
import { Router } from '../api/routes/index.js'
import { mainDatabase } from '../database/mainDatabase.js'
// Utils
import { loggerConsole } from '../utils/logger.js'
// Middleware
import { errorHandler } from "../api/middleware/ErrorHandlingMiddleware.js"
import { requestLoggerMiddleware } from '../api/middleware/loggerMIddleware.js'

class  MainServer {
    constructor(PORT) {
        // const
        this.port = PORT
        const server = express()
        // Export libs
        server.use(cors())
        server.use(express.json())
        server.use(express.urlencoded({ extended: true }))
        // Session 
        // const SequelizeStore = SequelizeConnectSession(session)
        // server.use(session({
        //     secret: 'secret',
        //     resave: false,
        //     saveUninitialized: false,
        //     store: new SequelizeStore({
        //         db: mainDatabase.db
        //     })
        // }))
        // Export middleware & routes
        server.use(requestLoggerMiddleware)
        server.use('/api', Router)
        server.use(errorHandler)
        try {
            // Start server
            this.httpServer = server.listen(this.port, () => {
                loggerConsole.basicInfo(`MainServer started on http://localhost:${this.port}`)
            })
        } catch (error) {
            loggerConsole.error(`Error starting server: ${error}`)
            return error;
        }
    }
    startWebsocketServer() {
        // Start websocket server
        this.mainWebSocketServer = new WebSocketServer(this.port, this.httpServer)
        // Start receiving
        this.mainWebSocketServer.startReceivingMessages()
        this.mainWebSocketServer.startReceivingCommands()
        this.mainWebSocketServer.startReceivingCloseSignal() 
    }
    shutdownServer() {
        // Safe shutdown
        loggerConsole.basicInfo('Shutting down server...')
        this.httpServer.close(() => {
            loggerConsole.basicInfo('Server is shutdown!')
            process.exit(0);
        })
        // Forcefully shutdown
        setTimeout(() => {
            loggerConsole.error(`Could't close connection in time, forcefully shutting down!`)
            process.exit(1)
        }, 10000)
    }
}

export { MainServer }