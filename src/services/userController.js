import db from '../models/index';
import bcrypt from 'bcryptjs';

const salt = bcrypt.genSaltSync(10);

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
                    delete userExist.password;
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
                attributes: ['email', 'roleId', 'password', 'firstName', 'lastName'],
                where: { email: userEmail }
            })

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

let createNewUser = async (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            let isEmailExist = await checkEmailExist(data.email);
            if (isEmailExist) {
                resolve({ errCode: 1, message: 'Your email is already in used. Please try another email' });
            } else {
                let hashPassword = await hashUserPassword(data.password);

                await db.User.create({
                    email: data.email,
                    password: hashPassword,
                    firstName: data.firstName,
                    lastName: data.lastName,
                    address: data.address,
                    phonenumber: data.phoneNumber,
                    gender: data.gender,
                    roleId: data.role,
                    positionId: data.position,
                    image: data.image,
                });
                resolve({ errCode: 0, message: "OK" });

            }
        } catch (e) {
            reject(e);
        }
    });
}

const checkEmailExist = async (email) => {
    return new Promise(async (resolve, reject) => {
        try {
            let user = await db.User.findOne({
                where: { email: email }
            });
            if (user) {
                resolve(true);
            } else {
                resolve(false);
            }
        } catch (e) {
            reject(e);
        }
    });

}

let hashUserPassword = (password) => {
    return new Promise(async (resolve, reject) => {
        try {
            let hash = await bcrypt.hashSync(password, salt);
            resolve(hash);
        } catch (e) {
            reject(e);
        }
    })
}

const updateUser = async (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.id || !data.role || !data.position || !data.gender) {
                resolve({ errCode: 1, message: 'Missing required parameter' });
            }
            let user = await db.User.findOne({
                where: { id: data.id },
                raw: false
            });
            if (user) {
                user.firstName = data.firstName;
                user.lastName = data.lastName;
                user.phonenumber = data.phoneNumber;
                user.address = data.address;
                user.roleId = data.role;
                user.positionId = data.position;
                user.gender = data.gender;
                user.updateAt = new Date();
                if (data.image) {
                    user.image = data.image;
                }
                await user.save();
                resolve({ errCode: 0, message: 'Update the user success', user });
            } else {
                resolve({ errCode: 2, message: 'The user isnt exist' });
            }
        }
        catch (e) {
            reject(e);

        }
    });
}

const deleteUser = async (userId) => {
    return new Promise(async (resolve, reject) => {
        try {
            let user = await db.User.findOne({
                where: { id: userId }
            })
            if (!user) {
                resolve({ errCode: 2, message: 'The user isnt exist' });
            }
            await db.User.destroy({ where: { id: userId } });
            resolve({ errCode: 0, message: 'The user has been deleted' });

        } catch (e) {
            reject(e);
        }
    });
}

const getAllCodeService = async (type) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!type) {
                resolve({ errCode: 1, message: 'Missing required parameter' })
            } else {
                let res = {};
                let allcode = await db.Allcode.findAll({
                    where: { type: type }

                });
                res.errCode = 0;
                res.data = allcode;
                resolve(res)
            }
        } catch (e) {
            reject(e);
        }
    })
}

module.exports = {
    handlelUserLogin: handlelUserLogin,
    getAllUsers: getAllUsers,
    createNewUser: createNewUser,
    deleteUser: deleteUser,
    updateUser: updateUser,
    getAllCodeService: getAllCodeService
}