import express from 'express'
import http from 'http' 

const startClient2 = () => {
    const app = express()
    const server = http.createServer(app)
    server.listen(3003, () => console.log(`Lisening on port :3003`))
}

export {startClient2}