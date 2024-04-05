import db from '../models/index';
import bcrypt from 'bcryptjs';

let handlelUserLogin = async (email, password) => {
    return new Promise(async (resolve, reject) => {
        try {
            let userData = {};
            let userExist = await checkUserEmail(email);
            if (userExist) {
                let checkPassword = await bcrypt.compare(password, userExist.password);
                if (checkPassword) {
                    userData.errCode = 0;
                    userData.errMessage = 'Login success';
                    delete userExist.dataValues.password;
                    userData.user = userExist;
                    resolve(userData);
                }
                else {
                    userData.errCode = 3;
                    userData.errMessage = 'Your password is incorrect. Please try again';
                    resolve(userData);
                }

            } else {
                userData.errCode = 1;
                userData.errMessage = 'Your email isnt exist in system. Please try other email';
                resolve(userData);
            }
        }
        catch (e) {
            reject(e);
        }
    })
}

let checkUserEmail = async (userEmail) => {
    return new Promise(async (resolve, reject) => {
        try {
            let user = await db.User.findOne({
                attributes: ['email', 'roleId', 'password'],
                where: { email: userEmail }
            })
            console.log(user);

            if (user) {
                resolve(user);
            } else {
                resolve(false);
            }
        }
        catch (e) {
            reject(e);
        }
    })
}

const getAllUsers = async (userId) => {
    return new Promise(async (resolve, reject) => {
        try {
            let users = '';
            if (userId === 'ALL') {
                users = await db.User.findAll(
                    {
                        attributes: {
                            exclude: ['password']
                        }
                    }
                );
            }
            if (userId && userId !== 'ALL') {
                users = await db.User.findOne({
                    where: { id: userId },
                    attributes: { exclude: ['password'] }
                })
            }
            resolve(users);
        } catch (e) {
            reject(e);
        }
    })
}

module.exports = {
    handlelUserLogin: handlelUserLogin,
    getAllUsers: getAllUsers
}