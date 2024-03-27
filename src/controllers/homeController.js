import db from "../models/index.js";

let getHomePage = async (req, res) => {
    try {
        let data = await db.User.findAll();
        console.log('----------------------');
        console.log(data);
        return res.render("homePage.ejs", { data: data });
    } catch (e) {
        console.log(e);
    }

}

let getAboutPage = (req, res) => {
    return res.render("test/about.ejs");

}

module.exports = {
    getHomePage: getHomePage,
    getAboutPage: getAboutPage
}