'use strict';
module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('clinics', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            name: {
                type: Sequelize.STRING
            },
            address: {
                type: Sequelize.STRING
            },
            introHTML: {
                type: Sequelize.TEXT('long')
            },
            introMarkdown: {
                type: Sequelize.TEXT('long')
            },
            expertiseHTML: {
                type: Sequelize.TEXT('long')
            },
            expertiseMarkdown: {
                type: Sequelize.TEXT('long')
            },
            equipmentHTML: {
                type: Sequelize.TEXT('long')
            },
            equipmentMarkdown: {
                type: Sequelize.TEXT('long')
            },
            processHTML: {
                type: Sequelize.TEXT('long')
            },
            processMarkdown: {
                type: Sequelize.TEXT('long')
            },
            priceHTML: {
                type: Sequelize.TEXT('long')
            },
            priceMarkdown: {
                type: Sequelize.TEXT('long')
            },
            imageLogo: {
                type: Sequelize.BLOB('long')
            },
            imageBackground: {
                type: Sequelize.BLOB('long')
            },
            createdAt: {
                allowNull: false,
                type: Sequelize.DATE
            },
            updatedAt: {
                allowNull: false,
                type: Sequelize.DATE
            }
        });
    },
    down: async (queryInterface, Sequelize) => {
        await queryInterface.dropTable('clinics');
    }
};