import { add, at, first, last, reject } from 'lodash';
import db from '../models/index';
require('dotenv').config();
import emailService from './emailService';
import { v4 as uuidv4 } from 'uuid';
import { raw } from 'body-parser';

let buildUrlEmail = (doctorId, token) => {
    let result = `${process.env.URL_REACT}/verify-booking/?token=${token}&doctorId=${doctorId}`
    return result;
}

const saveDetailPatient = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data || !data.email || !data.date || !data.timeType || !data.doctorId
                || !data.fullName || !data.phoneNumber || !data.timeString
            ) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameters'
                });
            } else {
                console.log('data:', data);
                let token = uuidv4(); // ⇨ '9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d'
                let fullName = data.fullName;
                let phoneNumber = data.phoneNumber;
                let email = data.email;
                let gender = data.gender;
                let address = data.address;
                await emailService.sendSimpleEmail({
                    reciverEmail: data.email,
                    patientName: data.fullName,
                    timeString: data.timeString,
                    doctorName: data.doctorName,
                    redirectLink: buildUrlEmail(data.doctorId, token),
                });

                let user = await db.User.findOrCreate({
                    where: { email: data.email },
                    defaults: {
                        email: email,
                        firstName: fullName,
                        address: address,
                        phonenumber: phoneNumber,
                        gender: gender,
                        roleId: 'R3'
                    },
                    raw: false
                });


                if (user && user[0]) {
                    let booking = await db.Booking.findOrCreate({
                        where: {
                            patientId: user[0].id,
                        },
                        defaults: {
                            patientId: user[0].id,
                            date: data.date,
                            timeType: data.timeType,
                            doctorId: data.doctorId,
                            token: token,
                            statusId: 'S1'
                        },
                        raw: false
                    })
                    if (booking && booking[0]) {
                        booking[0].timeType = data.timeType;
                        booking[0].doctorId = data.doctorId;
                        booking[0].token = token;
                        booking[0].statusId = 'S1';
                        await booking[0].save();
                    }
                }
                resolve({
                    errCode: 0,
                    message: 'Save info user success',
                });
            }

        } catch (e) {
            console.log('error:', e);
            return res.status(200).json({
                errCode: -1,
                message: 'Error from server'
            });
        }
    });
}

const verifyBookAppointment = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data || !data.token || !data.doctorId) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameters'
                });
            } else {
                let booking = await db.Booking.findOne({
                    where: {
                        token: data.token,
                        doctorId: data.doctorId,
                        statusId: 'S1'
                    },
                    raw: false
                });

                if (booking) {
                    booking.statusId = 'S2';
                    await booking.save();
                    resolve({
                        errCode: 0,
                        message: 'Update appoinment status Success'
                    });
                } else {
                    resolve({
                        errCode: 2,
                        errMessage: 'Appointment not found'
                    });
                }
            }

        } catch (e) {
            console.log('error:', e);
            reject(e);
        }
    })
}

const getAllPatientByDoctorIdAndDate = (doctorId, date) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!doctorId || !date) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameters'
                });
            } else {
                let data = await db.Booking.findAll({
                    where: {
                        doctorId: doctorId,
                        date: date,
                        statusId: 'S2'
                    },
                    include: [
                        {
                            model: db.User, as: 'patientBookingData', attributes: ['firstName', 'email', 'phonenumber'],
                            include: [
                                { model: db.Allcode, as: 'genderData', attributes: ['valueVi', 'valueEn'] }
                            ]
                        },
                        { model: db.Allcode, as: 'timeData', attributes: ['valueVi', 'valueEn'] },
                    ],
                    raw: false,
                    nest: true
                });
                resolve({
                    errCode: 0,
                    data: data
                });
            }
        } catch (e) {
            console.log('error:', e);
            reject(e);
        }
    })
}

module.exports = {
    saveDetailPatient,
    verifyBookAppointment,
    getAllPatientByDoctorIdAndDate
}