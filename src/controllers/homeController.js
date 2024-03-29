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
    console.log(message);
    return res.send("Post CRUD from controller");
}

module.exports = {
    getHomePage: getHomePage,
    getAboutPage: getAboutPage,
    getCRUD: getCRUD,
    postCRUD: postCRUD
}