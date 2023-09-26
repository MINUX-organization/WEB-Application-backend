const dynamicData = {
    state: null,
    gpus : null,
    cpu : null,
    harddrives : null,
    rams : null,
    get calculations() {
        // Variables
        const result = {
            coinsValue: null,
            totalSharesAccepted: 0,
            totalSharesRejected: 0,
            workingAlgorithms: 0,
            workingMiner: 0,
            totalPower: 0,
            totalRam: 0
        }
        const miners = []
        const algorithms = []
        const coins = []
        // GPU 
        this.gpus.forEach(gpu => {
            result.totalSharesAccepted += gpu.shares.accepted
            result.totalSharesRejected += gpu.shares.rejected
            result.totalPower += gpu.powerUsage
            miners.push(gpu.miner.uuid)
            algorithms.push(gpu.algorithm)
            coins.push({coin: gpu.cryptocurrency, algorithm: gpu.algorithm})
        });
        // CPU
        result.totalSharesAccepted += this.cpu.shares.accepted
        result.totalSharesRejected += this.cpu.shares.rejected
        result.totalPower += this.cpu.powerUsage
        miners.push(this.cpu.miner.uuid)
        algorithms.push(this.cpu.algorithm)
        coins.push({coin: this.cpu.cryptocurrency, algorithm: this.cpu.algorithm})
        // RAM
        this.rams.forEach(element => {
            result.totalRam += element.free.value
        })
        // Sort arrays with miners/algorithms
        result.workingAlgorithms = [...new Set(algorithms)].length
        result.workingMiner = [...new Set(miners)].length
        // Coins
        const coinCount = coins.reduce((acc, item) => {
            if (!acc[item.coin]) {
                acc[item.coin] = { coin: item.coin, algorithm: item.algorithm, value: 1 };
            } else {
                acc[item.coin].value++
            }
            return acc;
        }, {});
        result.coinsValue = Object.values(coinCount).map((item) => {
            return { coin: item.coin, algorithm: item.algorithm, value: item.value }
        });
        // Return result
        return result
    }
}

export { dynamicData }