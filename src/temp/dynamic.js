import { staticData } from "./static.js"

const dynamicData = {
    state: null,
    gpus : null,
    cpu : null,
    harddrives : null,
    rams : null,
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
                algorithms.add(this.cpu.algorithm)
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
                miners.add(this.cpu.miner)
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
        }
        return {
            coinsValue: null,
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