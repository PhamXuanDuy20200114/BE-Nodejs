import { where } from 'sequelize';
import db from '../models/index';

const createNewSpecialty = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data || !data.name || !data.descriptionHTML || !data.descriptionMarkdown || !data.image) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameters'
                });
            }
            await db.Specialty.create({
                name: data.name,
                descriptionHTML: data.descriptionHTML,
                descriptionMarkdown: data.descriptionMarkdown,
                image: data.image
            });
            resolve({
                errCode: 0,
                message: 'Save specialty success'
            });
        } catch (e) {
            console.log('error: ', e);
            return res.status(500).json({
                errCode: -1,
                message: 'Error from server'
            });
        }
    });
}

const getAllSpecialties = () => {
    return new Promise(async (resolve, reject) => {
        try {
            let data = await db.Specialty.findAll();
            if (data && data.length > 0) {
                resolve({
                    errCode: 0,
                    data
                });
            } else {
                resolve({
                    errCode: 1,
                    errMessage: 'Cannot find any specialty'
                });
            }
        } catch (e) {
            console.log('error: ', e);
            return res.status(500).json({
                errCode: -1,
                message: 'Error from server'
            });
        }
    });
}

const getDetailSpecialty = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!id) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameters'
                });
            }
            let data = await db.Specialty.findOne({
                where: { id: id },
            });
            if (data) {
                resolve({
                    errCode: 0,
                    data
                });
            } else {
                resolve({
                    errCode: 1,
                    errMessage: 'Cannot find any specialty'
                });
            }
        } catch (e) {
            reject(e);
        }
    })
}

module.exports = {
    createNewSpecialty: createNewSpecialty,
    getAllSpecialties: getAllSpecialties,
    getDetailSpecialty: getDetailSpecialty,
}