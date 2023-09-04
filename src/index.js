// Libs
import { MainServer } from "./server/mainServer.js"
import { mainDatabase } from "./database/mainDatabase.js"
// dotenv
import dotenv from 'dotenv'
dotenv.config()

const compile =  (async () => {
    console.clear()
    // Start database
    await mainDatabase.start()
    // Start http server
    const mainServer = new MainServer(process.env.PORT)
    // Start websocket server
    mainServer.startWebsocketServer()
})()