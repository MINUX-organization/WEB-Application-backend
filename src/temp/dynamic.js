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
            let total = 0;
            total += (this.gpus || []).reduce((acc, gpu) => acc + ((gpu.shares && gpu.shares.accepted) ?? 0), 0);
            total += (this.cpus && this.cpus.shares && this.cpus.shares.accepted) ?? 0;
            return total;
        }
        const calculateTotalSharesRejected = () => {
            let total = 0;
            total += (this.gpus || []).reduce((acc, gpu) => acc + ((gpu.shares && gpu.shares.rejected) ?? 0), 0);
            total += (this.cpus && this.cpus.shares && this.cpus.shares.rejected) ?? 0;
            return total;
        }
        const calculateWorkingAlgorithms = () => {
            const algorithms = new Set();

            this.gpus?.forEach(gpu => gpu.algorithm && algorithms.add(gpu.algorithm));
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
        const calculateCoinsValue = () => {
            const coins = {};

            // Перебираем GPU
            if (this.gpus) {
                for (const gpu of this.gpus) {
                    if (gpu.cryptocurrency) {
                        if (coins[gpu.cryptocurrency]) {
                            coins[gpu.cryptocurrency].gpus.push(gpu.uuid);
                            coins[gpu.cryptocurrency].algorithm = gpu.algorithm;
                        } else {
                            coins[gpu.cryptocurrency] = { gpus: [] };
                            coins[gpu.cryptocurrency].gpus.push(gpu.uuid);
                            coins[gpu.cryptocurrency].algorithm = gpu.algorithm;
                        }
                    }
                }
            }

            // Перебираем CPU
            if (this.cpu && this.cpu.cryptocurrency) {
                if (coins[this.cpu.cryptocurrency]) {
                    coins[this.cpu.cryptocurrency].cpu = true;
                    coins[this.cpu.cryptocurrency].algorithm = this.cpu.algorithm;
                } else {
                    coins[this.cpu.cryptocurrency] = { gpus: [], cpu: true, algorithm: this.cpu.algorithm };
                }
            }

            // Формируем результаты
            const coinsResult = [];
            for (const coin in coins) {
                let totalHashrate = 0;

                // Суммируем хэшрейт для GPU
                coins[coin].gpus.forEach(gpuCoin => {
                    this.gpus.forEach(gpuData => {
                        if (gpuCoin == gpuData.uuid) {
                            totalHashrate += gpuData.hashrate.value;
                        }
                    });
                });

                // Добавляем хэшрейт для CPU, если он есть
                if (coins[coin].cpu && this.cpu && this.cpu.hashrate) {
                    totalHashrate += this.cpu.hashrate.value;
                }

                coinsResult.push({
                    coin: coin,
                    algorithm: coins[coin].algorithm,
                    value: totalHashrate
                });
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