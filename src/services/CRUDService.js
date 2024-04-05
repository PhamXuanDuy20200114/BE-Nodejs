import bcrypt from 'bcryptjs';
import db from '../models/index';
import { raw } from 'body-parser';
const salt = bcrypt.genSaltSync(10);

let createNewUser = async (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            let hashPassword = await hashUserPassword(data.password);
            await db.User.create({
                email: data.email,
                password: hashPassword,
                firstName: data.firstName,
                lastName: data.lastName,
                address: data.address,
                phonenumber: data.phonenumber,
                gender: data.gender === '1' ? true : false,
                roleId: data.roleId,
                positionId: data.positionId
            });
            resolve("Create new user success");
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

let getAllUsers = async () => {
    return new Promise(async (resolve, reject) => {
        try {
            let users = await db.User.findAll({
                raw: true
            });
            console.log(users);
            resolve(users);
        } catch (e) {
            reject(e);
        }
    })
}

let getUserById = async (userId) => {
    return new Promise(async (resolve, reject) => {
        try {
            let user = await db.User.findOne({
                where: { id: userId },
                raw: true
            });
            resolve(user);
        } catch (e) {
            reject(e);
        }
    })
}

let updateUserData = async (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            let user = await db.User.findOne(
                {
                    where: { id: data.id }
                });
            if (user) {
                user.firstName = data.firstName;
                user.lastName = data.lastName;
                user.address = data.address;
                user.phonenumber = data.phonenumber;
                await user.save();
                let allUsers = await db.User.findAll();
                resolve(allUsers);
            }
        } catch (e) {
            reject(e);
        }
    })
}

let deleteUserById = async (userId) => {
    return new Promise(async (resolve, reject) => {
        try {
            let user = await db.User.findOne({
                where: { id: userId }
            });
            if (user) {
                await user.destroy();
            }
            resolve("Delete user success");
        } catch (e) {
            reject(e);
        }
    })
}

module.exports = {
    createNewUser: createNewUser,
    getUserById: getUserById,
    getAllUsers: getAllUsers,
    updateUserData: updateUserData,
    deleteUserById: deleteUserById
}