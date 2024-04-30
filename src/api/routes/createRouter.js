import express from 'express';
import { CreateController } from "../controllers/createController.js";

const createRouter = express.Router()


// http://localhost:8200/api/create/cryptocurrency
createRouter.post("/cryptocurrency", CreateController.Cryptocurrency);
// http://localhost:8200/api/create/wallet
createRouter.post("/wallet", CreateController.Wallet);
// http://localhost:8200/api/create/pool
createRouter.post("/pool", CreateController.Pool);
// http://localhost:8200/api/create/miner
createRouter.post("/miner", CreateController.Miner);
// http://localhost:8200/api/create/gpu-preset
createRouter.post("/gpu-preset", CreateController.GPUPreset);
// http://localhost:8200/api/create/flight-sheet
createRouter.post("/flight-sheet", CreateController.FlightSheet);
// http://localhost:8200/api/create/flight-sheet-with-custom-miner
createRouter.post("/flight-sheet-with-custom-miner", CreateController.FlightSheetWithCustomMiner)
// http://localhost:8200/api/create/flight-sheet-with-cpu
createRouter.post("/flight-sheet-with-cpu", CreateController.FlightSheetWithCPU)
//
createRouter.post("/flight-sheet-multiple", CreateController.FlightSheetMupltiple)
export { createRouter }

