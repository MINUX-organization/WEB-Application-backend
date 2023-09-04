import express from 'express'
import http from 'http' 

const startClient1 = () => {
    const app = express()
    const server = http.createServer(app)
    server.listen(3001, () => console.log(`Lisening on port :3001`))
}

export {startClient1}