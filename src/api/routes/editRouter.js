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
// http://localhost:8200/api/edit/gpu-preset
editRouter.post("/gpu-preset", EditController.editGPUPreset);
// http://localhost:8200/api/edit/gpu-setup
editRouter.post("/gpu-setup", EditController.editGPUSetup);
// http://localhost:8200/api/edit/flight-sheet
editRouter.post("/flight-sheet", EditController.editFlightSheet);
// http://localhost:8200/api/edit/flight-sheet-with-custom-miner
editRouter.post("/flight-sheet-with-custom-miner", EditController.editFlightSheetWithCustomMiner);

export { editRouter }