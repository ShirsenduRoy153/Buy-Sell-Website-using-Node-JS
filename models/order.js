'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Order extends Model {
        static associate(models) {}
    }
    Order.init({
        orderId: DataTypes.INTEGER,
        productId: DataTypes.INTEGER,
        productName: DataTypes.STRING,
        quantity: DataTypes.INTEGER,
        profile_id: DataTypes.INTEGER
    }, {
        sequelize,
        modelName: 'Order',
    });
    return Order;
};