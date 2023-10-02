import { staticData } from "./static.js"

const dynamicData = {
    state: null,
    _gpus : null,
    cpu : null,
    harddrives : null,
    rams : null,
    set gpus(inputGpus) {
        for (const inputGpu of inputGpus) {
            if (staticData.gpus) {
                const staticGpu = staticData.gpus.find(staticGpu => staticGpu.uuid === inputGpu.uuid);
                if (staticGpu) {
                    inputGpu.fullName = `${staticGpu.information.manufacturer} ${staticGpu.information.periphery}`
                } else {
                    inputGpu.fullName = 'undefined'
                }
            } else {
                inputGpu.fullName = 'undefined'
            }
        }
        this._gpus = inputGpus;
    },
    get gpus() {
        return this._gpus;
    },
    get calculations() {    
        const calculateTotalSharesAccepted = () => {
            let total = 0;
            if (this.gpus) {
                for (const gpu of this.gpus) {
                    if (gpu.shares.accepted) {
                        total += gpu.shares.accepted
                    }
                }
            }
            return total;
        } 
        const calculateTotalSharesRejected = () => {
            let total = 0;
            if (this.gpus) {
                for (const gpu of this.gpus) {
                    if (gpu.shares.rejected) {
                        total += gpu.shares.rejected
                    }
                }
            }
            return total;
        }
        const calculateWorkingAlgorithms = () => {
            const algorithms = [];
            if (this.gpus) {
                for (const gpu of this.gpus) {
                    if (gpu.algorithm) {
                        algorithms.push(gpu.algorithm)
                    }
                }
            }
            if (this.cpu && this.cpu.algorithm) {
                algorithms.push(this.cpu.algorithm)
            }
            return algorithms.length
        }
        const calculateWorkingMiners = () => {
            const miners = [];
            if (this.gpus) {
                for (const gpu of this.gpus) {
                    if (gpu.miner) {
                        miners.push(gpu.miner)
                    }
                }
            }
            if (this.cpu && this.cpu.miner) {
                miners.push(this.cpu.miner)
            }
            return miners.length
        }
        const calculateTotalPower = () => {
            let total = 0;
            if (this.gpus) {
                for (const gpu of this.gpus) {
                    if (gpu.powerUsage) {
                        total += gpu.powerUsage;
                    }
                }
            }
            if (this.cpu && this.cpu.powerUsage) {
                total += this.cpu.powerUsage;
            }
            return total;
        }
        const calculateTotalRam = () => {
            let total = 0;
            if (this.rams) {
                for (const ram of this.rams) {
                    if (ram.usage && ram.usage.value) {
                        total += ram.usage.value
                    }
                }
            }
            return total;
        }
        const calculateCoinsValue = () => {
            const coins = {};
            
            if (this.gpus) {
                for (const gpu of this.gpus) {
                    if (gpu.cryptocurrency) {
                        if (coins[gpu.cryptocurrency]) {
                            coins[gpu.cryptocurrency].gpus.push(gpu.uuid)
                            coins[gpu.cryptocurrency].algorithm = gpu.algorithm
                        } else {
                            coins[gpu.cryptocurrency] = {gpus: []}
                            coins[gpu.cryptocurrency].gpus.push(gpu.uuid)
                            coins[gpu.cryptocurrency].algorithm = gpu.algorithm
                        }
                    }
                }
            }
            const coinsResult = [];
            for (const coin in coins) {
                let totalHashrate = 0;
                coins[coin].gpus.forEach(gpuCoin => {
                    this.gpus.forEach(gpuData => {
                        if (gpuCoin == gpuData.uuid) {
                            totalHashrate += gpuData.hashrate.value
                        }
                    })
                })
                coinsResult.push({
                    coin: coin,
                    algorithm: coins[coin].algorithm,
                    value: totalHashrate
                })
            }
            return coinsResult;
        }
        return {
            coinsValue: calculateCoinsValue(),
            totalSharesAccepted: calculateTotalSharesAccepted(),
            totalSharesRejected: calculateTotalSharesRejected(),
            workingAlgorithms: calculateWorkingAlgorithms(),
            workingMiners: calculateWorkingMiners(),
            totalPower: calculateTotalPower(),
            totalRam: calculateTotalRam()
        }
    }
}
export { dynamicData }