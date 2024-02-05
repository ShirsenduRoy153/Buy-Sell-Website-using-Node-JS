'use strict';

module.exports = {
    up: async(queryInterface, Sequelize) => {
        // Remove the column
        await queryInterface.removeColumn('products', 'desc_new');
    },

    down: async(queryInterface, Sequelize) => {
        // If needed, define the rollback behavior
        await queryInterface.addColumn('products', 'desc_new', {
            type: Sequelize.TEXT,
        });
    }
};