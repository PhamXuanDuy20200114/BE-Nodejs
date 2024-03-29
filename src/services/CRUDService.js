import bcrypt from 'bcryptjs';
import db from '../models/index';
const salt = bcrypt.genSaltSync(10);

let createNewUser = async (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            let hashPassword = await hashUserPassword(data.password);
            await db.User.create({
                email: data.email,
                password: hashPassword,
                first_name: data.first_name,
                last_name: data.last_name,
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

let updateUser = () => {

}

module.exports = {
    createNewUser: createNewUser,
    updateUser: updateUser,
    getAllUsers: getAllUsers
}