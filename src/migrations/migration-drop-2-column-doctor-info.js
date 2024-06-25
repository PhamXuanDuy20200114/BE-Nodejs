module.exports = {
    up: (queryInterface, Sequelize) => {
        return Promise.all([
            queryInterface.removeColumn('Doctor_infos', 'clinicName'),
            queryInterface.removeColumn('Doctor_infos', 'addressClinic')
        ]);
    },
    down: (queryInterface, Sequelize) => {
        return Promise.all([
            queryInterface.dropTable(
                'Doctor_infos'
            )
        ]);
    }
};