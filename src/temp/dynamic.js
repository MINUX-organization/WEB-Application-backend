import { staticData } from "./static.js"

const dynamicData = {
    state: null,
    _gpus: null,
    cpu: null,
    harddrives: null,
    rams: null,
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
            let totalAcceptedShares = 0;
            const totalAcceptedSharesFromGpus = this.gpus.reduce((total, gpu) => {
                if (gpu && gpu.crypto) {
                    Object.values(gpu.crypto).forEach(crypto => {
                        if (crypto && crypto.shares) {
                            total += crypto.shares.accepted || 0;
                        }
                    });
                }
                return total;
            }, 0);
            totalAcceptedShares += totalAcceptedSharesFromGpus;
            totalAcceptedShares += (this.cpus?.shares?.accepted) ?? 0;
            return totalAcceptedShares;
        }
        const calculateTotalSharesRejected = () => {
            let totalRejectedShares = 0;

            const totalRejectedSharesFromGpus = this.gpus.reduce((total, gpu) => {
                if (gpu && gpu.crypto) {
                    Object.values(gpu.crypto).forEach(crypto => {
                        if (crypto && crypto.shares && crypto.shares.rejected) {
                            total += crypto.shares.rejected;
                        }
                    });
                }
                return total;
            }, 0);

            totalRejectedShares += totalRejectedSharesFromGpus;
            totalRejectedShares += (this.cpus?.shares?.rejected) ?? 0;

            return totalRejectedShares;
        }
        const calculateWorkingAlgorithms = () => {
            const algorithms = new Set();


            this.gpus.forEach(gpu => {
                if (gpu && gpu.crypto) {
                    Object.values(gpu.crypto).forEach(crypto => {
                        if (crypto && crypto.algorithm) {
                            algorithms.add(crypto.algorithm);
                        }
                    });
                }
            });
            this.cpu?.algorithm && algorithms.add(this.cpu.algorithm);

            return algorithms.size;
        }
        const calculateWorkingMiners = () => {
            const miners = new Set();

            this.gpus?.forEach(gpu => gpu.miner?.uuid && miners.add(gpu.miner.uuid));
            this.cpu?.miner?.uuid && miners.add(this.cpu.miner.uuid);

            return miners.size;
        }
        const calculateTotalPower = () => {
            let total = 0;

            total += (this.gpus || []).reduce((acc, gpu) => acc + (gpu.powerUsage || 0), 0);
            total += this.cpu?.powerUsage || 0;

            return total;
        }
        const calculateTotalRam = () => {
            let total = 0;
            if (this.rams) {
                for (const ram of this.rams) {
                    if (ram.usage && ram.usage.value) {
                        total = ram.usage.value
                    }
                }
            }
            return total;
        }
        const calculateCoinHashrate = () => {
            const coins = {};
            if (this.cpu && this.cpu.cryptocurrency) {
                coins[this.cpu.cryptocurrency] = {
                    coin: this.cpu.cryptocurrency,
                    algorithm: this.cpu.algorithm || null,
                    value: this.cpu.hashrate ? this.cpu.hashrate.value : 0,
                    measurement: this.cpu.hashrate ? this.cpu.hashrate.measurement : null
                };
            }
            this.gpus.forEach(gpu => {
                if (gpu && gpu.crypto) {
                    Object.values(gpu.crypto).forEach(crypto => {
                        if (crypto && crypto.cryptocurrency) {
                            if (coins[crypto.cryptocurrency]) {
                                coins[crypto.cryptocurrency].value += crypto.hashrate ? crypto.hashrate.value : 0;
                            } else {
                                coins[crypto.cryptocurrency] = {
                                    coin: crypto.cryptocurrency,
                                    algorithm: crypto.algorithm || null,
                                    value: crypto.hashrate ? crypto.hashrate.value : 0,
                                    measurement: crypto.hashrate ? crypto.hashrate.measurement : null
                                };
                            }
                        }
                    });
                }
            });

            const coinsArray = Object.values(coins);
            return coinsArray;
        };
        return {
            coinsValue: calculateCoinHashrate(),
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