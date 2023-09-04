import express from 'express';
import { DeleteController } from "../controllers/deleteController.js";

const deleteRouter = express.Router()

// http://localhost:8200/api/delete/cryptocurrency
deleteRouter.delete("/cryptocurrency", DeleteController.deleteCryptocurrency);
// http://localhost:8200/api/delete/wallet
deleteRouter.delete("/wallet", DeleteController.deleteWallet);
// http://localhost:8200/api/delete/pool
deleteRouter.delete("/pool", DeleteController.deletePool);
// http://localhost:8200/api/delete/miner
deleteRouter.delete("/miner", DeleteController.deleteMiner);
// http://localhost:8200/api/delete/gpuPreset
deleteRouter.delete("/gpuPreset", DeleteController.deleteGPUPreset);
// http://localhost:8200/api/delete/flightSheet
deleteRouter.delete("/flightSheet", DeleteController.deleteFlightSheet);

export { deleteRouter }