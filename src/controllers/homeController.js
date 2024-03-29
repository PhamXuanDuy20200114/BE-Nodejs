import db from "../models/index.js";
import CRUDService from "../services/CRUDService.js";

let getHomePage = async (req, res) => {
    try {
        let data = await db.User.findAll();

        return res.render("homePage.ejs", { data: data });
    } catch (e) {
        console.log(e);
    }

}

let getAboutPage = (req, res) => {
    return res.render("test/about.ejs");

}

let getCRUD = (req, res) => {
    return res.render("crud.ejs");
}

let postCRUD = async (req, res) => {
    let message = await CRUDService.createNewUser(req.body);
    return res.send("Post CRUD from controller");
}

let displayGetCRUD = async (req, res) => {
    let listUsers = await CRUDService.getAllUsers();
    return res.render("displayCRUD.ejs", { data: listUsers });
}

let getEditCRUD = async (req, res) => {
    let userId = req.query.id;
    if (!userId) {
        return res.send("User is not found");
    }
    let userData = await CRUDService.getUserById(userId);
    if (!userData) {
        return res.send("User's data is not found");
    }
    return res.render("editCRUD.ejs", { userData: userData });
}

let putCRUD = async (req, res) => {
    let allUsers = await CRUDService.updateUserData(req.body);
    return res.render("displayCRUD.ejs", { data: allUsers });

}

module.exports = {
    getHomePage: getHomePage,
    getAboutPage: getAboutPage,
    getCRUD: getCRUD,
    postCRUD: postCRUD,
    displayGetCRUD: displayGetCRUD,
    getEditCRUD: getEditCRUD,
    putCRUD: putCRUD
}