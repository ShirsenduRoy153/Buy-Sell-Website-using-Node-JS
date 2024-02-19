'use strict';

module.exports = {
    up: async(queryInterface, Sequelize) => {
        // Remove the column
        await queryInterface.removeColumn('carts', 'productName');
    },

    down: async(queryInterface, Sequelize) => {
        // If needed, define the rollback behavior
        await queryInterface.addColumn('carts', 'productName', {
            type: Sequelize.TEXT,
        });
    }
};