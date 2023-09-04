import express from 'express';
import { EditController } from "../controllers/editController.js";

const editRouter = express.Router()

// http://localhost:8200/api/edit/cryptocurrency
editRouter.post("/cryptocurrency", EditController.editCryptocurrency);
// http://localhost:8200/api/edit/wallet
editRouter.post("/wallet", EditController.editWallet);
// http://localhost:8200/api/edit/pool
editRouter.post("/pool", EditController.editPool);
// http://localhost:8200/api/edit/miner
editRouter.post("/miner", EditController.editMiner);
// http://localhost:8200/api/edit/gpuPreset
editRouter.post("/gpuPreset", EditController.editGPUPreset);
// http://localhost:8200/api/edit/flightSheet
editRouter.post("/flightSheet", EditController.editFlightSheet);

export { editRouter }