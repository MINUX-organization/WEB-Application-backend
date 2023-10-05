import { DataTypes, Model } from "sequelize"

class GPUs extends Model {}
class GPU_PRESETs extends Model {}
class GPU_EVENTs extends Model {}
class GPU_GRAPHs extends Model {}
class GPU_SETUPs extends Model {}

class FLIGHT_SHEETs extends Model {}

export default function initGPUModels(db) {

    GPUs.init({
        id: {
            type: DataTypes.SMALLINT,
            primaryKey: true,
            autoIncrement: true,
        },
        uuid: {
            type: DataTypes.STRING(64),
            unique: true
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
        memory_clock: {
            type: DataTypes.SMALLINT,
        },
        core_clock: {
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
        memory_clock: {
            type: DataTypes.SMALLINT,
            defaultValue: -1
        },
        core_clock: {
            type: DataTypes.SMALLINT,
            defaultValue: -1
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
    }, {
        sequelize: db,
        modelName: 'FLIGHT_SHEETs'
    })

    return {
        FLIGHT_SHEETs, 
        GPUs, 
        GPU_PRESETs, 
        GPU_EVENTs, 
        GPU_GRAPHs, 
        GPU_SETUPs
    }
}