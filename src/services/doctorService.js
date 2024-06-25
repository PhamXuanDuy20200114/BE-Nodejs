import { raw } from 'body-parser';
import db from '../models/index';
require('dotenv').config();
import _, { at, includes } from 'lodash';
import specialty from '../models/specialty';

let checkRequiredFields = (data) => {
    let arrField = ['doctorId', 'contentHTML', 'contentMarkdown', 'specialtyId', 'clinicId`', 'priceId', 'provinceId', 'paymentId', 'note'];
    let check = true;
    for (let i = 0; i < arrField.length; i++) {
        if (!data[arrField[i]]) {
            check = false;
            break;
        }
    }
    return check;
}

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
            if (!checkRequiredFields(data)) {
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
                    specialtyId: data.specialtyId,
                    clinicId: data.clinicId,
                    priceId: data.priceId,
                    provinceId: data.provinceId,
                    paymentId: data.paymentId,
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
                        {
                            model: db.Markdown, as: 'doctorData'
                        }
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
            if (!checkRequiredFields(data)) {
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
                doctorInfo.specialtyId = data.specialtyId;
                doctorInfo.clinicId = data.clinicId;
                doctorInfo.priceId = data.priceId;
                doctorInfo.provinceId = data.provinceId;
                doctorInfo.paymentId = data.paymentId;
                doctorInfo.note = data.note ? data.note : '';
                doctorInfo.count = data.count ? data.count : 0;
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
                        { model: db.User, as: 'doctorData', attributes: ['firstName', 'lastName'] }
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

const getExtraInfoDoctorById = (doctorId) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!doctorId) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameters'
                })
            } else {
                let data = await db.Doctor_info.findOne({
                    where: { doctorId: doctorId },
                    attributes: {
                        exclude: ['id', 'doctorId']
                    },
                    include: [
                        { model: db.Allcode, as: 'priceData', attributes: ['valueVi', 'valueEn'] },
                        { model: db.Allcode, as: 'provinceData', attributes: ['valueVi', 'valueEn'] },
                        { model: db.Allcode, as: 'paymentData', attributes: ['valueVi', 'valueEn'] },
                        { model: db.Specialty, as: 'specialtyData', attributes: ['name'] },
                        { model: db.Clinic, as: 'clinicData', attributes: ['name', 'address'] },
                    ],
                    raw: false,
                    nest: true
                })
                if (!data) {
                    data = {};
                }
                resolve({
                    errCode: 0,
                    data: data
                })
            }
        }
        catch (e) {
            console.log('error:', e);
            reject(e);
        }
    })
}

const getProfileDoctorById = (doctorId) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!doctorId) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameters'
                })
            }
            else {
                let data = await db.User.findOne({
                    where: { id: doctorId },
                    attributes: {
                        exclude: ['password']
                    },
                    include: [
                        { model: db.Markdown, as: 'doctorData' },
                        {
                            model: db.Doctor_info,
                            attributes: {
                                exclude: ['id', 'doctorId']
                            },
                            include: [
                                { model: db.Allcode, as: 'priceData', attributes: ['valueVi', 'valueEn'] },
                                { model: db.Allcode, as: 'provinceData', attributes: ['valueVi', 'valueEn'] },
                                { model: db.Allcode, as: 'paymentData', attributes: ['valueVi', 'valueEn'] },
                            ],
                            as: 'doctorInfoData'
                        },
                        { model: db.Allcode, as: 'positionData', attributes: ['valueVi', 'valueEn'] },
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
        }
        catch (e) {
            console.log('error:', e);
            reject(e);
        }
    })
}

const getTopDoctorBySpecialty = (specialtyId, location) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!specialtyId || !location) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameters'
                })
            }
            else {
                let doctorIdArr = [];
                if (location === 'ALL') {
                    let data = await db.Doctor_info.findAll({
                        where: { specialtyId: specialtyId },
                        attributes: ['doctorId'],
                        raw: true
                    })
                    if (data && data.length > 0) {
                        for (let i = 0; i < data.length; i++) {
                            doctorIdArr.push(data[i].doctorId);
                        }
                    }

                } else {
                    let data = await db.Doctor_info.findAll({
                        where: {
                            specialtyId: specialtyId,
                            provinceId: location
                        },
                        attributes: ['doctorId'],
                        raw: true
                    })
                    if (data && data.length > 0) {
                        for (let i = 0; i < data.length; i++) {
                            doctorIdArr.push(data[i].doctorId);
                        }
                    }
                }

                resolve({
                    errCode: 0,
                    data: doctorIdArr
                })
            }
        }
        catch (e) {
            console.log('error:', e);
            reject(e);
        }
    })
}

const getTopDoctorByClinic = (clinicId) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!clinicId) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameters'
                })
            }
            else {
                let data = await db.Doctor_info.findAll({
                    where: { clinicId: clinicId },
                    attributes: ['doctorId'],
                    raw: true
                })
                let doctorIdArr = [];
                if (data && data.length > 0) {
                    for (let i = 0; i < data.length; i++) {
                        doctorIdArr.push(data[i].doctorId);
                    }
                }
                resolve({
                    errCode: 0,
                    data: doctorIdArr
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
    getScheduleByDate: getScheduleByDate,
    getExtraInfoDoctorById: getExtraInfoDoctorById,
    getProfileDoctorById: getProfileDoctorById,
    getTopDoctorBySpecialty: getTopDoctorBySpecialty,
    getTopDoctorByClinic: getTopDoctorByClinic
}