import express from 'express';
import homeController from '../controllers/homeController';
import userController from '../controllers/userController';
import doctorController from '../controllers/doctorController';
import patientController from '../controllers/patientController';
import specialtyController from '../controllers/specialtyController';
import clinicController from '../controllers/clinicController';
let router = express.Router();

let initWebRoutes = (app) => {
    router.get("/", homeController.getHomePage);
    router.get("/about", homeController.getAboutPage);
    router.get("/crud", homeController.getCRUD);

    router.post("/post-crud", homeController.postCRUD);
    router.get("/get-crud", homeController.displayGetCRUD);
    router.get("/edit-crud", homeController.getEditCRUD);
    router.post("/put-crud", homeController.putCRUD);
    router.get("/delete-crud", homeController.deleteCRUD);

    router.post("/api/login", userController.handleLogin);
    router.get("/api/get-all-users", userController.handleGetAllUsers);
    router.put("/api/edit-user", userController.handleEditUser);
    router.delete("/api/delete-user", userController.handleDeleteUser);
    router.post("/api/create-new-user", userController.handleCreateNewUser);
    router.get("/api/allcode", userController.getAllcode);

    router.get("/api/top-doctor-home", doctorController.getTopDoctorHome);
    router.get("/api/get-all-doctors", doctorController.getAllDoctors);
    router.post("/api/save-info-doctor", doctorController.postInfoDoctor);
    router.get("/api/get-info-doctor", doctorController.getInfoDoctor);
    router.put("/api/update-info-doctor", doctorController.updateInfoDoctor);
    router.post("/api/bulk-create-schedule", doctorController.bulkCreateSchedule);
    router.get("/api/get-schedule-doctor-by-date", doctorController.getScheduleByDate);
    router.get("/api/get-extra-info-doctor-by-id", doctorController.getExtraInfoDoctor);
    router.get("/api/get-profile-doctor-by-id", doctorController.getProfileDoctorById);
    router.get("/api/get-doctor-by-specialty", doctorController.getTopDoctorBySpecialty);
    router.get("/api/get-doctor-by-clinic", doctorController.getTopDoctorByClinic);
    router.post("/api/send-remedy", doctorController.sendRemedy);

    router.post("/api/patient-book-appointment", patientController.postPatientBookAppointment);
    router.post("/api/verify-book-appointment", patientController.postVerifyBookAppointment);
    router.get("/api/get-all-patients", patientController.getAllPatientByDoctorIdAndDate);

    router.post("/api/create-new-specialty", specialtyController.createNewSpecialty);
    router.get("/api/get-all-specialties", specialtyController.getAllSpecialties);
    router.get("/api/get-detail-specialty", specialtyController.getDetailSpecialty);

    router.post("/api/create-new-clinic", clinicController.createNewClinic);
    router.get("/api/get-all-clinics", clinicController.getAllClinics);
    router.get("/api/get-detail-clinic", clinicController.getDetailClinic);

    return app.use("/", router);
}

module.exports = initWebRoutes;