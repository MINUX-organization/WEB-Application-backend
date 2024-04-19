import { DataTypes, Model } from "sequelize"

class CPUs extends Model { }
class CPU_EVENTs extends Model { }
class CPU_GRAPHs extends Model { }
class CPU_SETUPs extends Model { }
class FLIGHT_SHEETs_WITH_CPU extends Model { }

export default function initCPUModels(db) {

    CPUs.init({
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
        modelName: 'CPUs'
    }),
        CPU_EVENTs.init({
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            reason: {
                type: DataTypes.STRING(100),
            },
            level: {
                type: DataTypes.STRING(15)
            },
            cpu_uuid: {
                type: DataTypes.STRING(64),
                references: {
                    model: 'CPUs',
                    key: 'uuid'
                }
            }
        }, {
            sequelize: db,
            modelName: 'CPU_EVENTs'
        }),
        CPU_GRAPHs.init({
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
            cpu_uuid: {
                type: DataTypes.STRING(64),
                references: {
                    model: 'CPUs',
                    key: 'uuid'
                }
            }
        }, {
            sequelize: db,
            modelName: 'CPU_GRAPHs'
        }),
        CPU_SETUPs.init({
            id: {
                type: DataTypes.SMALLINT,
                primaryKey: true,
                autoIncrement: true,
            },
            fan_speed: {
                type: DataTypes.SMALLINT,
                defaultValue: 30
            },
            cryptocurrency_id: {
                type: DataTypes.SMALLINT,
                references: {
                    model: 'CRYPTOCURRENCIEs',
                    key: 'id'
                },
                allowNull: true
            },
            miner_id: {
                type: DataTypes.SMALLINT,
                references: {
                    model: 'MINERs',
                    key: 'id'
                },
                allowNull: true
            },
            cpu_uuid: {
                type: DataTypes.STRING(64),
                references: {
                    model: 'CPUs',
                    key: 'uuid'
                }
            },
            flight_sheet_id: {
                type: DataTypes.SMALLINT,
                references: {
                    model: 'FLIGHT_SHEETs_WITH_CPU',
                    key: 'id'
                },
                allowNull: true
            },
        }, {
            sequelize: db,
            modelName: 'CPU_SETUPs',
            freezeTableName: true
        })
    FLIGHT_SHEETs_WITH_CPU.init({
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
        },
        huge_pages: {
            type: DataTypes.INTEGER
        }
    }, {
        sequelize: db,
        modelName: 'FLIGHT_SHEETs_WITH_CPU',
        freezeTableName: true
    });

    return {
        CPUs,
        CPU_EVENTs,
        CPU_GRAPHs,
        CPU_SETUPs,
        FLIGHT_SHEETs_WITH_CPU
    }
}