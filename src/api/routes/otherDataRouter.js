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
otherDataRouter.get("/get-gpu-setup", OtherDataController.getGPUSetup);
// http://localhost:8200/api/other_data/get-gpu-presets
otherDataRouter.get("/get-gpu-presets", OtherDataController.getGPUPresets);
// http://localhost:8200/api/other_data/get-cpu-setup
otherDataRouter.get("/get-cpu-setup", OtherDataController.getCPUSetup);

export { otherDataRouter }