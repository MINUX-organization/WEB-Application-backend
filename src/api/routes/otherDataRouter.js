import express from 'express';
import { OtherDataController } from "../controllers/otherDataController.js";

const otherDataRouter = express.Router();

// http://localhost:8200/api/other_data/get-full-miners
otherDataRouter.get("/get-full-miners", OtherDataController.getFullMiners);
// http://localhost:8200/api/other_data/get-full-algorithms
otherDataRouter.get("/get-full-algorithms", OtherDataController.getFullAlgorithms);
// http://localhost:8200/api/other_data/get-full-cryptocurrencies
otherDataRouter.get("/get-full-cryptocurrencies", OtherDataController.getFullCryptocurrencies);
// http://localhost:8200/api/other_data/get-full-wallets
otherDataRouter.get("/get-full-wallets", OtherDataController.getFullWallets);
// http://localhost:8200/api/other_data/get-full-pools
otherDataRouter.get("/get-full-pools", OtherDataController.getFullPools);
// http://localhost:8200/api/other_data/get-full-flight-sheets
otherDataRouter.get("/get-full-flight-sheets", OtherDataController.getFullFlightSheets);
// http://localhost:8200/api/other_data/get-gpu-setup
otherDataRouter.post("/get-gpu-setup", OtherDataController.getGPUSetup);
// http://localhost:8200/api/other_data/get-gpu-presets
otherDataRouter.get("/get-gpu-presets", OtherDataController.getGPUPresets);
// http://localhost:8200/api/other_data/get-cpu-setup
otherDataRouter.get("/get-cpu-setup", OtherDataController.getCPUSetup);
// http://localhost:8200/api/other_data/get-create-flight-sheet-options
otherDataRouter.get("/get-create-flight-sheet-options", OtherDataController.getCreateFlightSheetOptions)
// http://localhost:8200/api/other_data/get-full-filled-flight-sheets
otherDataRouter.get("/get-full-filled-flight-sheets", OtherDataController.getFullFilledFlightSheets)
// 
otherDataRouter.get("/get-full-filled-wallets", OtherDataController.getFullFilledWallets)
//
otherDataRouter.get("/get-gpus-for-flight-sheets", OtherDataController.getGpusForFlightSheets)
// 
otherDataRouter.post("/edit-gpus-for-flight-sheets", OtherDataController.editGpusForFlightSheets)
//
otherDataRouter.get("/get-settings-gpus", OtherDataController.getSettingsGpus)
export { otherDataRouter }