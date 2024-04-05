import express from "express";
import initWebRoutes from "./routes/web";
import configViewEngine from "./config/viewEngine";
import connectDB from "./config/connectDB";
import cors from "cors";

require("dotenv").config();

import bodyParser from "body-parser";
//để lấy các tham số bên Client gửi lên: query, params, body

let app = express();
app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});
app.use(cors({ origin: true }));


//config app
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//config view engine
configViewEngine(app);

//init all web routes
initWebRoutes(app);

//connect to DB
connectDB();

let PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Backend is running on port ${PORT}`);
});