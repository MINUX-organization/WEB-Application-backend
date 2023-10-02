

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

const test = {
    "cpu": {
    "algorithm": null,
    "clockSpeed": 3923.53,
    "cryptocurrency": null,
    "fanSpeed": -1,
    "hashrate": {
        "measurement": null,
        "value": null
    },
    "isMining": false,
    "miner": {
        "fullName": null,
        "uuid": null
    },
    "powerUsage": 81,
    "shares": {
        "accepted": null,
        "rejected": null
    },
    "temperature": 57,
    "uuid": "04af2597bcac8c9169ff93adf5851e487f36330c39623e6293a3e49d828c0ea4"
},
"gpus": [
    {
        "algorithm": "algorithm1",
        "clocks": {
            "core": 1200,
            "memory": 1700
        },
        "cryptocurrency": "coin1",
        "fanSpeed": 0,
        "hashrate": {
            "measurement": null,
            "value": 20
        },
        "isMining": false,
        "memory": {
            "free": 0,
            "reserved": 0,
            "used": 0
        },
        "miner": {
            "fullName": null,
            "uuid": null
        },
        "powerUsage": 100,
        "shares": {
            "accepted": null,
            "rejected": null
        },
        "temperature": 90,
        "uuid": "2248b28d83e7edf5089b1400d3655cf505708afc512e67290ab736aea1a6d508"
    },
    {
        "algorithm": "algorithm1",
        "clocks": {
            "core": 1200,
            "memory": 1700
        },
        "cryptocurrency": "coin1",
        "fanSpeed": 0,
        "hashrate": {
            "measurement": null,
            "value": 20
        },
        "isMining": false,
        "memory": {
            "free": 0,
            "reserved": 0,
            "used": 0
        },
        "miner": {
            "fullName": null,
            "uuid": null
        },
        "powerUsage": 100,
        "shares": {
            "accepted": null,
            "rejected": null
        },
        "temperature": 36,
        "uuid": "781e82f6686a81bbe0850a378939bbd339892ac51f904b6327c821d4ab4a5e51"
    },
    {
        "algorithm": "btc1",
        "clocks": {
            "core": 2859,
            "memory": 2392
        },
        "cryptocurrency": "btc",
        "fanSpeed": 82,
        "hashrate": {
            "measurement": null,
            "value": 30
        },
        "isMining": false,
        "memory": {
            "free": 0,
            "reserved": 0,
            "used": 0
        },
        "miner": {
            "fullName": null,
            "uuid": null
        },
        "powerUsage": 311,
        "shares": {
            "accepted": null,
            "rejected": null
        },
        "temperature": 15,
        "uuid": "fbc79b47dd0f11742d54c80c05b8bf6aec5de02a18b6f9a81d17dda4a46bb886"
    },
    {
        "algorithm": null,
        "clocks": {
            "core": 4162,
            "memory": 1700
        },
        "cryptocurrency": null,
        "fanSpeed": 45,
        "hashrate": {
            "measurement": null,
            "value": null
        },
        "isMining": false,
        "memory": {
            "free": 0,
            "reserved": 0,
            "used": 0
        },
        "miner": {
            "fullName": null,
            "uuid": null
        },
        "powerUsage": 87,
        "shares": {
            "accepted": null,
            "rejected": null
        },
        "temperature": 52,
        "uuid": "0c25cbc57425a9fb87e41ab4012bc6f4aca82052ffc69fff55a5cac59b1f0ced"
    },
    {
        "algorithm": null,
        "clocks": {
            "core": 2989,
            "memory": 3093
        },
        "cryptocurrency": null,
        "fanSpeed": 69,
        "hashrate": {
            "measurement": null,
            "value": null
        },
        "isMining": false,
        "memory": {
            "free": 0,
            "reserved": 0,
            "used": 0
        },
        "miner": {
            "fullName": null,
            "uuid": null
        },
        "powerUsage": 364,
        "shares": {
            "accepted": null,
            "rejected": null
        },
        "temperature": 14,
        "uuid": "dc24f27c353e68f7bd4bdb70c597559d1f9bfb38695ba87bbb5e996d877b168e"
    },
    {
        "algorithm": null,
        "clocks": {
            "core": 3189,
            "memory": 2773
        },
        "cryptocurrency": null,
        "fanSpeed": 77,
        "hashrate": {
            "measurement": null,
            "value": null
        },
        "isMining": false,
        "memory": {
            "free": 0,
            "reserved": 0,
            "used": 0
        },
        "miner": {
            "fullName": null,
            "uuid": null
        },
        "powerUsage": 231,
        "shares": {
            "accepted": null,
            "rejected": null
        },
        "temperature": 12,
        "uuid": "d48f41f433fe1de2d73ed02fcf18b394a2a95b1aff80fa4056f3f20edb59f8cb"
    },
    {
        "algorithm": null,
        "clocks": {
            "core": 3976,
            "memory": 3625
        },
        "cryptocurrency": null,
        "fanSpeed": 93,
        "hashrate": {
            "measurement": null,
            "value": null
        },
        "isMining": false,
        "memory": {
            "free": 0,
            "reserved": 0,
            "used": 0
        },
        "miner": {
            "fullName": null,
            "uuid": null
        },
        "powerUsage": 211,
        "shares": {
            "accepted": null,
            "rejected": null
        },
        "temperature": 39,
        "uuid": "05af3e6312d39cdc6d9d79399aa225ed87645765570bfa215fc9e300771996c2"
    },
    {
        "algorithm": null,
        "clocks": {
            "core": 2284,
            "memory": 1988
        },
        "cryptocurrency": null,
        "fanSpeed": 31,
        "hashrate": {
            "measurement": null,
            "value": null
        },
        "isMining": false,
        "memory": {
            "free": 0,
            "reserved": 0,
            "used": 0
        },
        "miner": {
            "fullName": null,
            "uuid": null
        },
        "powerUsage": 277,
        "shares": {
            "accepted": null,
            "rejected": null
        },
        "temperature": 82,
        "uuid": "eee3d611b424e778b53e142ab947abc4080f8791dc978bf210a405a9ee444c0e"
    },
    {
        "algorithm": null,
        "clocks": {
            "core": 2032,
            "memory": 2638
        },
        "cryptocurrency": null,
        "fanSpeed": 77,
        "hashrate": {
            "measurement": null,
            "value": null
        },
        "isMining": false,
        "memory": {
            "free": 0,
            "reserved": 0,
            "used": 0
        },
        "miner": {
            "fullName": null,
            "uuid": null
        },
        "powerUsage": 142,
        "shares": {
            "accepted": null,
            "rejected": null
        },
        "temperature": 13,
        "uuid": "1d292ac9ac0861847196784a6c60c23db2d7de24fbc9592b49a1fb9f45b0defa"
    },
    {
        "algorithm": null,
        "clocks": {
            "core": 2781,
            "memory": 3075
        },
        "cryptocurrency": null,
        "fanSpeed": 33,
        "hashrate": {
            "measurement": null,
            "value": null
        },
        "isMining": false,
        "memory": {
            "free": 0,
            "reserved": 0,
            "used": 0
        },
        "miner": {
            "fullName": null,
            "uuid": null
        },
        "powerUsage": 260,
        "shares": {
            "accepted": null,
            "rejected": null
        },
        "temperature": 24,
        "uuid": "4990e181556aac76861563e91090296275c60c9917856df09991585544c47bb2"
    },
    {
        "algorithm": null,
        "clocks": {
            "core": 4225,
            "memory": 3323
        },
        "cryptocurrency": null,
        "fanSpeed": 48,
        "hashrate": {
            "measurement": null,
            "value": null
        },
        "isMining": false,
        "memory": {
            "free": 0,
            "reserved": 0,
            "used": 0
        },
        "miner": {
            "fullName": null,
            "uuid": null
        },
        "powerUsage": 341,
        "shares": {
            "accepted": null,
            "rejected": null
        },
        "temperature": 84,
        "uuid": "103aab49e9f8de48a7cd8884bfb8183cbe2b3e77118af6200744eddc5b6e2c2a"
    },
    {
        "algorithm": null,
        "clocks": {
            "core": 2250,
            "memory": 2940
        },
        "cryptocurrency": null,
        "fanSpeed": 76,
        "hashrate": {
            "measurement": null,
            "value": null
        },
        "isMining": false,
        "memory": {
            "free": 0,
            "reserved": 0,
            "used": 0
        },
        "miner": {
            "fullName": null,
            "uuid": null
        },
        "powerUsage": 68,
        "shares": {
            "accepted": null,
            "rejected": null
        },
        "temperature": 47,
        "uuid": "eeda5785f570f219ee85e3229067da846f781c27ede424e0823d11fdefd0973c"
    }
],
"harddrives": [
    {
        "capacity": 1967317549056,
        "free": {
            "measurement": "Gb",
            "value": 1364.0
        },
        "temperature": 54,
        "uuid": "ec955e6193084825bd6c8901d5a115d02a36f3d6ae27b7bd5f8534b14897c7c5"
    },
    {
        "capacity": 1967317549056,
        "free": {
            "measurement": "Gb",
            "value": 1364.0
        },
        "temperature": 46,
        "uuid": "6e5c843687f05974f9378da502dad332f01e6401a7742ee9feae54e4a12b4072"
    }
],
"rams": [
    {
        "free": {
            "measurement": "Mb",
            "value": 722
        },
        "usage": {
            "measurement": "Mb",
            "value": 31248
        },
        "uuid": "8wFifBYpWdLj250VJrsZi64CTcSk8fmHkJiqLJdZQ9HGnO3pMJPv6BeMW2EuAnUz"
    },
    {
        "free": {
            "measurement": "Mb",
            "value": 722
        },
        "usage": {
            "measurement": "Mb",
            "value": 31248
        },
        "uuid": "3cZUtNrw6hRKnjUg4phHYgXOmAmAw5G78x9MBe1mj5ddTbMmt66dYMoO5doeFf08"
    }
],
"state": {
    "mining": false
}
}
dynamicData.gpus = test.gpus
dynamicData.cpu = test.cpu
dynamicData.rams = test.rams    
console.log(dynamicData.calculations)

