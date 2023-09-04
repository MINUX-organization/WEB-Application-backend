import { generateRequestID } from "../utils/generatorRequestID.js"

class commandInterface {
    constructor(type, payload, command) {
        this.type = type
        this.requestId = generateRequestID()
        this.responseId = null
        this.command = `${command}`
        this.payload = payload
    }
}


export { commandInterface }

