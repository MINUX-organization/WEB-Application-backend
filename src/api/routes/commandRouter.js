import express from 'express';
import { CommandController } from "../controllers/commandController.js";

const commandsRouter = express.Router()

// http://localhost:8200/api/commands/get-static-info
commandsRouter.get('/get-static-info', CommandController.getStaticInfo)
// http://localhost:8200/api/commands/get-gpus-settings
commandsRouter.get('/get-gpus-settings', CommandController.getGpusSettings)
// http://localhost:8200/api/commands/get-gpus-working
commandsRouter.get('/get-gpus-working', CommandController.getGpusWorking)
// http://localhost:8200/api/commands/set-gpus-settings
commandsRouter.post("/set-gpus-settings", CommandController.setGpusSettings)
// http://localhost:8200/api/commands/start-mining
commandsRouter.post("/start-mining", CommandController.startMining)
// http://localhost:8200/api/commands/reboot
commandsRouter.post("/reboot", CommandController.reboot)

export { commandsRouter } 