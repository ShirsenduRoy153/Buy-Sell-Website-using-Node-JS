'use strict';
module.exports = {
    up: async(queryInterface, Sequelize) => {
        await queryInterface.addColumn('admins', 'is_available', {
            type: Sequelize.BOOLEAN,
            allowNull: true,
        });
    },
    down: async(queryInterface, Sequelize) => {
        await queryInterface.dropTable('admins');
    }
};