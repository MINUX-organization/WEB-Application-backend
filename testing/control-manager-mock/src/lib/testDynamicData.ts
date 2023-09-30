import { v4 as uuidv4 } from 'uuid'

export const testDynamicData = {
  state: {
    mining: true,
  },
  gpus: [
    {
      uuid: uuidv4(),
      temperature: Math.floor(Math.random() * (100 - 30) + 30),
      fanSpeed: Math.floor(Math.random() * (100 - 30) + 30),
      hashrate: {
        value: Math.floor(Math.random() * (120 - 15) + 15),
        measurement: "Mh",
      },
      powerUsage: Math.floor(Math.random() * (100 - 30) + 30),
      algorithm: "MD5",
      cryptocurrency: "ETH",
      miner: {
        uuid: uuidv4(),
        fullName: "lolMiner",
      },
      shares: {
        accepted: Math.floor(Math.random() * (100 - 1) + 1),
        rejected: Math.floor(Math.random() * (100 - 1) + 1),
      },
      memory: {
        reserved: Math.floor(Math.random() * (8912 - 4096) + 4096),
        used: Math.floor(Math.random() * (4096 - 2048) + 4096),
        get free() {
          return this.reserved - this.used;
        },
      },
      clocks: {
        core: Math.floor(Math.random() * (3000 - 1000) + 1000),
        memory: Math.floor(Math.random() * (3000 - 1000) + 1000),
      },
    },
    {
      uuid: uuidv4(),
      temperature: Math.floor(Math.random() * (100 - 30) + 30),
      fanSpeed: Math.floor(Math.random() * (100 - 30) + 30),
      hashrate: {
        value: Math.floor(Math.random() * (120 - 15) + 15),
        measurement: "Mh",
      },
      powerUsage: Math.floor(Math.random() * (100 - 30) + 30),
      algorithm: "MD5",
      cryptocurrency: "ETH",
      miner: {
        uuid: uuidv4(),
        fullName: "lolMiner",
      },
      shares: {
        accepted: Math.floor(Math.random() * (100 - 1) + 1),
        rejected: Math.floor(Math.random() * (100 - 1) + 1),
      },
      memory: {
        reserved: Math.floor(Math.random() * (8912 - 4096) + 4096),
        used: Math.floor(Math.random() * (4096 - 2048) + 4096),
        get free() {
          return this.reserved - this.used;
        },
      },
      clocks: {
        core: Math.floor(Math.random() * (3000 - 1000) + 1000),
        memory: Math.floor(Math.random() * (3000 - 1000) + 1000),
      },
    },
    {
      uuid: uuidv4(),
      temperature: Math.floor(Math.random() * (100 - 30) + 30),
      fanSpeed: Math.floor(Math.random() * (100 - 30) + 30),
      hashrate: {
        value: Math.floor(Math.random() * (120 - 15) + 15),
        measurement: "Mh",
      },
      powerUsage: Math.floor(Math.random() * (100 - 30) + 30),
      algorithm: "MD5",
      cryptocurrency: "BTC",
      miner: {
        uuid: uuidv4(),
        fullName: "lolMiner",
      },
      shares: {
        accepted: Math.floor(Math.random() * (100 - 1) + 1),
        rejected: Math.floor(Math.random() * (100 - 1) + 1),
      },
      memory: {
        reserved: Math.floor(Math.random() * (8912 - 4096) + 4096),
        used: Math.floor(Math.random() * (4096 - 2048) + 4096),
        get free() {
          return this.reserved - this.used;
        },
      },
      clocks: {
        core: Math.floor(Math.random() * (3000 - 1000) + 1000),
        memory: Math.floor(Math.random() * (3000 - 1000) + 1000),
      },
    },
  ],
  cpu: {
    uuid: uuidv4(),
    temperature: Math.floor(Math.random() * (100 - 30) + 30),
    clockSpeed: Math.floor(Math.random() * (3000 - 2000) + 2000),
    fanSpeed: Math.floor(Math.random() * (100 - 1) + 1),
    hashrate: {
      value: Math.floor(Math.random() * (120 - 15) + 15),
      measurement: "Mh",
    },
    powerUsage: Math.floor(Math.random() * (100 - 30) + 30),
    algorithm: "MD5",
    cryptocurrency: "BTC",
    miner: {
      uuid: uuidv4(),
      fullName: "lolMiner",
    },
    shares: {
      accepted: Math.floor(Math.random() * (100 - 1) + 1),
      rejected: Math.floor(Math.random() * (100 - 1) + 1),
    },
  },
  harddrives: [
    {
      uuid: uuidv4(),
      temperature: Math.floor(Math.random() * (100 - 30) + 30),
      capacity: Math.floor(Math.random() * (10240 - 2048) + 2048),
      free: {
        value: Math.floor(Math.random() * (10240 - 2048) + 2048),
        measurement: "gb",
      },
    },
  ],
  rams: [
    {
      uuid: uuidv4(),
      free: {
        value: Math.floor(Math.random() * (16 - 1) + 1),
        measurement: "gb",
      },
    },
  ],
};
