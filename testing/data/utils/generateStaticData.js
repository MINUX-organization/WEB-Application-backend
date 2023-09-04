function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomBool(percentage) {
    return Math.random() < percentage / 100;
}

function randomUuid() {
    let uuid = "";
    const characters = "0123456789abcdef";
    for (let i = 0; i < 64; i++) {
        uuid += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return uuid;
}

export default function generateData() {
    return {
        gpus: [
            {
                uuid: randomUuid(),
                information: {
                    manufacturer: 'NVIDIA',
                    periphery: 'GeForce RTX 3080 Ti',
                    driverVersion: `${getRandomInt(1, 10)}.0.0`,
                    technology: {
                        version: 'Ampere',
                        name: 'GA102'
                    },
                    serialNumber: `SN3080Ti${getRandomInt(1000, 9999)}`,
                    pci: {
                        busId: `0000:0${getRandomInt(1, 9)}:00.0`,
                        pciBusId: 1,
                    }
                },
                temperature: {
                    maximumCritical: 93,
                    enforcedCritical: 91
                },
                memory: {
                    total: 12288 // 12 GB GDDR6X
                },
                power: {
                    defaultLimit: 320,
                    enforcedLimit: 320,
                    minimal: 100,
                    maximum: 450
                },
                clocks: {
                    minimalCore: 615,
                    enforcedCore: 1655,
                    maximumCore: 2000,
                    minimalMemory: 1000,
                    enforcedMemory: 19000,
                    maximumMemory: 21000
                }
            }, {
                uuid: randomUuid(),
                information: {
                    manufacturer: 'NVIDIA',
                    periphery: 'GeForce RTX 3070 Ti',
                    driverVersion: `${getRandomInt(1, 10)}.0.0`,
                    technology: {
                        version: 'Ampere',
                        name: 'GA104'
                    },
                    serialNumber: `SN3070Ti${getRandomInt(1000, 9999)}`,
                    pci: {
                        busId: `0000:0${getRandomInt(1, 9)}:00.0`,
                        pciBusId: 2,
                    }
                },
                temperature: {
                    maximumCritical: 93,
                    enforcedCritical: 91
                },
                memory: {
                    total: 8192 // 8 GB GDDR6X
                },
                power: {
                    defaultLimit: 290,
                    enforcedLimit: 290,
                    minimal: 100,
                    maximum: 400
                },
                clocks: {
                    minimalCore: 555,
                    enforcedCore: 1575,
                    maximumCore: 1900,
                    minimalMemory: 1000,
                    enforcedMemory: 19000,
                    maximumMemory: 21000
                }
            },
            {
                uuid: randomUuid(),
                information: {
                    manufacturer: 'NVIDIA',
                    periphery: 'GeForce RTX 3060',
                    driverVersion: `${getRandomInt(1, 10)}.0.0`,
                    technology: {
                        version: 'Ampere',
                        name: 'GA106'
                    },
                    serialNumber: `SN3060${getRandomInt(1000, 9999)}`,
                    pci: {
                        busId: `0000:0${getRandomInt(1, 9)}:00.0`,
                        pciBusId: 3,
                    }
                },
                temperature: {
                    maximumCritical: 93,
                    enforcedCritical: 91
                },
                memory: {
                    total: 12288 // 12 GB GDDR6
                },
                power: {
                    defaultLimit: 170,
                    enforcedLimit: 170,
                    minimal: 100,
                    maximum: 250
                },
                clocks: {
                    minimalCore: 515,
                    enforcedCore: 1320,
                    maximumCore: 1700,
                    minimalMemory: 700,
                    enforcedMemory: 15000,
                    maximumMemory: 17000
                }
            },
            {
                uuid: randomUuid(),
                information: {
                    manufacturer: 'AMD',
                    periphery: 'Radeon RX 580',
                    driverVersion: `${getRandomInt(1, 10)}.0.0`,
                    technology: {
                        version: 'Polaris',
                        name: 'Polaris 20'
                    },
                    serialNumber: `SNRX580${getRandomInt(1000, 9999)}`,
                    pci: {
                        busId: `0000:0${getRandomInt(1, 9)}:00.0`,
                        pciBusId: 4,
                    }
                },
                temperature: {
                    maximumCritical: 90,
                    enforcedCritical: 89
                },
                memory: {
                    total: 8192 // 8 GB GDDR5
                },
                power: {
                    defaultLimit: 185,
                    enforcedLimit: 185,
                    minimal: 100,
                    maximum: 250
                },
                clocks: {
                    minimalCore: 300,
                    enforcedCore: 1340,
                    maximumCore: 1450,
                    minimalMemory: 300,
                    enforcedMemory: 8000,
                    maximumMemory: 9000
                }
            }],
        cpu: {
            information: {
                manufacturer: 'Intel',
                modelName: 'Core i7-7700K',
                architecture: 'Kaby Lake',
                opModes: '32-bit, 64-bit',
                cores: {
                    cpus: 4,
                    threadsPerCore: 2,
                    threadsPerSocket: 8,
                    sockets: 1
                },
                cache: {
                    L1: 256, // L1 cache: 64 KB per core (32 KB instruction + 32 KB data), total 256 KB
                    L2: 1024, // L2 cache: 256 KB per core, total 1 MB
                    L3: 8192 // L3 cache: 8 MB shared
                }
            },
            clocks: {
                maximum: 4500, // Turbo Boost frequency: 4.5 GHz
                minimum: 4200 // Base frequency: 4.2 GHz
            }
        },
        motherboard: {
            "information": {
                "manufacturer": "ASUS",
                "productName": "B250 Mining Expert",
                "serialNumber": "SN68321"
            },
            "slots": {
                "sata": 4,
                "pci": 19,
                "ram": {
                    "type": "DDR4",
                    "maximumSpeed": 2400,
                    "maximumCapacity": 32
                }
            }
        },
        harddrives: [{
            uuid: randomUuid(),
            information: {
                deviceModel: "Seagate BarraCuda",
                serialNumber: `SN${getRandomInt(10000, 99999)}`,
                sataPorts: "wtf",
                capacity: 2048
            }
        }, {
            uuid: randomUuid(),
            information: {
                deviceModel: "Samsung 970 EVO Plus NVMe M.2",
                serialNumber: `SN${getRandomInt(10000, 99999)}`,
                sataPorts: "wtf",
                capacity: 1024
            }
        }],
        rams: [{
            uuid: randomUuid(),
            total: 8
        }, {
            uuid: randomUuid(),
            total: 8
        }, {
            uuid: randomUuid(),
            total: 8
        }, {
            uuid: randomUuid(),
            total: 8
        }],
        miners: [
            {
                name: 'Claymore',
                fullName: 'Claymore Dual Ethereum Miner',
                algorithms: ['ethash', 'blake2s', 'keccak'],
            },
            {
                name: 'EWBF',
                fullName: 'EWBF Cuda Equihash Miner',
                algorithms: ['equihash'],
            },
            {
                name: 'Ccminer',
                fullName: 'Ccminer for NVIDIA',
                algorithms: ['x11', 'skein', 'lyra2v2', 'neoscrypt', 'blake2s', 'keccak'],
            },
            {
                name: 'sgminer',
                fullName: 'Sgminer for AMD',
                algorithms: ['ethash', 'cryptonight', 'equihash', 'lyra2v2', 'blake2s', 'neoscrypt'],
            },
        ]
    }
}

