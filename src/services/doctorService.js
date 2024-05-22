import { raw } from 'body-parser';
import db from '../models/index';
import { where } from 'sequelize';

let getTopDoctorHome = (limitInput) => {
    return new Promise(async (resolve, reject) => {
        try {
            let users = await db.User.findAll({
                limit: limitInput,
                where: { roleId: 'R2' },
                order: [['createdAt', 'DESC']],
                attributes: {
                    exclude: ['password']
                },
                include: [
                    { model: db.Allcode, as: 'positionData', attributes: ['valueVi', 'valueEn'] },
                    { model: db.Allcode, as: 'genderData', attributes: ['valueVi', 'valueEn'] }
                ],
                raw: false,
                nest: true
            });

            resolve({
                errCode: 0,
                data: users
            });
        } catch (e) {
            reject(e);
        }
    })
}

const getAllDoctors = () => {
    return new Promise(async (resolve, reject) => {
        try {
            console.log('Check here')
            let data = await db.User.findAll({
                where: { roleId: 'R2' },
                attributes: {
                    exclude: ['password', 'image']
                },
            })
            resolve({
                errCode: 0,
                data: data
            });
        } catch (e) {
            console.log('error:', e);
            reject(e);
        }
    })
}

const saveDetailInfoDoctor = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.doctorId || !data.contentHTML || !data.contentMarkdown) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameters'
                })
            }
            else {
                await db.Markdown.create({
                    doctorId: data.doctorId,
                    contentHTML: data.contentHTML,
                    contentMarkdown: data.contentMarkdown,
                    description: data.description ? data.description : '',
                })
                resolve({
                    errCode: 0,
                    message: 'Save info doctor success'
                })
            }

        } catch (e) {
            console.log('error:', e);
            reject(e);
        }
    });
}

const getDetailInfoDoctorById = (doctorId) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!doctorId) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameters'
                })
            } else {
                let data = await db.User.findOne({
                    where: { id: doctorId },
                    attributes: {
                        exclude: ['password']
                    },
                    include: [
                        { model: db.Allcode, as: 'positionData', attributes: ['valueVi', 'valueEn'] },
                        { model: db.Allcode, as: 'genderData', attributes: ['valueVi', 'valueEn'] },
                        { model: db.Markdown, as: 'doctorData' }
                    ],
                    raw: false,
                    nest: true
                })
                if (data && data.image) {
                    data.image = new Buffer(data.image, 'base64').toString('binary');
                }
                if (!data) {
                    data = {};
                }
                resolve({
                    errCode: 0,
                    data: data
                })
            }
        } catch (e) {
            console.log('error:', e);
            reject(e);
        }
    })
}

const updateDetailInfoDoctor = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.doctorId || !data.contentHTML || !data.contentMarkdown) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameters'
                })
            } else {
                let doctor = await db.Markdown.findOne({
                    where: {
                        doctorId: data.doctorId
                    },
                    raw: false
                })
                doctor.contentHTML = data.contentHTML;
                doctor.contentMarkdown = data.contentMarkdown;
                doctor.description = data.description ? data.description : '';
                doctor.updateAt = new Date();
                await doctor.save();
                resolve({
                    errCode: 0,
                    message: 'Update info doctor success'
                })
            }
        } catch (e) {
            console.log('error:', e);
            reject(e);
        }
    })
}

module.exports = {
    getTopDoctorHome: getTopDoctorHome,
    getAllDoctors: getAllDoctors,
    saveDetailInfoDoctor: saveDetailInfoDoctor,
    getDetailInfoDoctorById: getDetailInfoDoctorById,
    updateDetailInfoDoctor: updateDetailInfoDoctor
}