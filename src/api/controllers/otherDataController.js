// Libs
import _ from 'lodash';
// Validations
import {
    getCPUSetupSchema,
    getGPUPresetsSchema,
    getGPUSetupSchema,
    editGpusForFlightSheetsSchema,
    editGpusForFlightSheetsWithCustomMinerSchema,
    editGpusForFlightSheetsWithCPUSchema,
    editGpusForFlightSheetMultipleSchema
} from "../../validation/endpoints/otherData.js";
import { mainDatabase } from '../../database/mainDatabase.js'
import { ApiError } from "../../error/ApiError.js";
import { staticData } from "../../temp/static.js";
import { clientsData } from "../../temp/clients.js";
import { commandsData } from "../../temp/commands.js"
import { loggerConsole } from "../../utils/logger.js";
import { commandInterface } from "../../classes/commands.js"

class OtherDataController {
    static async waitForResponse(command) {
        return new Promise((resolve, reject) => {
            const timeout = setTimeout(() => {
                clearInterval(timeout)
                reject(ApiError.noneData("No response to the command was received"))
            }, 300000)
            const interval = setInterval(() => {
                if (commandsData[command] != null) {
                    const response = commandsData[command]
                    commandsData[command] = null
                    clearInterval(interval)
                    clearTimeout(timeout)
                    resolve(response)
                }
            }, 10)
        })
    }
    static async getFullMiners(req, res, next) { // reformated + worked
        // Getting all miners
        try {
            // Check if miners exists
            const miners = await mainDatabase.models.MINERs.findAll();
            if (miners.length == 0) {
                return res.status(200).json({ "miners": [] });
            }
            // Reformat response
            const reformatedMiners = []
            miners.forEach(miner => {
                miner = miner.dataValues
                const reformatedMiner = {
                    id: miner.id,
                    name: miner.name,
                    fullName: miner.full_name
                }
                reformatedMiners.push(reformatedMiner)
            })
            // Return
            res.status(200).json({ "miners": reformatedMiners });
        } catch (err) {
            return next(err)
        }
    }
    static async getFullAlgorithms(req, res, next) { // reformated + worked
        // Getting all algorithms
        try {
            // Check if algorithms exists
            const algorithms = await mainDatabase.models.ALGORITHMs.findAll()
            if (algorithms.length == 0) {
                return res.status(200).json({ "algorithms": [reformatedAlgorithms] })
            }
            // Reformat response
            const reformatedAlgorithms = []
            algorithms.forEach(algorithm => {
                algorithm = algorithm.dataValues
                const reformatedAlgorithm = {
                    id: algorithm.id,
                    name: algorithm.name,
                }
                reformatedAlgorithms.push(reformatedAlgorithm)
            })
            // Return
            res.status(200).json({ "algorithms": reformatedAlgorithms })
        } catch (err) {
            return next(err)
        }
    }
    static async getFullCryptocurrencies(req, res, next) { // reformated + worked
        // Getting all cryptocurrencies
        try {
            // Check if cryptocurrencies exists
            const cryptocurrencies = await mainDatabase.models.CRYPTOCURRENCIEs.findAll();
            if (cryptocurrencies.length == 0) {
                return res.status(200).json({ "cryptocurrencies": [] })
            }
            // Reformat response
            const reformatedCryptocurrencies = []
            cryptocurrencies.forEach(cryptocurrency => {
                cryptocurrency = cryptocurrency.dataValues
                const reformatedCryptocurrency = {
                    id: cryptocurrency.id,
                    name: cryptocurrency.name,
                    fullName: cryptocurrency.full_name,
                    algorithmId: cryptocurrency.algorithm_id
                }
                reformatedCryptocurrencies.push(reformatedCryptocurrency)
            })
            // Return
            res.status(200).json({ "cryptocurrencies": reformatedCryptocurrencies })
        } catch (err) {
            return next(err)
        }
    }
    static async getFullWallets(req, res, next) { // reformated + worked
        // Getting all wallets
        try {
            // Check if wallets exist
            const wallets = await mainDatabase.models.WALLETs.findAll();
            if (wallets.length == 0) {
                return res.status(200).json({ "wallets": [] });
            }
            // Reformat response
            const reformatedWallets = []
            wallets.forEach(wallet => {
                wallet = wallet.dataValues
                const reformatedWallet = {
                    id: wallet.id,
                    name: wallet.name,
                    source: wallet.source,
                    address: wallet.address,
                    cryptocurrencyId: wallet.cryptocurrency_id
                }
                reformatedWallets.push(reformatedWallet)
            })
            // Return
            res.status(200).json({ "wallets": reformatedWallets });
        } catch (err) {
            return next(err)
        }
    }
    static async getFullPools(req, res, next) { // reformated + worked
        // Getting all pools
        try {
            // Check if pools exists
            const pools = await mainDatabase.models.POOLs.findAll();
            if (pools.length == 0) {
                return res.status(200).json({ "pools": [] });
            }
            // Reformat response
            const reformatedPools = []
            pools.forEach(pool => {
                pool = pool.dataValues
                const reformatedPool = {
                    id: pool.id,
                    host: pool.host,
                    port: pool.port,
                    cryptocurrencyId: pool.cryptocurrency_id
                }
                reformatedPools.push(reformatedPool)
            })
            // Return
            res.status(200).json({ "pools": reformatedPools });
        } catch (err) {
            return next(err)
        }
    }
    static async getFullFlightSheets(req, res, next) { // reformated + worked
        // Getting all flight sheets
        try {
            // Check if flight sheets exist
            const flightSheets = await mainDatabase.models.FLIGHT_SHEETs.findAll();
            const flightSheetsWithCustomMiner = await mainDatabase.models.FLIGHT_SHEETs_WITH_CUSTOM_MINER.findAll();
            const flightSheetsWithCPU = await mainDatabase.models.FLIGHT_SHEETs_WITH_CPU.findAll();
            const flightSheetsMultiple = await mainDatabase.models.FLIGHT_SHEETs_MULTIPLE.findAll();

            if (flightSheets.length == 0 && flightSheetsWithCustomMiner.length == 0 && flightSheetsWithCPU.length == 0 && flightSheetsMultiple.length == 0) {
                return res.status(200).json({ "flightSheets": [] });
            }
            // Reformat response
            const reformatedFlightSheets = []
            flightSheets.forEach(flightSheet => {
                flightSheet = flightSheet.dataValues
                const reformatedFlightSheet = {
                    id: flightSheet.id,
                    name: flightSheet.name,
                    type: "GPU-SINGLE",
                    cryptocurrencyId: flightSheet.cryptocurrency_id,
                    minerId: flightSheet.miner_id,
                    walletId: flightSheet.wallet_id,
                    poolId: flightSheet.pool_id,
                }
                reformatedFlightSheets.push(reformatedFlightSheet)
            })

            const reformatedFlightSheetsWithCustomMiner = []
            flightSheetsWithCustomMiner.forEach(flightSheetWithCustomMiner => {
                flightSheetWithCustomMiner = flightSheetWithCustomMiner.dataValues
                const reformatedFlightSheetWithCustomMiner = {
                    id: flightSheetWithCustomMiner.id,
                    name: flightSheetWithCustomMiner.name,
                    type: "CUSTOM",
                    installationURL: flightSheetWithCustomMiner.installation_url,
                    wallet: flightSheetWithCustomMiner.wallet,
                    poolURL: flightSheetWithCustomMiner.pool,
                    coin: flightSheetWithCustomMiner.coin,
                    algorithm: flightSheetWithCustomMiner.algorithm,
                    poolTemplate: flightSheetWithCustomMiner.pool_template,
                    walletAndWorkerTemplate: flightSheetWithCustomMiner.wallet_and_worker_template,
                    password: flightSheetWithCustomMiner.password,
                    extraConfigArguments: flightSheetWithCustomMiner.extra_config_arguments
                }
                reformatedFlightSheetsWithCustomMiner.push(reformatedFlightSheetWithCustomMiner)
            })

            const reformatedFlightSheetsWithCPU = [];
            flightSheetsWithCPU.forEach(flightSheetWithCPU => {
                flightSheetWithCPU = flightSheetWithCPU.dataValues;
                const reformatedFlightSheetWithCPU = {
                    id: flightSheetWithCPU.id,
                    name: flightSheetWithCPU.name,
                    type: "CPU",
                    cryptocurrencyId: flightSheetWithCPU.cryptocurrency_id,
                    minerId: flightSheetWithCPU.miner_id,
                    walletId: flightSheetWithCPU.wallet_id,
                    poolId: flightSheetWithCPU.pool_id,
                    additionalString: flightSheetWithCPU.additional_string,
                    hugePages: flightSheetWithCPU.huge_pages,
                    configFile: flightSheetWithCPU.config_file
                };
                reformatedFlightSheetsWithCPU.push(reformatedFlightSheetWithCPU);
            });

            const reformatedFlightSheetsMultiple = [];

            for (const flightSheet of flightSheetsMultiple) {
                const configs = await mainDatabase.models.FLIGHT_SHEETs_MULTIPLE_CRYPTOCURRENCIEs.findAll({
                    where: {
                        flight_sheet_multiple_id: flightSheet.id
                    }
                });
                const reformatedConfigs = [];
                for (const config of configs) {
                    reformatedConfigs.push({
                        cryptocurrencyId: config.cryptocurrency_id,
                        walletId: config.wallet_id,
                        poolId: config.pool_id,
                    });
                }
                const reformatedFlightSheet = {
                    id: flightSheet.id,
                    name: flightSheet.name,
                    type: "GPU-MULTIPLE",
                    additionalString: flightSheet.additional_string,
                    minerId: flightSheet.miner_id,
                    configs: reformatedConfigs
                };
                reformatedFlightSheetsMultiple.push(reformatedFlightSheet);
            }
            const result = [...reformatedFlightSheets, ...reformatedFlightSheetsWithCustomMiner, ...reformatedFlightSheetsWithCPU, ...reformatedFlightSheetsMultiple]

            // Return
            res.status(200).json({ "flightSheets": result });
        } catch (err) {
            return next(err)
        }
    }
    static async getGPUSetup(req, res, next) { // reformated + worked
        // Validate request body
        const { error } = getGPUSetupSchema.validate(req.body);
        if (error) {
            return next(ApiError.badRequest(error.details[0].message));
        }
        // Get GPU setup
        try {
            // Check if GPU setup exists
            const gpuSetup = await mainDatabase.models.GPU_SETUPs.findOne({ where: { id: req.body.gpuSetupId } });
            if (!gpuSetup) {
                return next(ApiError.badRequest("GPU setup with this id does not exist!"));
            }
            const gpu = await mainDatabase.models.GPUs.findOne({ where: { uuid: gpuSetup.gpu_uuid } })
            if (!gpu) {
                return next(ApiError.badRequest("GPU for that GPU setup is not found"));
            }
            // Reformat response
            const reformatedGpuSetup = {
                id: gpuSetup.id,
                memoryClockOffset: gpuSetup.memory_clock_offset,
                coreClockOffset: gpuSetup.core_clock_offset,
                powerLimit: gpuSetup.power_limit,
                fanSpeed: gpuSetup.fan_speed,
                critTemp: gpuSetup.crit_temp,
                flightSheetId: gpuSetup.flight_sheet_id,
                gpuUuid: gpuSetup.gpu_uuid,
                options: {
                    temperature: {
                        maximumCritical: gpu.temperatureMaximumCritical,
                    },
                    power: {
                        defaultLimit: gpu.powerDefaultLimit,
                        minimal: gpu.powerMinimal,
                        maximum: gpu.powerMaximum
                    },
                    clocks: {
                        minimalCoreOffset: gpu.clocksMinimalCoreOffset,
                        maximumCoreOffset: gpu.clocksMaximumCoreOffset,
                        minimalMemoryOffset: gpu.clocksMinimalMemoryOffset,
                        maximumMemoryOffset: gpu.clocksMaximumMemoryOffset,
                    }
                }
            }
            // Return
            res.status(200).json({ "gpuSetup": reformatedGpuSetup });
        } catch (err) {
            return next(err)
        }
    }
    static async getGPUPresets(req, res, next) { // reformated+ worked
        // Validate request body
        const { error } = getGPUPresetsSchema.validate(req.body);
        if (error) {
            return next(ApiError.badRequest(error.details[0].message));
        }
        // Get GPU Presets
        try {
            // Check if gpu presets exists
            const gpu = await mainDatabase.models.GPUs.findOne({ where: { id: req.body.gpuId } })
            if (!gpu) {
                return next(ApiError.badRequest('gpu with this id is not found'))
            }
            const gpuPresets = await mainDatabase.models.GPU_PRESETs.findAll({ where: { gpu_uuid: gpu.uuid } });
            // if (gpuPresets.length == 0) {
            //     return next(ApiError.noneData("GPU Presets not found"));
            // }
            // Reformat response
            const reformatedGpuPresets = []
            gpuPresets.forEach(gpuPreset => {
                gpuPreset = gpuPreset.dataValues
                const reformatedGpuPreset = {
                    id: gpuPreset.id,
                    name: gpuPreset.name,
                    memoryClockOffset: gpuPreset.memory_clock_offset,
                    coreClockOffset: gpuPreset.core_clock_offset,
                    powerLimit: gpuPreset.power_limit,
                    critTemp: gpuPreset.crit_temp,
                    fanSpeed: gpuPreset.fan_speed,
                    gpuUuid: gpuPreset.gpu_uuid
                }
                reformatedGpuPresets.push(reformatedGpuPreset)
            })
            // Return
            res.status(200).json({ "gpuPresets": reformatedGpuPresets });
        } catch (err) {
            return next(err)
        }
    }
    static async getCPUSetup(req, res, next) { // reformated + worked
        // Validate request body
        const { error } = getCPUSetupSchema.validate(req.body);
        if (error) {
            return next(ApiError.badRequest(error.details[0].message));
        }
        // Get CPU setup
        try {
            // Check if cpu setup exists
            const cpuSetup = await mainDatabase.models.CPU_SETUPs.findOne({ where: { id: req.body.cpuId } });
            if (!cpuSetup) {
                return res.status(200).json({ "cpuSetup": null })
            }
            // Reformat response
            const reformatedCpuSetup = {
                id: cpuSetup.id,
                fanSpeed: cpuSetup.fan_speed,
                cryptocurrencyId: cpuSetup.cryptocurrency_id,
                minerId: cpuSetup.miner_id,
                cpu_uuid: cpuSetup.cpu_uuid
            }
            // Return
            res.status(200).json({ "cpuSetup": reformatedCpuSetup });
        } catch (err) {
            return next(err)
        }
    }
    static async getCreateFlightSheetOptions(req, res, next) {
        try {
            const cryptocurrencies = await mainDatabase.models.CRYPTOCURRENCIEs.findAll()
            const wallets = await mainDatabase.models.WALLETs.findAll()
            const pools = await mainDatabase.models.POOLs.findAll()
            const algorithms = await mainDatabase.models.ALGORITHMs.findAll()
            const miners = await mainDatabase.models.MINERs.findAll()
            const algorithmsMiners = await mainDatabase.models.ALGORITHM_MINER.findAll()
            // Reformat
            const reformatedCryptocurrencies = [];
            const reformatedWallets = [];
            const reformatedPools = [];
            const reformatedAlgorithms = [];
            const reformatedMiners = [];
            const reformatedAlgorithmMiner = [];
            cryptocurrencies.forEach(cryptocurrency => {
                reformatedCryptocurrencies.push({
                    id: cryptocurrency.id,
                    name: cryptocurrency.name,
                    fullName: cryptocurrency.full_name,
                    algorithmId: cryptocurrency.algorithm_id
                })
            })
            wallets.forEach(wallet => {
                reformatedWallets.push({
                    id: wallet.id,
                    name: wallet.name,
                    source: wallet.source,
                    address: wallet.address,
                    cryptocurrencyId: wallet.cryptocurrency_id
                })
            })
            pools.forEach(pool => {
                reformatedPools.push({
                    id: pool.id,
                    host: pool.host,
                    port: pool.port,
                    cryptocurrencyId: pool.cryptocurrency_id
                })
            })
            algorithms.forEach(algorithm => {
                reformatedAlgorithms.push({
                    id: algorithm.id,
                    name: algorithm.name,
                })
            })
            miners.forEach(miner => {
                reformatedMiners.push({
                    id: miner.id,
                    name: miner.name,
                    fullName: miner.full_name,
                })
            })
            algorithmsMiners.forEach(algorithmMiner => {
                reformatedAlgorithmMiner.push({
                    id: algorithmMiner.id,
                    algorithmId: algorithmMiner.algorithm_id,
                    minerId: algorithmMiner.miner_id
                })
            })
            // Return
            res.status(200).json({
                cryptocurrencies: reformatedCryptocurrencies,
                wallets: reformatedWallets,
                pools: reformatedPools,
                algorithms: reformatedAlgorithms,
                miners: reformatedMiners,
                algorithmMiner: reformatedAlgorithmMiner
            })
        } catch (err) {
            return next(err)
        }
    }
    static async getFullFilledFlightSheets(req, res, next) {
        try {
            const flightSheets = await mainDatabase.models.FLIGHT_SHEETs.findAll();
            const flightSheetsWithCustomMiner = await mainDatabase.models.FLIGHT_SHEETs_WITH_CUSTOM_MINER.findAll();
            const flightSheetsWithCPU = await mainDatabase.models.FLIGHT_SHEETs_WITH_CPU.findAll();
            const flightSheetsMultiple = await mainDatabase.models.FLIGHT_SHEETs_MULTIPLE.findAll();

            const reformatedFlightSheets = []
            for (const flightSheet of flightSheets) {
                const cryptocurrency = await mainDatabase.models.CRYPTOCURRENCIEs.findOne({ where: { id: flightSheet.cryptocurrency_id } })
                const miner = await mainDatabase.models.MINERs.findOne({ where: { id: flightSheet.miner_id } });
                const wallet = await mainDatabase.models.WALLETs.findOne({ where: { id: flightSheet.wallet_id } });
                const pool = await mainDatabase.models.POOLs.findOne({ where: { id: flightSheet.pool_id } });
                const algorithm = await mainDatabase.models.ALGORITHMs.findOne({ where: { id: cryptocurrency.algorithm_id } })
                reformatedFlightSheets.push({
                    id: flightSheet.id,
                    name: flightSheet.name,
                    type: "GPU-SINGLE",
                    cryptocurrency: cryptocurrency ? {
                        id: cryptocurrency.id,
                        name: cryptocurrency.name,
                        fullName: cryptocurrency.full_name,
                        algorithmId: cryptocurrency.algorithm_id,
                    } : null,
                    miner: miner ? {
                        id: miner.id,
                        name: miner.name,
                        fullName: miner.full_name,
                    } : null,
                    wallet: wallet ? {
                        id: wallet.id,
                        name: wallet.name,
                        source: wallet.source,
                        address: wallet.address,
                        cryptocurrencyId: wallet.cryptocurrency_id
                    } : null,
                    pool: pool ? {
                        id: pool.id,
                        host: pool.host,
                        port: pool.port,
                        cryptocurrencyId: pool.cryptocurrency_id
                    } : null,
                    algorithm: algorithm ? {
                        id: algorithm.id,
                        name: algorithm.name,
                    } : null,
                    additionalString: flightSheet.additional_string,
                })
            }
            for (const flightSheetWithCustomMiner of flightSheetsWithCustomMiner) {
                const reformatedFlightSheetWithCustomMiner = {
                    id: flightSheetWithCustomMiner.id,
                    type: "CUSTOM",
                    name: flightSheetWithCustomMiner.name,
                    installationURL: flightSheetWithCustomMiner.installation_url,
                    wallet: flightSheetWithCustomMiner.wallet,
                    poolURL: flightSheetWithCustomMiner.pool,
                    coin: flightSheetWithCustomMiner.coin,
                    algorithm: flightSheetWithCustomMiner.algorithm,
                    poolTemplate: flightSheetWithCustomMiner.pool_template,
                    walletAndWorkerTemplate: flightSheetWithCustomMiner.wallet_and_worker_template,
                    password: flightSheetWithCustomMiner.password,
                    extraConfigArguments: flightSheetWithCustomMiner.extra_config_arguments
                }
                reformatedFlightSheets.push(reformatedFlightSheetWithCustomMiner)
            }
            for (const flightSheetWithCPU of flightSheetsWithCPU) {
                const cryptocurrency = await mainDatabase.models.CRYPTOCURRENCIEs.findOne({ where: { id: flightSheetWithCPU.cryptocurrency_id } })
                const miner = await mainDatabase.models.MINERs.findOne({ where: { id: flightSheetWithCPU.miner_id } });
                const wallet = await mainDatabase.models.WALLETs.findOne({ where: { id: flightSheetWithCPU.wallet_id } });
                const pool = await mainDatabase.models.POOLs.findOne({ where: { id: flightSheetWithCPU.pool_id } });
                const algorithm = await mainDatabase.models.ALGORITHMs.findOne({ where: { id: cryptocurrency.algorithm_id } })

                const reformatedFlightSheetWithCPU = {
                    id: flightSheetWithCPU.id,
                    type: "CPU",
                    name: flightSheetWithCPU.name,
                    cryptocurrency: cryptocurrency ? {
                        id: cryptocurrency.id,
                        name: cryptocurrency.name,
                        fullName: cryptocurrency.full_name,
                        algorithmId: cryptocurrency.algorithm_id,
                    } : null,
                    miner: miner ? {
                        id: miner.id,
                        name: miner.name,
                        fullName: miner.full_name,
                    } : null,
                    wallet: wallet ? {
                        id: wallet.id,
                        name: wallet.name,
                        source: wallet.source,
                        address: wallet.address,
                        cryptocurrencyId: wallet.cryptocurrency_id
                    } : null,
                    pool: pool ? {
                        id: pool.id,
                        host: pool.host,
                        port: pool.port,
                        cryptocurrencyId: pool.cryptocurrency_id
                    } : null,
                    algorithm: algorithm ? {
                        id: algorithm.id,
                        name: algorithm.name,
                    } : null,
                    additionalString: flightSheetWithCPU.additional_string,
                    hugePages: flightSheetWithCPU.huge_pages,
                    configFile: flightSheetWithCPU.config_file

                }
                reformatedFlightSheets.push(reformatedFlightSheetWithCPU)
            }
            for (const flightSheetMultiple of flightSheetsMultiple) {
                const miner = await mainDatabase.models.MINERs.findOne({ where: { id: flightSheetMultiple.miner_id } });
                const configs = await mainDatabase.models.FLIGHT_SHEETs_MULTIPLE_CRYPTOCURRENCIEs.findAll({
                    where: {
                        flight_sheet_multiple_id: flightSheetMultiple.id
                    }
                });
                const reformatedConfigs = [];
                for (const config of configs) {
                    const cryptocurrency = await mainDatabase.models.CRYPTOCURRENCIEs.findOne({ where: { id: config.cryptocurrency_id } })
                    const wallet = await mainDatabase.models.WALLETs.findOne({ where: { id: config.wallet_id } });
                    const pool = await mainDatabase.models.POOLs.findOne({ where: { id: config.pool_id } });
                    const algorithm = await mainDatabase.models.ALGORITHMs.findOne({ where: { id: cryptocurrency.algorithm_id } });
                    reformatedConfigs.push({
                        cryptocurrency: cryptocurrency ? {
                            id: cryptocurrency.id,
                            name: cryptocurrency.name,
                            fullName: cryptocurrency.full_name,
                            algorithmId: cryptocurrency.algorithm_id,
                        } : null,
                        wallet: wallet ? {
                            id: wallet.id,
                            name: wallet.name,
                            source: wallet.source,
                            address: wallet.address,
                            cryptocurrencyId: wallet.cryptocurrency_id
                        } : null,
                        pool: pool ? {
                            id: pool.id,
                            host: pool.host,
                            port: pool.port,
                            cryptocurrencyId: pool.cryptocurrency_id
                        } : null,
                        algorithm: algorithm ? {
                            id: algorithm.id,
                            name: algorithm.name,
                        } : null,
                    });
                }
                reformatedFlightSheets.push({
                    id: flightSheetMultiple.id,
                    name: flightSheetMultiple.name,
                    type: "GPU-MULTIPLE",
                    miner: miner ? {
                        id: miner.id,
                        name: miner.name,
                        fullName: miner.full_name,
                    } : null,
                    additionalString: flightSheetMultiple.additional_string,
                    configs: reformatedConfigs
                });
            }

            res.status(200).json({ "flightSheets": reformatedFlightSheets })
        } catch (err) {
            return next(err)
        }
    }
    static async getFullFilledWallets(req, res, next) {
        try {
            const wallets = await mainDatabase.models.WALLETs.findAll()
            const reformatedWallets = []
            for (const wallet of wallets) {
                const cryptocurrency = await mainDatabase.models.CRYPTOCURRENCIEs.findOne({ where: { id: wallet.cryptocurrency_id } })
                reformatedWallets.push({
                    id: wallet.id,
                    name: wallet.name,
                    source: wallet.source,
                    address: wallet.address,
                    cryptocurrency: {
                        id: cryptocurrency.id,
                        name: cryptocurrency.name,
                        fullName: cryptocurrency.full_name,
                        algorithmId: cryptocurrency.algorithm_id
                    },
                })
            }
            res.status(200).json({ "wallets": reformatedWallets })
        } catch (error) {
            return next(error)
        }
    }
    static async getGpusForFlightSheets(req, res, next) {
        try {
            const gpus = await mainDatabase.models.GPUs.findAll()
            const reformatedGpus = [];
            for (const gpu of gpus) {
                const gpuSetup = await mainDatabase.models.GPU_SETUPs.findOne({ where: { gpu_uuid: gpu.uuid } })
                reformatedGpus.push({
                    id: gpu.id,
                    connected: gpu.connected,
                    name: `${gpu.manufacturer} ${gpu.periphery}`,
                    flightSheetId: gpuSetup === null ? null : gpuSetup.flight_sheet_id
                })
            }
            res.status(200).json({ gpusForFlightSheets: reformatedGpus })
        } catch (error) {
            return next(error)
        }
    }
    static async editGpusForFlightSheets(req, res, next) {
        const { error } = editGpusForFlightSheetsSchema.validate(req.body);
        if (error) {
            return next(ApiError.badRequest(error.details[0].message));
        }
        try {
            const checkGpuSetupForCustomMiner = await mainDatabase.models.GPU_SETUPs.findAll({
                where: {
                    isCustomMiner: true,
                }
            });

            if (checkGpuSetupForCustomMiner.length > 0) {
                for (const gpuSetup of checkGpuSetupForCustomMiner) {
                    gpuSetup.flight_sheet_id_with_custom_miner = null;
                    gpuSetup.isCustomMiner = false;
                    await gpuSetup.save();
                }
            }
            for (const gpuForFlightSheet of req.body.gpusForFlightSheets) {
                if (gpuForFlightSheet.flightSheetId == null) {
                    continue;
                };
                const gpu = await mainDatabase.models.GPUs.findOne({ where: { id: gpuForFlightSheet.id } })
                if (gpu) {
                    const gpuSetup = await mainDatabase.models.GPU_SETUPs.findOne({ where: { gpu_uuid: gpu.uuid } })
                    gpuSetup.flight_sheet_id = gpuForFlightSheet.flightSheetId;
                    if (gpuSetup.isMultiple) {
                        gpuSetup.flight_sheet_id_multiple = null;
                        gpuSetup.isMultiple = false;
                    }
                    await gpuSetup.save();
                    if (clientsData.app) {
                        let cryptocurrency, miner, wallet, pool, algorithm;
                        const flightSheet = await mainDatabase.models.FLIGHT_SHEETs.findOne({ where: { id: gpuSetup.flight_sheet_id } });
                        if (flightSheet) {
                            cryptocurrency = await mainDatabase.models.CRYPTOCURRENCIEs.findOne({ where: { id: flightSheet.cryptocurrency_id } });
                            miner = await mainDatabase.models.MINERs.findOne({ where: { id: flightSheet.miner_id } });
                            wallet = await mainDatabase.models.WALLETs.findOne({ where: { id: flightSheet.wallet_id } });
                            pool = await mainDatabase.models.POOLs.findOne({ where: { id: flightSheet.pool_id } });
                            if (cryptocurrency) {
                                algorithm = await mainDatabase.models.ALGORITHMs.findOne({ where: { id: cryptocurrency.algorithm_id } });
                            }
                        }
                        // TODO:
                        clientsData.app.send(JSON.stringify(new commandInterface('static', {
                            gpus: [{
                                uuid: gpuSetup.dataValues.gpu_uuid,
                                overclock: {
                                    clockType: "custom",
                                    autofan: false,
                                    coreClockOffset: gpuSetup.core_clock_offset,
                                    memoryClockOffset: gpuSetup.memory_clock_offset,
                                    fanSpeed: gpuSetup.fan_speed,
                                    powerLimit: gpuSetup.power_limit,
                                    criticalTemp: gpuSetup.crit_temp,
                                },
                                crypto: {
                                    miner: miner ? miner.name : "",
                                    additionalString: flightSheet ? flightSheet.additional_string : "",
                                    1: {
                                        cryptocurrency: cryptocurrency ? cryptocurrency.name : "",
                                        algorithm: algorithm ? algorithm.name : "",
                                        wallet: wallet ? wallet.address : "",
                                        pool: pool ? `${pool.host}:${pool.port}` : "",
                                    },
                                    2: {
                                        cryptocurrency: "",
                                        algorithm: "",
                                        wallet: "",
                                        pool: ""
                                    },
                                    3: {
                                        cryptocurrency: "",
                                        algorithm: "",
                                        wallet: "",
                                        pool: ""
                                    }
                                }
                            }]
                        }, "setGpusSettings")))
                    }
                }
            }
            res.sendStatus(200)
        } catch (error) {
            return next(error)
        }
    }
    static async editGpusForFlightSheetsWithCustomMiner(req, res, next) {
        const { error } = editGpusForFlightSheetsWithCustomMinerSchema.validate(req.body);
        if (error) {
            return next(ApiError.badRequest(error.details[0].message));
        }

        const flightSheetWithCustomMiner = await mainDatabase.models.FLIGHT_SHEETs_WITH_CUSTOM_MINER.findOne({ where: { id: req.body.flightSheetWithCustomMinerId } })
        if (flightSheetWithCustomMiner == null) {
            return next(ApiError.badRequest("Полетного листа с таким id не существует!"));
        }
        const GPUs = await mainDatabase.models.GPUs.findAll();
        if (GPUs.length == 0) {
            return next(ApiError.badRequest("Видеокарт в системе не найдено!"));
        }
        const connectedGPUs = GPUs.filter(gpu => gpu.connected == true)
        if (connectedGPUs.length == 0) {
            return next(ApiError.badRequest("Подключенных видеокарт в системе не найдено!"));
        }
        const connectedGPUIds = connectedGPUs.map(gpu => gpu.uuid);

        const GPUSetups = await mainDatabase.models.GPU_SETUPs.findAll({
            where: {
                gpu_uuid: connectedGPUIds
            }
        })
        if (!clientsData.app) {
            return next(ApiError.noneData("App is not connected!"))
        }
        // Sending command
        const command = new commandInterface('static',
            {
                url: flightSheetWithCustomMiner.installation_url,
                wallet: flightSheetWithCustomMiner.wallet,
                pool: flightSheetWithCustomMiner.pool,
                algorithm: flightSheetWithCustomMiner.algorithm,
                poolTemplate: flightSheetWithCustomMiner.pool_template,
                workerTemplate: flightSheetWithCustomMiner.wallet_and_worker_template,
                password: flightSheetWithCustomMiner.password,
                additionalArguments: flightSheetWithCustomMiner.extra_config_arguments
            }, "setupCustomMiner");

        clientsData.app.send(JSON.stringify(command))
        // Wait response
        await OtherDataController.waitForResponse(command.command)
            .then(response => {
                commandsData[command] = null
                if (response.status == false) {
                    throw ApiError.noneData("Failed to install custom miner!");
                } else {
                    loggerConsole.basicInfo("Custom miner applied to system!");
                }
            })
            .catch(err => {
                return next(err)
            })

        for (const GPUSetup of GPUSetups) {
            GPUSetup.isCustomMiner = true;
            GPUSetup.flight_sheet_id_with_custom_miner = flightSheetWithCustomMiner.id;

            GPUSetup.flight_sheet_id = null;
            GPUSetup.isMultiple = false;
            GPUSetup.flight_sheet_id_multiple = null;
            await GPUSetup.save()
        }

        res.status(200).json();
    }
    static async editCpusForFlightSheetWithCPU(req, res, next) {
        const { error } = editGpusForFlightSheetsWithCPUSchema.validate(req.body);
        if (error) {
            return next(ApiError.badRequest(error.details[0].message));
        }
        try {
            const flightSheetWithCPU = await mainDatabase.models.FLIGHT_SHEETs_WITH_CPU.findByPk(req.body.flightSheetWithCPUId);
            if (!flightSheetWithCPU) {
                return next(ApiError.noneData("Can't find Flight Sheet in system!"));
            }
            const cpu = await mainDatabase.models.CPUs.findOne({ where: { uuid: staticData.cpu.uuid } });
            if (!cpu) {
                return next(ApiError.noneData("Can't find CPU in system!"));
            }
            const cpuSetup = await mainDatabase.models.CPU_SETUPs.findOne({ where: { cpu_uuid: cpu.uuid } });
            if (!cpuSetup) {
                return next(ApiError.noneData("Can't find CPU SETUP in system!"));
            }
            if (!clientsData.app) {
                return next(ApiError.noneData("App is not connected!"))
            }
            const cryptocurrency = await mainDatabase.models.CRYPTOCURRENCIEs.findOne({ where: { id: flightSheetWithCPU.cryptocurrency_id } });
            const algorithm = await mainDatabase.models.ALGORITHMs.findOne({ where: { id: cryptocurrency.algorithm_id } });
            const wallet = await mainDatabase.models.WALLETs.findOne({ where: { id: flightSheetWithCPU.wallet_id } });
            const pool = await mainDatabase.models.POOLs.findOne({ where: { id: flightSheetWithCPU.pool_id } });
            const miner = await mainDatabase.models.MINERs.findOne({ where: { id: flightSheetWithCPU.miner_id } });

            cpuSetup.flight_sheet_id = flightSheetWithCPU.id;
            await cpuSetup.save();

            clientsData.app.send(JSON.stringify(new commandInterface('static', {
                cpus: {
                    uuid: cpu.uuid,
                    overclock: {
                        clockType: "manual",
                        autofan: false,
                        hugepages: flightSheetWithCPU.huge_pages
                    },
                    crypto: {
                        coin: cryptocurrency ? cryptocurrency.name : "",
                        algorithm: algorithm ? algorithm.name : "",
                        wallet: wallet ? wallet.address : "",
                        pool: pool ? `${pool.host}:${pool.port}` : "",
                        miner: miner ? miner.name : "",
                        additionalString: flightSheetWithCPU ? flightSheetWithCPU.additional_string : "",
                        configFile: flightSheetWithCPU ? flightSheetWithCPU.config_file : ""
                    }
                }
            }, "setCpusSettings")))
        } catch (error) {
            return next(error);
        }
        res.status(200).json();
    }
    static async editGpusForFlightSheetsMultiple(req, res, next) {
        const { error } = editGpusForFlightSheetMultipleSchema.validate(req.body);
        if (error) {
            return next(ApiError.badRequest(error.details[0].message));
        }
        const { gpusForFlightSheetsMultiple } = req.body;
        try {
            const checkGpuSetupForCustomMiner = await mainDatabase.models.GPU_SETUPs.findAll({
                where: {
                    isCustomMiner: true,
                }
            });

            if (checkGpuSetupForCustomMiner.length > 0) {
                for (const gpuSetup of checkGpuSetupForCustomMiner) {
                    gpuSetup.flight_sheet_id_with_custom_miner = null;
                    gpuSetup.isCustomMiner = false;
                    await gpuSetup.save();
                }
            }
        } catch (err) {
            return next(err);
        }
        const reformatedGPUs = [];
        try {
            for (const receivedGpu of gpusForFlightSheetsMultiple) {
                if (receivedGpu.flightSheetMultipleId == null) continue;

                const gpu = await mainDatabase.models.GPUs.findByPk(receivedGpu.id);
                if (!gpu) {
                    return next(ApiError.badRequest(`Couldn't find GPU with id ${receivedGpu.id}`));
                }

                const gpuSetup = await mainDatabase.models.GPU_SETUPs.findOne({ where: { gpu_uuid: gpu.uuid } });
                if (!gpuSetup) {
                    return next(ApiError.badRequest(`Couldn't find GPU SETUP for GPU with uuid ${gpu.uuid}`));
                }

                const flightSheetMultiple = await mainDatabase.models.FLIGHT_SHEETs_MULTIPLE.findByPk(receivedGpu.flightSheetMultipleId);
                if (!flightSheetMultiple) {
                    return next(ApiError.badRequest(`Couldn't find flight sheet with id ${receivedGpu.flightSheetMultipleId}`))
                }

                const miner = await mainDatabase.models.MINERs.findByPk(flightSheetMultiple.miner_id);
                if (!miner) {
                    return next(ApiError.noneData(`Couldn't find miner with id ${flightSheetMultiple.miner_id}`));
                }

                gpuSetup.flight_sheet_id = (gpuSetup.flight_sheet_id != null) ? null : gpuSetup.flight_sheet_id;
                gpuSetup.flight_sheet_id_multiple = receivedGpu.flightSheetMultipleId;
                gpuSetup.isMultiple = true;
                await gpuSetup.save();

                const reformatedGPU = {
                    uuid: gpuSetup.dataValues.gpu_uuid,
                    overclock: {
                        clockType: "custom",
                        autofan: false,
                        coreClockOffset: gpuSetup.core_clock_offset,
                        memoryClockOffset: gpuSetup.memory_clock_offset,
                        fanSpeed: gpuSetup.fan_speed,
                        powerLimit: gpuSetup.power_limit,
                        criticalTemp: gpuSetup.crit_temp,
                    },
                    crypto: {
                        miner: miner ? miner.name : "",
                        additionalString: flightSheetMultiple ? flightSheetMultiple.additional_string : "",
                    }
                };

                const configs = await mainDatabase.models.FLIGHT_SHEETs_MULTIPLE_CRYPTOCURRENCIEs.findAll({
                    where: {
                        flight_sheet_multiple_id: flightSheetMultiple.id
                    }
                });
                for (let i = 0; i <= 2; i++) {
                    let cryptocurrency, algorithm, wallet, pool
                    if (configs[i]) {
                        cryptocurrency = await mainDatabase.models.CRYPTOCURRENCIEs.findOne({ where: { id: configs[i].cryptocurrency_id } });
                        if (cryptocurrency) {
                            algorithm = await mainDatabase.models.ALGORITHMs.findOne({ where: { id: cryptocurrency.algorithm_id } });
                        }
                        wallet = await mainDatabase.models.WALLETs.findOne({ where: { id: configs[i].wallet_id } });
                        pool = await mainDatabase.models.POOLs.findOne({ where: { id: configs[i].pool_id } });
                    }
                    reformatedGPU.crypto[i + 1] =
                    {
                        cryptocurrency: cryptocurrency ? cryptocurrency.name : "",
                        algorithm: algorithm ? algorithm.name : "",
                        wallet: wallet ? wallet.address : "",
                        pool: pool ? `${pool.host}:${pool.port}` : ""
                    };
                }
                reformatedGPUs.push(reformatedGPU);
            }
        } catch (err) {
            return next(err);
        }
        if (!clientsData.app) {
            return next(ApiError.noneData("Unable to connect to app!"));
        }
        const command = new commandInterface("static", { gpus: reformatedGPUs }, "setGpusSettings")
        clientsData.app.send(JSON.stringify(command));

        res.status(200).json();
    }
    static async getSettingsGpus(req, res, next) {
        try {
            const gpus = await mainDatabase.models.GPUs.findAll()
            const reformatedGpus = _.compact(await Promise.all(gpus.map(async gpu => {
                const gpuSetup = await mainDatabase.models.GPU_SETUPs.findOne({ where: { gpu_uuid: gpu.uuid } })
                if (gpuSetup) {
                    if (!staticData.gpus) {
                        throw new Error(`Couldn't find static data!`)
                    }
                    const gpuStatic = staticData.gpus.find(item => item.uuid === gpu.uuid)
                    return {
                        gpuId: gpu.id,
                        gpuSetupId: gpuSetup.id,
                        name: gpuStatic ? `${gpuStatic.information.manufacturer} ${gpuStatic.information.periphery}` : null,
                        memoryClockOffset: gpuSetup.memory_clock_offset,
                        coreClockOffset: gpuSetup.core_clock_offset,
                        connected: gpu.connected,
                        powerLimit: gpuSetup.power_limit,
                        fanSpeed: gpuSetup.fan_speed,
                        critTemp: gpuSetup.crit_temp,
                        flightSheetId: gpuSetup.flight_sheet_id,
                    }
                }
                return null
            })));
            // for (const gpu of gpus) {
            //     const gpuSetup = await mainDatabase.models.GPU_SETUPs.findOne({where:{gpu_uuid: gpu.uuid}})
            //     if (gpuSetup) {
            //         const gpuStatic = staticData.find(item =>  item.uuid === gpu.uuid)
            //         reformatedGpus.push({
            //             gpuId: gpu.id,
            //             gpuSetupId: gpuSetup.id,
            //             name: gpuStatic ? `${gpuStatic.information.manufacturer} ${gpuStatic.information.periphery}` : null,
            //             memoryClock: gpuSetup.memory_clock,
            //             coreClock: gpuSetup.core_clock,
            //             powerLimit: gpuSetup.power_limit,
            //             fanSpeed: gpuSetup.fan_speed,
            //             critTemp: gpuSetup.crit_temp,
            //             flightSheetId: gpuSetup.flight_sheet_id,
            //         })
            //     }
            // }
            res.status(200).json({ settingGpus: reformatedGpus })
        } catch (error) {
            return next(error)
        }
    }
    static async resetGPUsSettings(req, res, next) {
        const gpuSetups = await mainDatabase.models.GPU_SETUPs.findAll();
        const gpuSetupsReformated = [];

        for (const gpuSetup of gpuSetups) {
            await gpuSetup.update({ flight_sheet_id: null });

            gpuSetupsReformated.push({
                uuid: gpuSetup.dataValues.gpu_uuid,
                overclock: {
                    clockType: "custom",
                    autofan: false,
                    coreClockOffset: gpuSetup.dataValues.core_clock_offset,
                    memoryClockOffset: gpuSetup.dataValues.memory_clock_offset,
                    fanSpeed: gpuSetup.dataValues.fan_speed,
                    powerLimit: gpuSetup.dataValues.power_limit,
                    criticalTemp: gpuSetup.dataValues.crit_temp,
                },
                crypto: {
                    miner: "",
                    additionalString: "",
                    1: {
                        cryptocurrency: "",
                        algorithm: "",
                        wallet: "",
                        pool: ""
                    },
                    2: {
                        cryptocurrency: "",
                        algorithm: "",
                        wallet: "",
                        pool: ""
                    },
                    3: {
                        cryptocurrency: "",
                        algorithm: "",
                        wallet: "",
                        pool: ""
                    }
                },
            })
        }
        if (!clientsData.app) {
            return next(ApiError.noneData("App is not available!"))
        }
        if (gpuSetupsReformated.length > 0) {
            clientsData.app.send(JSON.stringify(new commandInterface('static',
                {
                    gpus: gpuSetupsReformated,
                },
                "setGpusSettings")))
        }
        res.status(200).json();
    }
    static async resetCPUsSettings(req, res, next) {
        const cpuSetups = await mainDatabase.models.CPU_SETUPs.findAll();
        if (!clientsData.app) {
            return next(ApiError.noneData("App is not available!"))
        }
        for (const cpuSetup of cpuSetups) {
            clientsData.app.send(JSON.stringify(new commandInterface('static',
                {
                    cpus: {
                        uuid: cpuSetup.dataValues.cpu_uuid,
                        overclock: {
                            clockType: "custom",
                            autofan: false,
                            hugepages: 1000
                        },
                        crypto: {
                            coin: "",
                            algorithm: "",
                            wallet: "",
                            pool: "",
                            miner: "",
                            additionalString: "",
                            configFile: ""
                        }
                    },
                },
                "setCpusSettings")))
        }
        res.status(200).json();
    }

}

export { OtherDataController };
