import { DataTypes, Model } from "sequelize"

class USER extends Model {}
class RECOVERY_CODEs extends Model {}
class SESSION_TOKENs extends Model {}

class CRYPTOCURRENCIEs extends Model {}
class POOLs extends Model {}
class WALLETs extends Model {}

class ALGORITHMs extends Model {}
class ALGORITHM_MINER extends Model {}
class MINERs extends Model {}

class FARM_STATE extends Model {}


export default function initOtherModels(db) {

    USER.init({
        id: {
            type: DataTypes.SMALLINT,
            primaryKey: true,
            autoIncrement: true,
        },
        name: {
            type: DataTypes.STRING(128),
            defaultValue: "minux"
        },
        password: {
            type: DataTypes.STRING(128),
            defaultValue: "minux"
        }
    }, {
        sequelize: db,
        modelName: 'USER',
        freezeTableName: true,
    }),
    RECOVERY_CODEs.init({
        id: {
            type: DataTypes.SMALLINT,
            primaryKey: true,
            autoIncrement: true,
        },
        code: {
            type: DataTypes.STRING(16),
        },
        used: {
            type: DataTypes.BOOLEAN,
        }
    }, {
        sequelize: db,
        modelName: 'RECOVERY_CODEs',
    }),
    SESSION_TOKENs.init({
        id: {
            type: DataTypes.SMALLINT,
            primaryKey: true,
            autoIncrement: true,
        },
        token: {
            type: DataTypes.STRING(128),
        },
        expires: {
            type: DataTypes.DATE,
        },
        user_id: {
            type: DataTypes.SMALLINT,
            references: {
                model: 'USER',
                key: 'id'
            }
        } 
    }, {
        sequelize: db,
        modelName: 'SESSION_TOKENs',
    })
    CRYPTOCURRENCIEs.init({
        id: {
            type: DataTypes.SMALLINT,
            primaryKey: true,
            autoIncrement: true,
        },
        name: {
            type: DataTypes.STRING(15),
        },
        full_name: {
            type: DataTypes.STRING(128),
        },
        algorithm_id: {
            type: DataTypes.SMALLINT,
            references: {
                model: 'ALGORITHMs',
                key: 'id'
            }
        }
    }, {
        sequelize: db,
        modelName: 'CRYPTOCURRENCIEs'
    }),
    POOLs.init({
        id: {
            type: DataTypes.SMALLINT,
            primaryKey: true,
            autoIncrement: true,
        },
        host: {
            type: DataTypes.STRING(128),
        },
        port: {
            type: DataTypes.INTEGER,
        },
        cryptocurrency_id: {
            type: DataTypes.SMALLINT,
            references: {
                model: 'CRYPTOCURRENCIEs',
                key: 'id'
            }
        }
    }, {
        sequelize: db,
        modelName: 'POOLs'
    }),
    WALLETs.init({
        id: {
            type: DataTypes.SMALLINT,
            primaryKey: true,
            autoIncrement: true,
        },
        name: {
            type: DataTypes.STRING(128),
        },
        source: {
            type: DataTypes.STRING(128),
        },
        address: {
            type: DataTypes.STRING(128),
        },
        cryptocurrency_id: {
            type: DataTypes.SMALLINT,
            references: {
                model: 'CRYPTOCURRENCIEs',
                key: 'id'
            }
        }
    }, {
        sequelize: db,
        modelName: 'WALLETs'
    }),
    ALGORITHMs.init({
        id: {
            type: DataTypes.SMALLINT,
            primaryKey: true,
            autoIncrement: true,
        },
        name: {
            type: DataTypes.STRING(128),
        },
    }, {
        sequelize: db,
        modelName: 'ALGORITHMs'
    }),
    ALGORITHM_MINER.init({
        id: {
            type: DataTypes.SMALLINT,
            primaryKey: true,
            autoIncrement: true
        },
        algorithm_id: {
            type: DataTypes.SMALLINT,
            references: {
                model: 'ALGORITHMs',
                key: 'id'
            }
        },
        miner_id: {
            type: DataTypes.SMALLINT,
            references: {
                model: 'MINERs',
                key: 'id'
            }
        }
    }, {
        sequelize: db,
        modelName: 'ALGORITHM_MINER'
    }),
    MINERs.init({
        id: {
            type: DataTypes.SMALLINT,
            primaryKey: true,
            autoIncrement: true
        },
        name: {
            type: DataTypes.STRING(128)
        },
        full_name: {
            type: DataTypes.STRING(128)
        } 
    }, {
        sequelize: db,
        modelName: 'MINERs'
    })
    FARM_STATE.init({
        id: { 
            type: DataTypes.SMALLINT,
            primaryKey: true,
            autoIncrement: true
        },
        mining: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        }
    }, {
        sequelize: db,
        modelName: 'FARM_STATE',
        freezeTableName: true,
        timestamps: false
    })

    return {
        USER,
        SESSION_TOKENs, 
        RECOVERY_CODEs, 
        CRYPTOCURRENCIEs, 
        POOLs, 
        WALLETs, 
        MINERs, 
        ALGORITHMs,
        ALGORITHM_MINER,
        MINERs,
        FARM_STATE
    }
}
