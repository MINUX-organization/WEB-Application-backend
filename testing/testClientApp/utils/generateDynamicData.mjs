import { staticData } from "../temp/staticData.mjs"

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

export default function generateDynamicData() {
    return {
        gpus: [
            {
                uuid: staticData.gpus[0].uuid,
                temperature: getRandomInt(30,70),
                fanSpeed: getRandomInt(30,100),
                isMining: true,
                hashrate: {
                    value: getRandomInt(43, 413),
                    measurement: 'Mh/s'
                },
                powerUsage: getRandomInt(20, 120),
                algorithm: 'SHA256',
                cryptocurrency: 'BTC',
                miner: {
                    uuid: '8ee41b673e4306207f69b63dc1cda9bdb010e783c79cf0a998f4e609094951e3',
                    fullName: 'lolMiner'
                },
                shares: {
                    accepted: getRandomInt(5,100),
                    rejected: getRandomInt(5,100)
                },
                memory: {
                    reserved: staticData.gpus[0].memory.total,
                    used: getRandomInt(2048, staticData.gpus[0].memory.total),
                    get free() {
                        return this.reserved - this.used;
                    }
                },
                clocks: {
                    core: getRandomInt(staticData.gpus[0].clocks.enforcedCore, staticData.gpus[0].clocks.maximumCore),
                    memory: getRandomInt(staticData.gpus[0].clocks.enforcedMemory, staticData.gpus[0].clocks.maximumMemory)
                }
            }, {
                uuid: staticData.gpus[1].uuid,
                temperature: getRandomInt(30,70),
                fanSpeed: getRandomInt(30,100),
                isMining: true,
                hashrate: {
                    value: getRandomInt(43, 413),
                    measurement: 'Mh/s'
                },
                powerUsage: getRandomInt(20, 120),
                algorithm: 'Ethash',
                cryptocurrency: 'ETH',
                miner: {
                    uuid: '4b8ea6a1124e9dc52e974c4ae9f8a9797ae3a9ce97bf1a8861a4ae494c95fb47',
                    fullName: 'T-Rex'
                },
                shares: {
                    accepted: getRandomInt(5,100),
                    rejected: getRandomInt(5,100)
                },
                memory: {
                    reserved: staticData.gpus[1].memory.total,
                    used: getRandomInt(2048, staticData.gpus[0].memory.total),
                    get free() {
                        return this.reserved - this.used;
                    }
                },
                clocks: {
                    core: getRandomInt(staticData.gpus[0].clocks.enforcedCore, staticData.gpus[1].clocks.maximumCore),
                    memory: getRandomInt(staticData.gpus[0].clocks.enforcedMemory, staticData.gpus[1].clocks.maximumMemory)
                }
            },
            {
                uuid: staticData.gpus[0].uuid,
                temperature: getRandomInt(30,70),
                fanSpeed: getRandomInt(30,100),
                isMining: true,
                hashrate: {
                    value: getRandomInt(43, 413),
                    measurement: 'Mh/s'
                },
                powerUsage: getRandomInt(20, 120),
                algorithm: 'kawpow',
                cryptocurrency: 'RVN',
                miner: {
                    uuid: '6c3c2a9a2a2b3111c575499283160d746c28a1771b9294469c729414ea8823ea',
                    fullName: 'SRB'
                },
                shares: {
                    accepted: getRandomInt(5,100),
                    rejected: getRandomInt(5,100)
                },
                memory: {
                    reserved: staticData.gpus[0].memory.total,
                    used: getRandomInt(2048, staticData.gpus[0].memory.total),
                    get free() {
                        return this.reserved - this.used;
                    }
                },
                clocks: {
                    core: getRandomInt(staticData.gpus[0].clocks.enforcedCore, staticData.gpus[0].clocks.maximumCore),
                    memory: getRandomInt(staticData.gpus[0].clocks.enforcedMemory, staticData.gpus[0].clocks.maximumMemory)
                }
            }],
        cpu: {
            uuid: staticData.cpu.uuid,
            temperature: getRandomInt(30,70),
            clockSpeed: getRandomInt(staticData.cpu.clocks.minimum, staticData.cpu.clocks.maximum),
            fanSpeed: getRandomInt(30,100),
            isMining: true,
            hashrate: {
                value: getRandomInt(43, 413),
                measurement: 'Mh/s'
            },
            powerUsage: getRandomInt(20, 120),
            algorithm: 'RandomX',
            cryptocurrency: 'Manera',
            miner: {
                uuid: '27ff37ede2ebdd4bb433131ab2dc69181571b325e5d53315ef789f8092bf1343',
                fullName: 'lolMiner'
            },
            shares: {
                accepted: getRandomInt(5,100),
                rejected: getRandomInt(5,100)
            }
        },
        harddrives: [{
            uuid: staticData.harddrives[0].uuid,
            temperature: getRandomInt(30, 70),
            capacity: staticData.harddrives[0].capacity,
            free: {
                value: getRandomInt(0, staticData.harddrives[0].capacity),
                measurement: 'GB'
            }
        }, {
            uuid: staticData.harddrives[1].uuid,
            temperature: getRandomInt(30, 70),
            capacity: staticData.harddrives[1].capacity,
            free: {
                value: getRandomInt(0, staticData.harddrives[1].capacity),
                measurement: 'GB'
            }
        }],
        rams: [{
            uuid: staticData.rams[0].uuid,
            free : {
                value: getRandomInt(1024, 8192),
                measurement: 'MB'
            }
        }, {
            uuid: staticData.rams[1].uuid,
            free : {
                value: getRandomInt(1024, 8192),
                measurement: 'MB'
            }
        }, {
            uuid: staticData.rams[2].uuid,
            free : {
                value: getRandomInt(1024, 8192),
                measurement: 'MB'
            }
        }, {
            uuid: staticData.rams[3].uuid,
            free : {
                value: getRandomInt(1024, 8192),
                measurement: 'MB'
            }
        }],
    }
}

console.log(generateDynamicData())