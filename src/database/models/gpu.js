import { DataTypes, Model } from "sequelize"

class GPUs extends Model {}
class GPU_PRESETs extends Model {}
class GPU_EVENTs extends Model {}
class GPU_GRAPHs extends Model {}
class GPU_SETUPs extends Model {}

class FLIGHT_SHEETs extends Model {}
class FLIGHT_SHEETs_WITH_CUSTOM_MINER extends Model {}

export default function initGPUModels(db) {

    GPUs.init({
        id: {
            type: DataTypes.SMALLINT,
            primaryKey: true,
            autoIncrement: true,
        },
        connected: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
            allowNull: false
        },
        uuid: {
            type: DataTypes.STRING(64),
            unique: true,
            allowNull: false
        },
        manufacturer: {
            type: DataTypes.STRING(128),
            allowNull: false
        },
        periphery: {
            type: DataTypes.STRING(128),
            allowNull: false
        },
        driverVersion: {
            type: DataTypes.STRING(32),
        },
        technologyVersion: {
            type: DataTypes.STRING(128),
        },
        technologyName: {
            type: DataTypes.STRING(128),
        },
        serialNumber: {
            type: DataTypes.STRING(128)
        },
        pciBusId: {
            type: DataTypes.STRING(128)
        },
        pciPciBusId: {
            type: DataTypes.STRING(128)
        },
        temperatureMaximumCritical: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        memoryTotal: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        powerDefaultLimit: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        powerMinimal: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        powerMaximum: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        clocksMinimalCoreOffset: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        clocksMaximumCoreOffset: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        clocksMinimalMemoryOffset: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        clocksMaximumMemoryOffset: {
            type: DataTypes.INTEGER,
            allowNull: false
        }
    }, {
        sequelize: db,
        modelName: 'GPUs'
    }),
    GPU_PRESETs.init({
        id: {
            type: DataTypes.SMALLINT,
            primaryKey: true,
            autoIncrement: true,
        },
        name: {
            type: DataTypes.STRING(128),
        },
        memory_clock_offset: {
            type: DataTypes.SMALLINT,
        },
        core_clock_offset: {
            type: DataTypes.SMALLINT,
        },
        power_limit: {
            type: DataTypes.SMALLINT,
        },
        crit_temp: {
            type: DataTypes.SMALLINT,
        },
        fan_speed: {
            type: DataTypes.SMALLINT,
        },
        gpu_uuid: {
            type: DataTypes.STRING(64),
            references: {
                model: 'GPUs',
                key: 'uuid'
            }
        }
    }, {
        sequelize: db,
        modelName: 'GPU_PRESETs'
    }),
    GPU_EVENTs.init({
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        reason: {
            type: DataTypes.STRING(100),
        },
        level: {
            type: DataTypes.STRING(15),
        },
        gpu_uuid: {
            type:  DataTypes.STRING(64),
            references: {
                model: 'GPUs',
                key: 'uuid'
            }
        }
    }, {
        sequelize: db,
        modelName: 'GPU_EVENTs'
    }),
    GPU_GRAPHs.init({
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        hashrate: {
            type: DataTypes.BIGINT,
        },
        power: {
            type: DataTypes.SMALLINT,
        },
        temp: {
            type: DataTypes.SMALLINT,
        },
        algorithm: {
            type: DataTypes.STRING(30),
        },
        cryptocurrency: {
            type: DataTypes.STRING(30),
        },
        gpu_uuid: {
            type:  DataTypes.STRING(64),
            references: {
                model: 'GPUs',
                key: 'uuid'
            }
        }
    }, {
        sequelize: db,
        modelName: 'GPU_GRAPHs'
    }),
    GPU_SETUPs.init({
        id: {
            type: DataTypes.SMALLINT,
            primaryKey: true,
            autoIncrement: true,
        },
        memory_clock_offset: {
            type: DataTypes.SMALLINT,
            defaultValue: 0
        },
        core_clock_offset: {
            type: DataTypes.SMALLINT,
            defaultValue: 0
        },
        power_limit: {
            type: DataTypes.SMALLINT,
            defaultValue: -1
        },
        fan_speed: {
            type: DataTypes.SMALLINT,
            defaultValue: 30
        },
        crit_temp: {
            type: DataTypes.SMALLINT,
            defaultValue: -1,
        },
        gpu_uuid: {
            type:  DataTypes.STRING(64),
            references: {
                model: 'GPUs',
                key: 'uuid'
            }
        },
        flight_sheet_id: {
            type: DataTypes.SMALLINT,
            references: {
                model: 'FLIGHT_SHEETs',
                key: 'id'
            },
            allowNull: true
        },
        flight_sheet_id_with_custom_miner: {
            type: DataTypes.SMALLINT,
            references: {
                model: 'FLIGHT_SHEETs_WITH_CUSTOM_MINER',
                key: 'id'
            },
            allowNull: true
        },
        isCustomMiner: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        }
    }, {
        sequelize: db,
        modelName: 'GPU_SETUPs',
        freezeTableName: true,
    }),
    FLIGHT_SHEETs.init({
        id: {
            type: DataTypes.SMALLINT,
            primaryKey: true,
            autoIncrement: true,
        },
        name: {
            type: DataTypes.STRING(128),
        },
        cryptocurrency_id: {
            type: DataTypes.SMALLINT,
            references: {
                model: 'CRYPTOCURRENCIEs',
                key: 'id'
            }   
        },
        miner_id: {
            type: DataTypes.SMALLINT,
            references: {
                model: 'MINERs',
                key: 'id'
            }
        },
        wallet_id: {
            type: DataTypes.SMALLINT,
            references: {
                model: 'WALLETs',
                key: 'id'
            }
        },
        pool_id: {
            type: DataTypes.SMALLINT,
            references: {
                model: 'POOLs',
                key: 'id'
            }
        },
        additional_string: {
            type: DataTypes.TEXT
        }
    }, {
        sequelize: db,
        modelName: 'FLIGHT_SHEETs'
    })
    FLIGHT_SHEETs_WITH_CUSTOM_MINER.init({
        id: {
            type: DataTypes.SMALLINT,
            primaryKey: true,
            autoIncrement: true,
        },
        name: {
            type: DataTypes.TEXT
        },
        installation_url: {
            type: DataTypes.TEXT
        },
        wallet: {
            type: DataTypes.TEXT
        },
        pool: {
            type: DataTypes.TEXT
        },
        coin: {
            type: DataTypes.TEXT
        },
        algorithm: {
            type: DataTypes.TEXT
        },
        pool_template: {
            type: DataTypes.TEXT
        },
        wallet_and_worker_template: {
            type: DataTypes.TEXT
        },
        extra_config_arguments: {
            type: DataTypes.TEXT
        }
    }, {
        sequelize: db,
        modelName: 'FLIGHT_SHEETs_WITH_CUSTOM_MINER',
        freezeTableName: true
    })

    return {
        FLIGHT_SHEETs,
        FLIGHT_SHEETs_WITH_CUSTOM_MINER, 
        GPUs, 
        GPU_PRESETs, 
        GPU_EVENTs, 
        GPU_GRAPHs, 
        GPU_SETUPs
    }
}