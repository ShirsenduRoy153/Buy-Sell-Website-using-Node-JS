'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class admin extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
        }
    }
    admin.init({
        s_id: DataTypes.INTEGER,
        p_id: DataTypes.INTEGER,
        name: DataTypes.STRING,
        category: DataTypes.STRING,
        qty: DataTypes.INTEGER,
        photo: DataTypes.STRING,
        is_available: DataTypes.BOOLEAN
    }, {
        sequelize,
        tableName: 'admins',
        modelName: 'admin',
    });
    return admin;
};