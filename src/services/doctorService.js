import { raw } from 'body-parser';
import db from '../models/index';
require('dotenv').config();
import _, { at } from 'lodash';


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
            if (!data.doctorId || !data.contentHTML || !data.contentMarkdown || !data.priceId || !data.provinceId || !data.paymentId || !data.addressClinic || !data.clinicName || !data.note) {
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
                await db.Doctor_info.create({
                    doctorId: data.doctorId,
                    priceId: data.priceId,
                    provinceId: data.provinceId,
                    paymentId: data.paymentId,
                    addressClinic: data.addressClinic,
                    clinicName: data.clinicName,
                    note: data.note,
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
                        { model: db.Markdown, as: 'doctorData' },
                        { model: db.Doctor_info, as: 'doctorInfoData' },
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
            if (!data.doctorId || !data.contentHTML || !data.contentMarkdown ||
                !data.priceId || !data.provinceId || !data.paymentId || !data.addressClinic ||
                !data.clinicName || !data.note) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameters'
                })
            } else {
                let doctorMarkdown = await db.Markdown.findOne({
                    where: {
                        doctorId: data.doctorId
                    },
                    raw: false
                })
                doctorMarkdown.contentHTML = data.contentHTML;
                doctorMarkdown.contentMarkdown = data.contentMarkdown;
                doctorMarkdown.description = data.description ? data.description : '';
                doctorMarkdown.updateAt = new Date();
                await doctorMarkdown.save();

                let doctorInfo = await db.Doctor_info.findOne({
                    where: {
                        doctorId: data.doctorId
                    },
                    raw: false
                })
                doctorInfo.priceId = data.priceId;
                doctorInfo.provinceId = data.provinceId;
                doctorInfo.paymentId = data.paymentId;
                doctorInfo.addressClinic = data.addressClinic;
                doctorInfo.clinicName = data.clinicName;
                doctorInfo.note = data.note ? data.note : '';
                doctorInfo.count = data.count;
                doctorInfo.updateAt = new Date();
                await doctorInfo.save();

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

const bulkCreateSchedule = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data || data.length === 0) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameters'
                })
            } else {
                if (data && data.length > 0) {
                    data.map(item => {
                        item.maxNumber = 10;
                        return item;
                    })
                }
                let existShedule = await db.Schedule.findAll({
                    where: {
                        doctorId: data[0].doctorId,
                        date: data[0].date
                    },
                    attributes: ['date', 'timeType', 'doctorId', 'maxNumber'],
                    raw: true
                })
                if (existShedule && existShedule.length > 0) {
                    let toCreate = _.differenceBy(data, existShedule, 'timeType');
                    if (toCreate && toCreate.length > 0) {
                        await db.Schedule.bulkCreate(
                            toCreate
                        );
                    }

                }
                else {
                    await db.Schedule.bulkCreate(data);
                }

                resolve({
                    errCode: 0,
                    message: 'Create schedule success'
                })
            }
        } catch (e) {
            console.log('error:', e);
            reject(e);
        }
    })
}

const getScheduleByDate = (doctorId, date) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!date || !doctorId) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameters'
                })
            } else {
                let schedule = await db.Schedule.findAll({
                    where: {
                        doctorId: doctorId,
                        date: date
                    },
                    include: [
                        { model: db.Allcode, as: 'timeTypeData', attributes: ['valueVi', 'valueEn'] },
                    ],
                    raw: false,
                    nest: true

                })
                if (!schedule) {
                    schedule = [];
                }
                resolve({
                    errCode: 0,
                    data: schedule
                })
            }
        }
        catch (e) {
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
    updateDetailInfoDoctor: updateDetailInfoDoctor,
    bulkCreateSchedule: bulkCreateSchedule,
    getScheduleByDate: getScheduleByDate
}