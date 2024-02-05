'use strict';

module.exports = {
    up: async(queryInterface, Sequelize) => {
        // Change the data type from VARCHAR to TEXT
        await queryInterface.changeColumn('categories', 'desc', {
            type: Sequelize.TEXT,
        });
    },

    down: async(queryInterface, Sequelize) => {
        // If needed, define the rollback behavior
        await queryInterface.changeColumn('categories', 'desc', {
            type: Sequelize.STRING,
        });
    }
};