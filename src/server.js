import express from "express";
import initWebRoutes from "./routes/web";
import configViewEngine from "./config/viewEngine";
import connectDB from "./config/connectDB";

require("dotenv").config();

import bodyParser from "body-parser";
//để lấy các tham số bên Client gửi lên: query, params, body

let app = express();

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