import patientService from '../services/patientService';

const postPatientBookAppointment = async (req, res) => {
    try {
        let response = await patientService.saveDetailPatient(req.body);
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

const postVerifyBookAppointment = async (req, res) => {
    try {
        let response = await patientService.verifyBookAppointment(req.body);
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

module.exports = {
    postPatientBookAppointment,
    postVerifyBookAppointment
}