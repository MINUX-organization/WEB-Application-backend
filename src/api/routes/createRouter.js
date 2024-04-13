import express from 'express';
import { CreateController } from "../controllers/createController.js";

const createRouter = express.Router()


// http://localhost:8200/api/create/cryptocurrency
createRouter.post("/cryptocurrency", CreateController.createCryptocurrency);
// http://localhost:8200/api/create/wallet
createRouter.post("/wallet", CreateController.createWallet);
// http://localhost:8200/api/create/pool
createRouter.post("/pool", CreateController.createPool);
// http://localhost:8200/api/create/miner
createRouter.post("/miner", CreateController.createMiner);
// http://localhost:8200/api/create/gpu-preset
createRouter.post("/gpu-preset", CreateController.createGPUPreset);
// http://localhost:8200/api/create/flight-sheet
createRouter.post("/flight-sheet", CreateController.createFlightSheet);
// http://localhost:8200/api/create/flight-sheet-with-custom-miner
createRouter.post("/flight-sheet-with-custom-miner", CreateController.createFlightSheetWithCustomMiner)
export { createRouter }

