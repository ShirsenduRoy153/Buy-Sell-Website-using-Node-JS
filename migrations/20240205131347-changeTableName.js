module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.renameTable('admin_registrations', 'admins');
    },

    down: (queryInterface, Sequelize) => {
        return queryInterface.renameTable('admins', 'admin_registrations');
    }
};