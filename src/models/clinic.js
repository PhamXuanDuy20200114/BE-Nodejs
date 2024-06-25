'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Clinic extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            Clinic.hasMany(models.Doctor_info, { foreignKey: 'clinicId', as: 'clinicData' });
        }
    };
    Clinic.init({
        name: DataTypes.STRING,
        address: DataTypes.STRING,
        introHTML: DataTypes.TEXT('long'),
        introMarkdown: DataTypes.TEXT('long'),
        expertiseHTML: DataTypes.TEXT('long'),
        expertiseMarkdown: DataTypes.TEXT('long'),
        equipmentHTML: DataTypes.TEXT('long'),
        equipmentMarkdown: DataTypes.TEXT('long'),
        processHTML: DataTypes.TEXT('long'),
        processMarkdown: DataTypes.TEXT('long'),
        priceHTML: DataTypes.TEXT('long'),
        priceMarkdown: DataTypes.TEXT('long'),
        imageLogo: DataTypes.BLOB('long'),
        imageBackground: DataTypes.BLOB('long'),
    }, {
        sequelize,
        modelName: 'Clinic',
    });
    return Clinic;
};