import express from 'express';
import { DeleteController } from "../controllers/deleteController.js";

const deleteRouter = express.Router()

// http://localhost:8200/api/delete/cryptocurrency
deleteRouter.delete("/cryptocurrency", DeleteController.Cryptocurrency);
// http://localhost:8200/api/delete/wallet
deleteRouter.delete("/wallet", DeleteController.Wallet);
// http://localhost:8200/api/delete/pool
deleteRouter.delete("/pool", DeleteController.Pool);
// http://localhost:8200/api/delete/miner
deleteRouter.delete("/miner", DeleteController.Miner);
// http://localhost:8200/api/delete/gpu-preset
deleteRouter.delete("/gpu-preset", DeleteController.GPUPreset);
// http://localhost:8200/api/delete/flight-sheet
deleteRouter.delete("/flight-sheet", DeleteController.FlightSheet);
//  http://localhost:8200/api/delete/flight-sheet-with-custom-miner
deleteRouter.delete("/flight-sheet-with-custom-miner", DeleteController.FlightSheetWithCustomMiner);
// http://localhost:8200/api/delete/flight-sheet-with-cpu
deleteRouter.delete("/flight-sheet-with-cpu", DeleteController.FlightSheetWithCPU);
//
deleteRouter.delete("/flight-sheet-multiple", DeleteController.FlightSheetMultiple);
export { deleteRouter }