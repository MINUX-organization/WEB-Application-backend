import { DataTypes, Model } from "sequelize"

class HARDDRIVEs extends Model {}
class HARDDRIVE_EVENTs extends Model {}

export default function initHarddriveModels(db) {

    HARDDRIVEs.init({
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
        modelName: 'HARDDRIVEs'
    }),
    HARDDRIVE_EVENTs.init({
        id: {
            type: DataTypes.SMALLINT,
            primaryKey: true,
            autoIncrement: true,
        },
        reason: {
            type: DataTypes.STRING(100),
        },
        level: {
            type: DataTypes.STRING(15),
        },
        harddrive_uuid: {
            type:  DataTypes.STRING(64),
            references: {
                model: 'HARDDRIVEs',
                key: 'uuid'
            }
        }
    }, {
        sequelize: db,
        modelName: 'HARDDRIVE_EVENTs'
    })

    return {
        HARDDRIVEs, 
        HARDDRIVE_EVENTs
    }
}
