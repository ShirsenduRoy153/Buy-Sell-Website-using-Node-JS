'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class admin_jackets extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  admin_jackets.init({
    p_id: DataTypes.INTEGER,
    p_name: DataTypes.STRING,
    category: DataTypes.STRING,
    qty: DataTypes.INTEGER,
    photo: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'admin_jackets',
  });
  return admin_jackets;
};