import clinicService from '../services/clinicService';

const createNewClinic = async (req, res) => {
    try {
        let data = req.body;
        let clinic = await clinicService.createNewClinic(data);
        res.status(200).json(clinic);
    } catch (error) {
        console.log('error: ', error);
        return res.status(500).json(error);
    }
}

const getAllClinics = async (req, res) => {
    try {
        let data = await clinicService.getAllClinics();
        res.status(200).json(data);
    } catch (error) {
        console.log('error: ', error);
        return res.status(500).json(error);
    }

}

const getDetailClinic = async (req, res) => {
    try {
        let clinicId = req.query.id;
        let clinic = await clinicService.getDetailClinic(clinicId);
        res.status(200).json(clinic);
    } catch (error) {
        console.log('error: ', error);
        return res.status(500).json(error);
    }

}

module.exports = {
    createNewClinic,
    getAllClinics,
    getDetailClinic
};