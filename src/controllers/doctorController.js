import doctorService from '../services/doctorService';

const getTopDoctorHome = async (req, res) => {
    let limit = req.query.limit;
    if (!limit) limit = 10;
    try {
        let response = await doctorService.getTopDoctorHome(+limit);
        return res.status(200).json(response);
    } catch (e) {
        console.log('error:', e);
        return res.status(200).json({
            errCode: -1,
            message: 'Error from server'
        });
    }

}

const getAllDoctors = async (req, res) => {
    try {
        let doctors = await doctorService.getAllDoctors();
        return res.status(200).json(doctors);
    } catch (e) {
        console.log('error:', e);
        return res.status(200).json({
            errCode: -1,
            message: 'Error from server'
        });
    }
}

const postInfoDoctor = async (req, res) => {
    try {
        let response = await doctorService.saveDetailInfoDoctor(req.body);
        return res.status(200).json(response);
    } catch (e) {
        console.log('error:', e);
        return res.status(200).json({
            errCode: -1,
            message: 'Error from server'
        });

    }
}

const getInfoDoctor = async (req, res) => {
    try {
        let response = await doctorService.getDetailInfoDoctorById(req.query.id);
        return res.status(200).json(response);
    } catch (e) {
        console.log('error:', e);
        return res.status(200).json({
            errCode: -1,
            message: 'Error from server'
        });
    }

}

const updateInfoDoctor = async (req, res) => {
    try {
        let response = await doctorService.updateDetailInfoDoctor(req.body);
        return res.status(200).json(response);
    } catch (e) {
        console.log('error:', e);
        return res.status(200).json({
            errCode: -1,
            message: 'Error from server'
        });
    }
}

const bulkCreateSchedule = async (req, res) => {
    try {
        let response = await doctorService.bulkCreateSchedule(req.body);
        return res.status(200).json(response);
    } catch (e) {
        console.log('error:', e);
        return res.status(200).json({
            errCode: -1,
            message: 'Error from server'
        });
    }

}

const getScheduleByDate = async (req, res) => {
    try {
        let response = await doctorService.getScheduleByDate(req.query.doctorId, req.query.date);
        return res.status(200).json(response);
    } catch (e) {
        console.log('error:', e);
        return res.status(200).json({
            errCode: -1,
            message: 'Error from server'
        });
    }
}

const getExtraInfoDoctor = async (req, res) => {
    try {
        let response = await doctorService.getExtraInfoDoctorById(req.query.id);
        return res.status(200).json(response);
    }
    catch (e) {
        console.log('error:', e);
        return res.status(200).json({
            errCode: -1,
            message: 'Error from server'
        });
    }
}

const getProfileDoctorById = async (req, res) => {
    try {
        let response = await doctorService.getProfileDoctorById(req.query.id);
        return res.status(200).json(response);
    }
    catch (e) {
        console.log('error:', e);
        return res.status(200).json({
            errCode: -1,
            message: 'Error from server'
        });
    }

}

const getTopDoctorBySpecialty = async (req, res) => {
    try {
        let data = await doctorService.getTopDoctorBySpecialty(req.query.id, req.query.location);
        return res.status(200).json(data);
    }
    catch (e) {
        console.log('error: ', e);
        return res.status(500).json({
            errCode: -1,
            message: 'Error from server'
        });
    }
}

const getTopDoctorByClinic = async (req, res) => {
    try {
        let data = await doctorService.getTopDoctorByClinic(req.query.id);
        return res.status(200).json(data);
    }
    catch (e) {
        console.log('error: ', e);
        return res.status(500).json({
            errCode: -1,
            message: 'Error from server'
        });
    }
}
module.exports = {
    getTopDoctorHome: getTopDoctorHome,
    getAllDoctors: getAllDoctors,
    postInfoDoctor: postInfoDoctor,
    getInfoDoctor: getInfoDoctor,
    updateInfoDoctor: updateInfoDoctor,
    bulkCreateSchedule: bulkCreateSchedule,
    getScheduleByDate: getScheduleByDate,
    getExtraInfoDoctor: getExtraInfoDoctor,
    getProfileDoctorById: getProfileDoctorById,
    getTopDoctorBySpecialty: getTopDoctorBySpecialty,
    getTopDoctorByClinic: getTopDoctorByClinic
}