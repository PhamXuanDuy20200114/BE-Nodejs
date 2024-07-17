'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      User.belongsTo(models.Allcode, { foreignKey: 'positionId', targetKey: 'keyMap', as: 'positionData' });
      User.belongsTo(models.Allcode, { foreignKey: 'gender', targetKey: 'keyMap', as: 'genderData' });

      User.hasOne(models.Markdown, { foreignKey: 'doctorId', as: 'doctorData' });
      User.hasOne(models.Doctor_info, { foreignKey: 'doctorId', as: 'doctorInfoData' });

      User.hasMany(models.Schedule, { foreignKey: 'id', targetKey: 'doctorId', as: 'scheduleData' });

      User.hasMany(models.Booking, { foreignKey: 'doctorId', as: 'doctorBookingData' });
      User.hasMany(models.Booking, { foreignKey: 'patientId', as: 'patientBookingData' });
    }
  };
  User.init({
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    firstName: DataTypes.STRING,
    lastName: DataTypes.STRING,
    address: DataTypes.STRING,
    phonenumber: DataTypes.STRING,
    image: DataTypes.STRING,
    gender: DataTypes.STRING,
    roleId: DataTypes.STRING,
    positionId: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};