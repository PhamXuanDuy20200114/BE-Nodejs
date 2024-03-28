'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        /**
         * Add seed commands here.
         *
         * Example:
         * await queryInterface.bulkInsert('People', [{
         *   name: 'John Doe',
         *   isBetaMember: false
         * }], {});
        */
        return queryInterface.bulkInsert('Users', [{
            email: 'admin@gmail.com',
            password: '123',
            firstName: 'Gau',
            lastName: 'Gau',
            address: 'Hanoi',
            phonenumber: '0123456789',
            image: 'https://www.google.com.vn/',
            gender: 1,
            roleId: 'ROLE',
            positionId: 'POSITION',

            createdAt: new Date(),
            updatedAt: new Date()
        }]);
    },

    down: async (queryInterface, Sequelize) => {
        /**
         * Add commands to revert seed here.
         *
         * Example:
         * await queryInterface.bulkDelete('People', null, {});
         */
        return queryInterface.bulkDelete('Users', null, {});
    }
};
