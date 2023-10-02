import { staticData } from "./static.js"

const dynamicData = {
    state: null,
    _gpus : null,
    cpu : null,
    harddrives : null,
    rams : null,
    set gpus(inputGpus) {
        if (inputGpus) {
            for (const gpu of inputGpus) {
                if (staticData.gpus) {
                    const staticGpu = staticData.gpus.find(staticGpu => staticGpu.uuid === gpu.uuid);
                    if (staticGpu) {
                        gpu.fullName = staticGpu.information.manufacturer;
                    } else {
                        gpu.fullName = 'undefined';
                    }
                } else (
                    gpu.fullName = 'undefined'
                )
            }
        }
        this._gpus = inputGpus;
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

const test = {
    "command": "getDynamicData",
    "payload": {
        "cpu": {
            "algorithm": null,
            "clockSpeed": 3760.53,
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
            "powerUsage": 0,
            "shares": {
                "accepted": null,
                "rejected": null
            },
            "temperature": 57,
            "uuid": "04af2597bcac8c9169ff93adf5851e487f36330c39623e6293a3e49d828c0ea4"
        },
        "gpus": [
            {
                "algorithm": null,
                "clocks": {
                    "core": 2058,
                    "memory": 2238
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
                "powerUsage": 264,
                "shares": {
                    "accepted": null,
                    "rejected": null
                },
                "temperature": 39,
                "uuid": "2248b28d83e7edf5089b1400d3655cf505708afc512e67290ab736aea1a6d508"
            },
            {
                "algorithm": null,
                "clocks": {
                    "core": 2474,
                    "memory": 2146
                },
                "cryptocurrency": null,
                "fanSpeed": 91,
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
                "powerUsage": 377,
                "shares": {
                    "accepted": null,
                    "rejected": null
                },
                "temperature": 20,
                "uuid": "781e82f6686a81bbe0850a378939bbd339892ac51f904b6327c821d4ab4a5e51"
            },
            {
                "algorithm": null,
                "clocks": {
                    "core": 2054,
                    "memory": 3675
                },
                "cryptocurrency": null,
                "fanSpeed": 78,
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
                "powerUsage": 203,
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
                    "core": 2432,
                    "memory": 3231
                },
                "cryptocurrency": null,
                "fanSpeed": 80,
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
                "powerUsage": 92,
                "shares": {
                    "accepted": null,
                    "rejected": null
                },
                "temperature": 66,
                "uuid": "0c25cbc57425a9fb87e41ab4012bc6f4aca82052ffc69fff55a5cac59b1f0ced"
            },
            {
                "algorithm": null,
                "clocks": {
                    "core": 2752,
                    "memory": 3300
                },
                "cryptocurrency": null,
                "fanSpeed": 80,
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
                "powerUsage": 195,
                "shares": {
                    "accepted": null,
                    "rejected": null
                },
                "temperature": 51,
                "uuid": "dc24f27c353e68f7bd4bdb70c597559d1f9bfb38695ba87bbb5e996d877b168e"
            },
            {
                "algorithm": null,
                "clocks": {
                    "core": 3286,
                    "memory": 1885
                },
                "cryptocurrency": null,
                "fanSpeed": 67,
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
                "powerUsage": 318,
                "shares": {
                    "accepted": null,
                    "rejected": null
                },
                "temperature": 39,
                "uuid": "d48f41f433fe1de2d73ed02fcf18b394a2a95b1aff80fa4056f3f20edb59f8cb"
            },
            {
                "algorithm": null,
                "clocks": {
                    "core": 2204,
                    "memory": 1415
                },
                "cryptocurrency": null,
                "fanSpeed": 91,
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
                "powerUsage": 198,
                "shares": {
                    "accepted": null,
                    "rejected": null
                },
                "temperature": 18,
                "uuid": "05af3e6312d39cdc6d9d79399aa225ed87645765570bfa215fc9e300771996c2"
            },
            {
                "algorithm": null,
                "clocks": {
                    "core": 1373,
                    "memory": 2562
                },
                "cryptocurrency": null,
                "fanSpeed": 64,
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
                "powerUsage": 149,
                "shares": {
                    "accepted": null,
                    "rejected": null
                },
                "temperature": 50,
                "uuid": "eee3d611b424e778b53e142ab947abc4080f8791dc978bf210a405a9ee444c0e"
            },
            {
                "algorithm": null,
                "clocks": {
                    "core": 2120,
                    "memory": 2533
                },
                "cryptocurrency": null,
                "fanSpeed": 60,
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
                "powerUsage": 338,
                "shares": {
                    "accepted": null,
                    "rejected": null
                },
                "temperature": 24,
                "uuid": "1d292ac9ac0861847196784a6c60c23db2d7de24fbc9592b49a1fb9f45b0defa"
            },
            {
                "algorithm": null,
                "clocks": {
                    "core": 2237,
                    "memory": 1693
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
                "powerUsage": 111,
                "shares": {
                    "accepted": 21,
                    "rejected": 33
                },
                "temperature": 70,
                "uuid": "4990e181556aac76861563e91090296275c60c9917856df09991585544c47bb2"
            },
            {
                "algorithm": null,
                "clocks": {
                    "core": 1906,
                    "memory": 3012
                },
                "cryptocurrency": null,
                "fanSpeed": 40,
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
                "powerUsage": 133,
                "shares": {
                    "accepted": null,
                    "rejected": null
                },
                "temperature": 50,
                "uuid": "103aab49e9f8de48a7cd8884bfb8183cbe2b3e77118af6200744eddc5b6e2c2a"
            },
            {
                "algorithm": null,
                "clocks": {
                    "core": 1956,
                    "memory": 2701
                },
                "cryptocurrency": null,
                "fanSpeed": 32,
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
                "temperature": 74,
                "uuid": "eeda5785f570f219ee85e3229067da846f781c27ede424e0823d11fdefd0973c"
            }
        ],
        "harddrives": [
            {
                "capacity": 1967317549056,
                "free": {
                    "measurement": "Gb",
                    "value": 1365.0
                },
                "temperature": 54,
                "uuid": "a958ebeb0b4867be81d9f7efdf6c211976083f8b29a3638487c97e33e6f78b04"
            },
            {
                "capacity": 1967317549056,
                "free": {
                    "measurement": "Gb",
                    "value": 1365.0
                },
                "temperature": 46,
                "uuid": "06f2b8cbe2d5dc061158b0ad85b727391bbcb428b8fa4d20b84332ce6156e808"
            }
        ],
        "rams": [
            {
                "free": {
                    "measurement": "Mb",
                    "value": 13918
                },
                "usage": {
                    "measurement": "Mb",
                    "value": 18052
                },
                "uuid": "mPaS01znUqB02o4bwS2si5n5NsUxuRUT8zGNORSLZo3GgVuQxuf4Z4MUKrgZXokk"
            },
            {
                "free": {
                    "measurement": "Mb",
                    "value": 13918
                },
                "usage": {
                    "measurement": "Mb",
                    "value": 18052
                },
                "uuid": "PQSM9ncPZcOtEI49vKdcOj7bkQhdQRqjF9IF8u0GSFl4qjS9Lbr77VaROjfDSbQ0"
            }
        ],
        "state": {
            "mining": false
        }
    },
    "requestId": "Bb6TXvwvGxto3t05x2GxEiAk1ZNjVZn1GA0mjrbMi49nnJOf5gmpFxzIvqik1iF5",
    "responseId": "6gEqiabyz0qPFlsHwYkwIj6TaqOeQY3sc2QB7GmMXE7aahqdlxOTm9vaEEGpJU1W",
    "type": "dynamic"
}

dynamicData.gpus = test.payload.gpus;
dynamicData.cpu = test.payload.cpu;
dynamicData.rams = test.payload.rams;


console.log(dynamicData._gpus)
console.log(dynamicData.cpu)

export { dynamicData }