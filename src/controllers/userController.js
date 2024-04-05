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
    let userId = req.body.id;
    let users = await userController.getAllUsers(userId);

    return res.status(200).json({
        errCode: 0,
        message: 'OK',
        users
    });
}
module.exports = {
    handleLogin: handleLogin,
    handleGetAllUsers: handleGetAllUsers
}