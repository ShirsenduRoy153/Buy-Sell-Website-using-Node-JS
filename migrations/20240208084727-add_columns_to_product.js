'use strict';

module.exports = {
    up: async(queryInterface, Sequelize) => {
        await queryInterface.addColumn('carts', 'userName', { type: Sequelize.STRING, allowNull: true });
        await queryInterface.addColumn('carts', 'userEmail', { type: Sequelize.STRING, allowNull: true });
        await queryInterface.addColumn('carts', 'userAddress', { type: Sequelize.STRING, allowNull: true });
        await queryInterface.addColumn('carts', 'userPhone', { type: Sequelize.INTEGER, allowNull: true });
        await queryInterface.addColumn('carts', 'productName', { type: Sequelize.STRING, allowNull: true });
        await queryInterface.addColumn('carts', 'category', { type: Sequelize.STRING, allowNull: true });
    },

    down: async(queryInterface, Sequelize) => {
        await queryInterface.removeColumn('carts', 'userName');
        await queryInterface.removeColumn('carts', 'userEmail');
        await queryInterface.removeColumn('carts', 'userAddress');
        await queryInterface.removeColumn('carts', 'userPhone');
        await queryInterface.removeColumn('carts', 'productName');
        await queryInterface.removeColumn('carts', 'category');
    }
};