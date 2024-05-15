import userController from '../services/userController';

let handleLogin = async (req, res) => {
    let email = req.body.email;
    let password = req.body.password;

    //check email, password exist
    if (!email || !password) {
        return res.status(500).json({
            errCode: 1,
            message: "Missing inputs parameter!",
        });
    }

    let userData = await userController.handlelUserLogin(email, password);
    //compare password

    return res.status(200).json({
        errCode: userData.errCode,
        message: userData.errMessage,
        userData: userData.user ? userData.user : {}
    });
}


const handleGetAllUsers = async (req, res) => {
    let userId = req.query.id;
    let users = await userController.getAllUsers(userId);

    return res.status(200).json({
        errCode: 0,
        message: 'OK',
        data: users
    });
}

const handleCreateNewUser = async (req, res) => {
    let message = await userController.createNewUser(req.body);
    return res.status(200).json({
        errCode: message.errCode,
        message: message.message
    })
}

const handleEditUser = async (req, res) => {
    let data = req.body;
    let message = await userController.updateUser(data);
    return res.status(200).json(message);

}

const handleDeleteUser = async (req, res) => {
    let userId = req.query.id;
    if (!userId) {
        return res.status(200).json({
            errCode: 1,
            message: 'Missing required parameter!',
        });
    }
    let message = await userController.deleteUser(userId);
    return res.status(200).json(message);
}

const getAllcode = async (req, res) => {
    try {
        let type = req.query.type;
        let data = await userController.getAllCodeService(type);
        return res.status(200).json(data)
    } catch (e) {
        console.log(e)
        return res.status(200).json({
            errCode: -1,
            message: 'Error from server'
        })
    }
}

module.exports = {
    handleLogin: handleLogin,
    handleGetAllUsers: handleGetAllUsers,
    handleEditUser: handleEditUser,
    handleDeleteUser: handleDeleteUser,
    handleCreateNewUser: handleCreateNewUser,
    getAllcode: getAllcode
}