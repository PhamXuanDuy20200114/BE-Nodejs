const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('hoidanit', 'root', null, {
    host: 'localhost',
    dialect: 'mysql',
    port: 3306,
    logging: false,
    // pool: {
    //     max: 5,
    //     min: 0,
    //     idle: 10000
    // },
});

let connectDB = async () => {
    try {
        await sequelize.authenticate();
        console.log('Connection has been established successfully.');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
}

module.exports = connectDB;