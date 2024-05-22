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

module.exports = {
    getTopDoctorHome: getTopDoctorHome,
    getAllDoctors: getAllDoctors,
    postInfoDoctor: postInfoDoctor,
    getInfoDoctor: getInfoDoctor,
    updateInfoDoctor: updateInfoDoctor
}