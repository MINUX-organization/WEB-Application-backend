export const testStaticData = {
  gpus: [
    {
      uuid: "27ff37ede2ebdd4b1343131ab2dc69181571b325e5d53315ef789f8092bf1343",
      information: {
        manufacturer: "NVIDIA",
        periphery: "GeForce RTX 3080 Ti",
        driverVersion: "9.0.0",
        technology: {
          version: "Ampere",
          name: "GA102",
        },
        serialNumber: "SN3080Ti1847",
        pci: {
          busId: "0000:05:00.0",
          pciBusId: 1,
        },
      },
      temperature: {
        maximumCritical: 93,
        enforcedCritical: 91,
      },
      memory: {
        total: 12288,
      },
      power: {
        defaultLimit: 320,
        enforcedLimit: 320,
        minimal: 100,
        maximum: 450,
      },
      clocks: {
        minimalCore: 615,
        enforcedCore: 1655,
        maximumCore: 2000,
        minimalMemory: 1000,
        enforcedMemory: 19000,
        maximumMemory: 21000,
      },
    },
    {
      uuid: "8ee41b673e4306207f69b63dc1cda9bdb010e783c79cf0a998f4e609094951e3",
      information: {
        manufacturer: "NVIDIA",
        periphery: "GeForce RTX 3070 Ti",
        driverVersion: "6.0.0",
        technology: {
          version: "Ampere",
          name: "GA104",
        },
        serialNumber: "SN3070Ti5263",
        pci: {
          busId: "0000:06:00.0",
          pciBusId: 2,
        },
      },
      temperature: {
        maximumCritical: 93,
        enforcedCritical: 91,
      },
      memory: {
        total: 8192,
      },
      power: {
        defaultLimit: 290,
        enforcedLimit: 290,
        minimal: 100,
        maximum: 400,
      },
      clocks: {
        minimalCore: 555,
        enforcedCore: 1575,
        maximumCore: 1900,
        minimalMemory: 1000,
        enforcedMemory: 19000,
        maximumMemory: 21000,
      },
    },
    {
      uuid: "04af2597bcac8c9169ff93adf5851e487f36330c39623e6293a3e49d828c0ea4",
      information: {
        manufacturer: "NVIDIA",
        periphery: "GeForce RTX 3060",
        driverVersion: "6.0.0",
        technology: {
          version: "Ampere",
          name: "GA106",
        },
        serialNumber: "SN30603790",
        pci: {
          busId: "0000:07:00.0",
          pciBusId: 3,
        },
      },
      temperature: {
        maximumCritical: 93,
        enforcedCritical: 91,
      },
      memory: {
        total: 12288,
      },
      power: {
        defaultLimit: 170,
        enforcedLimit: 170,
        minimal: 100,
        maximum: 250,
      },
      clocks: {
        minimalCore: 515,
        enforcedCore: 1320,
        maximumCore: 1700,
        minimalMemory: 700,
        enforcedMemory: 15000,
        maximumMemory: 17000,
      },
    },
    {
      uuid: "6c3c2a9a2a2b3111c575499283160d746c28a1771b9294469c729414ea8823ea",
      information: {
        manufacturer: "AMD",
        periphery: "Radeon RX 580",
        driverVersion: "1.0.0",
        technology: {
          version: "Polaris",
          name: "Polaris 20",
        },
        serialNumber: "SNRX5803738",
        pci: {
          busId: "0000:03:00.0",
          pciBusId: 4,
        },
      },
      temperature: {
        maximumCritical: 90,
        enforcedCritical: 89,
      },
      memory: {
        total: 8192,
      },
      power: {
        defaultLimit: 185,
        enforcedLimit: 185,
        minimal: 100,
        maximum: 250,
      },
      clocks: {
        minimalCore: 300,
        enforcedCore: 1340,
        maximumCore: 1450,
        minimalMemory: 300,
        enforcedMemory: 8000,
        maximumMemory: 9000,
      },
    },
  ],
  cpu: {
    uuid: "4b8ea6a1124e9dc23d666c4ae9f8a9797ae3a9ce97bf1a8861a4ae494c95fb47",
    information: {
      manufacturer: "Intel",
      modelName: "Core i7-7700K",
      architecture: "Kaby Lake",
      opModes: "32-bit, 64-bit",
      cores: {
        cpus: 4,
        threadsPerCore: 2,
        threadsPerSocket: 8,
        sockets: 1,
      },
      cache: {
        L1: 256,
        L2: 1024,
        L3: 8192,
      },
    },
    clocks: {
      maximum: 4500,
      minimum: 4200,
    },
  },
  motherboard: {
    information: {
      manufacturer: "ASUS",
      productName: "B250 Mining Expert",
      serialNumber: "SN68321",
    },
    slots: {
      sata: 4,
      pci: 19,
      ram: {
        type: "DDR4",
        maximumSpeed: 2400,
        maximumCapacity: 32,
      },
    },
  },
  harddrives: [
    {
      uuid: "c9d35fdf862b2ca25b2d746c26bef702f170532b01e4246b9069be73fb4b30af",
      information: {
        deviceModel: "Seagate BarraCuda",
        serialNumber: "SN58228",
        sataPorts: "wtf",
        capacity: 2048,
      },
    },
    {
      uuid: "dd59aace861088f4b4c9b63d7de54916bdd7c68414dba053f9bafde660be5b6f",
      information: {
        deviceModel: "Samsung 970 EVO Plus NVMe M.2",
        serialNumber: "SN98003",
        sataPorts: "wtf",
        capacity: 1024,
      },
    },
  ],
  rams: [
    {
      uuid: "7bffef3d137480ec11d750a498f51a006ce33192a5731b091970baf7b4763508",
      total: 8,
    },
    {
      uuid: "f3d1edd95d3cb47c2e354188e2b00a27ed44b119f482a0b2a1a655794d4b803f",
      total: 8,
    },
    {
      uuid: "53e971c86a1e10e6cf54d883b8e9311cd5b160b922d17b042a84b366b8fd57dd",
      total: 8,
    },
    {
      uuid: "e9d5947a6857c44026b61d0816085073f22ed685da78f6624b37cc78f2927831",
      total: 8,
    },
  ],
  miners: [
    {
      name: "Claymore",
      fullName: "Claymore Dual Ethereum Miner",
      algorithms: ["ethash", "blake2s", "keccak"],
    },
    {
      name: "EWBF",
      fullName: "EWBF Cuda Equihash Miner",
      algorithms: ["equihash"],
    },
    {
      name: "Ccminer",
      fullName: "Ccminer for NVIDIA",
      algorithms: ["x11", "skein", "lyra2v2", "neoscrypt", "blake2s", "keccak"],
    },
    {
      name: "sgminer",
      fullName: "Sgminer for AMD",
      algorithms: [
        "ethash",
        "cryptonight",
        "equihash",
        "lyra2v2",
        "blake2s",
        "neoscrypt",
      ],
    },
  ],
  systemInfo: {
    linux: "Linux 6.2.14",
    technologies: {
      versions: {
        opencl: "3.0",
        cuda: "8.6",
      },
    },
    drivers: {
      versions: {
        amd: "510.60.02",
        nvidia: "510.60.02",
      },
    },
    minuxVersion: "0.1",
    localIp: "192.168.1.2",
    macAddress: "8F:23:91:0C:0A:2F",
  },
};
