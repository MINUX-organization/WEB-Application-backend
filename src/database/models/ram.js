import { DataTypes, Model } from "sequelize"

class RAMs extends Model {}
class RAM_EVENTs extends Model {}

export default function initRAMModels(db) {

    RAMs.init({
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
        modelName: 'RAMs'
    }),
    RAM_EVENTs.init({
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
                model: 'RAMs',
                key: 'uuid'
            }
        }
    }, {
        sequelize: db,
        modelName: 'RAM_EVENTs'
    })

    return {
        RAMs, 
        RAM_EVENTs
    }
}