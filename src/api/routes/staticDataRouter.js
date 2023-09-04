import express from 'express';
import { StaticDataController } from "../controllers/staticDataController.js";

const staticDataRouter = express.Router()

// http://localhost:8200/api/static-data/get-full-data
staticDataRouter.get('/get-full-data',StaticDataController.getFullData)
// http://localhost:8200/api/static-data/get-gpus-data
staticDataRouter.get('/get-gpus-data', StaticDataController.getGPUData)
// http://localhost:8200/api/static-data/get-cpu-data
staticDataRouter.get('/get-cpu-data', StaticDataController.getCPUData)
// http://localhost:8200/api/static-data/get-motherboard-data
staticDataRouter.get('/get-motherboard-data', StaticDataController.getMotherboardData)
// http://localhost:8200/api/static-data/get-harddrives-data
staticDataRouter.get('/get-harddrives-data', StaticDataController.getHarddriveData)
// http://localhost:8200/api/static-data/get-rams-data
staticDataRouter.get('/get-rams-data', StaticDataController.getRAMData)
// http://localhost:8200/api/static-data/get-miners-data
staticDataRouter.get('/get-miners-data', StaticDataController.getMinersData)


export { staticDataRouter }