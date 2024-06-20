import specialtyService from '../services/specialtyService';
const createNewSpecialty = async (req, res) => {
    try {
        let message = await specialtyService.createNewSpecialty(req.body);
        return res.status(200).json(message);
    } catch (e) {
        console.log('error: ', e);
        return res.status(500).json({
            errCode: -1,
            message: 'Error from server'
        });
    }
}

const getAllSpecialties = async (req, res) => {
    try {
        let data = await specialtyService.getAllSpecialties();
        return res.status(200).json(data);
    } catch (e) {
        console.log('error: ', e);
        return res.status(500).json({
            errCode: -1,
            message: 'Error from server'
        });
    }

}

const getDetailSpecialty = async (req, res) => {
    try {
        let data = await specialtyService.getDetailSpecialty(req.query.id);
        return res.status(200).json(data);
    } catch (e) {
        console.log('error: ', e);
        return res.status(500).json({
            errCode: -1,
            message: 'Error from server'
        });
    }

}

module.exports = {
    createNewSpecialty: createNewSpecialty,
    getAllSpecialties: getAllSpecialties,
    getDetailSpecialty: getDetailSpecialty,
}