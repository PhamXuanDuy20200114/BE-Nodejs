import { raw } from 'body-parser';
import db from '../models/index';
require('dotenv').config();
import _, { at, includes } from 'lodash';
import { where } from 'sequelize';

const saveDetailPatient = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data || !data.email || !data.date || !data.timeType || !data.doctorId) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameters'
                });
            } else {
                let user = await db.User.findOrCreate({
                    where: { email: data.email },
                    defaults: {
                        email: data.email,
                        role: 'R3'
                    },
                    raw: false
                });

                console.log('user:', user);

                if (user && user[0]) {
                    await db.Booking.findOrCreate({
                        where: {
                            patientId: user[0].id,
                        },
                        defaults: {
                            statusId: 'S1',
                            doctorId: data.doctorId,
                            patientId: user[0].id,
                            date: data.date,
                            timeType: data.timeType,
                        }
                    })
                }

            }
            resolve({
                errCode: 0,
                message: 'Save info user success',
            });

        } catch (e) {
            console.log('error:', e);
            return res.status(200).json({
                errCode: -1,
                message: 'Error from server'
            });
        }
    });
}

module.exports = {
    saveDetailPatient
}