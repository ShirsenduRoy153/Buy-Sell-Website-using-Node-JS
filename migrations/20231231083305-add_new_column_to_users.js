'use strict';

module.exports = {
    up: async(queryInterface, Sequelize) => {
        await queryInterface.addColumn('Orders', 'profile_id', {
            type: Sequelize.STRING,
            allowNull: true,
        });
    },

    down: async(queryInterface, Sequelize) => {
        await queryInterface.removeColumn('Order', 'profile_id');
    }
};