const msgJSON =
{
    "command": "getDynamicData",
    "payload": {
        "cpu": {
            "algorithm": "RandomX",
            "clockSpeed": 3899.0,
            "cryptocurrency": "XMR",
            "fanSpeed": -1,
            "hashrate": {
                "measurement": "Mh/s",
                "value": 0
            },
            "isMining": false,
            "miner": {
                "fullName": null,
                "uuid": null
            },
            "minerUpTime": null,
            "powerUsage": 0,
            "shares": {
                "accepted": 0,
                "rejected": 0
            },
            "temperature": 27,
            "uuid": "e117943d56e8bf8d370039e5131933881d590381329961eaafe321f12f772e66"
        },
        "gpus": [
            {
                "clocks": {
                    "core": 0,
                    "memory": 0
                },
                "crypto": {
                    "1": {
                        "algorithm": null,
                        "cryptocurrency": null,
                        "hashrate": {
                            "measurement": "Mh/s",
                            "value": 0.0
                        },
                        "shares": {
                            "accepted": 0,
                            "rejected": 0
                        }
                    },
                    "2": {
                        "algorithm": null,
                        "cryptocurrency": null,
                        "hashrate": {
                            "measurement": "Mh/s",
                            "value": 0.0
                        },
                        "shares": {
                            "accepted": 0,
                            "rejected": 0
                        }
                    },
                    "3": {
                        "algorithm": null,
                        "cryptocurrency": null,
                        "hashrate": {
                            "measurement": "Mh/s",
                            "value": 0.0
                        },
                        "shares": {
                            "accepted": 0,
                            "rejected": 0
                        }
                    }
                },
                "fanSpeed": 70,
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
                "minerUpTime": null,
                "powerUsage": 7,
                "temperature": 30,
                "uuid": "8263ae01eda5ef1b3f9ca8299c82bb4b497d524357284878b49b0d4aceda04e3"
            },
            {
                "clocks": {
                    "core": 0,
                    "memory": 0
                },
                "crypto": {
                    "1": {
                        "algorithm": null,
                        "cryptocurrency": null,
                        "hashrate": {
                            "measurement": "Mh/s",
                            "value": 0.0
                        },
                        "shares": {
                            "accepted": 0,
                            "rejected": 0
                        }
                    },
                    "2": {
                        "algorithm": null,
                        "cryptocurrency": null,
                        "hashrate": {
                            "measurement": "Mh/s",
                            "value": 0.0
                        },
                        "shares": {
                            "accepted": 0,
                            "rejected": 0
                        }
                    },
                    "3": {
                        "algorithm": null,
                        "cryptocurrency": null,
                        "hashrate": {
                            "measurement": "Mh/s",
                            "value": 0.0
                        },
                        "shares": {
                            "accepted": 0,
                            "rejected": 0
                        }
                    }
                },
                "fanSpeed": 69,
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
                "minerUpTime": null,
                "powerUsage": 4,
                "temperature": 28,
                "uuid": "be9fe818081170d80af3d2bd6132f756663d64ab11ad064eed414535fe7ed70b"
            }
        ],
        "harddrives": [
            {
                "capacity": 58225459200,
                "free": {
                    "measurement": "Gb",
                    "value": 22.0
                },
                "temperature": 0,
                "uuid": "dd76321472bcc3c9579ba73a46a5b80e58bb8bdbfbcd932056c1beaaf447be51"
            },
            {
                "capacity": 58225459200,
                "free": {
                    "measurement": "Gb",
                    "value": 22.0
                },
                "temperature": 0,
                "uuid": "0066b377c6bbde65581da58ca2e027e14ba1247474d57311dc094c1824922120"
            }
        ],
        "rams": [
            {
                "free": {
                    "measurement": "Mb",
                    "value": 368
                },
                "usage": {
                    "measurement": "Mb",
                    "value": 4906
                },
                "uuid": "41e5d19c23d6d6d4232bef66d9dfbd36f317a6d967effe043cb0460f453ac693"
            },
            {
                "free": {
                    "measurement": "Mb",
                    "value": 368
                },
                "usage": {
                    "measurement": "Mb",
                    "value": 4906
                },
                "uuid": "7f73680c6cc6f14d04012de2912410bd07779687cb0615f249278de2664a0ba7"
            }
        ],
        "state": {
            "mining": false
        }
    },
    "requestId": "pYvu3fS22V03tdvNwmmAnTNjNG5Tk9e7Pc5KuAdXZGXjUyxpi2nX3kZhUWq9gr4S",
    "responseId": "XqllzLhK2Euf04F3ki62B5T6SyYgDAEX4MZlGaHljK0r6KGToDXB7lIZXQS8wIL2",
    "type": "dynamic"
};

const dynamicData = {
    state: null,
    _gpus: null,
    cpu: null,
    harddrives: null,
    rams: null,
    set gpus(inputGpus) {
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
                    value: this.cpu.hashrate ? this.cpu.hashrate.value : 0
                };
            }
            this.gpus.forEach(gpu => {
                if (gpu && gpu.crypto) {
                    Object.values(gpu.crypto).forEach(crypto => {
                        if (crypto && crypto.cryptocurrency && crypto.hashrate && crypto.hashrate.value) {
                            if (coins[crypto.cryptocurrency]) {
                                coins[crypto.cryptocurrency].value += crypto.hashrate.value;
                            } else {
                                coins[crypto.cryptocurrency] = {
                                    coin: crypto.cryptocurrency,
                                    algorithm: crypto.algorithm || null,
                                    value: crypto.hashrate.value
                                };
                            }
                        }
                    });
                }
            });
            console.log(coins);
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
for (let key in msgJSON.payload) {
    dynamicData[key] = JSON.parse(JSON.stringify(msgJSON.payload[key]))
}
console.log(dynamicData.calculations)