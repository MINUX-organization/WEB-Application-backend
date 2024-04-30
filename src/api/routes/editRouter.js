import express from 'express';
import { EditController } from "../controllers/editController.js";

const editRouter = express.Router()

// http://localhost:8200/api/edit/cryptocurrency
editRouter.post("/cryptocurrency", EditController.Cryptocurrency);
// http://localhost:8200/api/edit/wallet
editRouter.post("/wallet", EditController.Wallet);
// http://localhost:8200/api/edit/pool
editRouter.post("/pool", EditController.Pool);
// http://localhost:8200/api/edit/miner
editRouter.post("/miner", EditController.Miner);
// http://localhost:8200/api/edit/gpu-preset
editRouter.post("/gpu-preset", EditController.GPUPreset);
// http://localhost:8200/api/edit/gpu-setup
editRouter.post("/gpu-setup", EditController.GPUSetup);
// http://localhost:8200/api/edit/flight-sheet
editRouter.post("/flight-sheet", EditController.FlightSheet);
// http://localhost:8200/api/edit/flight-sheet-with-custom-miner
editRouter.post("/flight-sheet-with-custom-miner", EditController.FlightSheetWithCustomMiner);
// http://localhost:8200/api/edit/flight-sheet-with-cpu
editRouter.post("/flight-sheet-with-cpu", EditController.FlightSheetWithCpu);
//
editRouter.post("/flight-sheet-multiple", EditController.FlightSheetMultiple)
export { editRouter }