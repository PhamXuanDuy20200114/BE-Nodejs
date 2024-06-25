import db from "../models";

const createNewClinic = async (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.name || !data.address || !data.imageLogo || !data.imageBackground) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameters',
                });
            } else {
                await db.Clinic.create({
                    name: data.name,
                    address: data.address,
                    introHTML: data.introHTML,
                    introMarkdown: data.introMarkdown,
                    expertiseHTML: data.expertiseHTML,
                    expertiseMarkdown: data.expertiseMarkdown,
                    equipmentHTML: data.equipmentHTML,
                    equipmentMarkdown: data.equipmentMarkdown,
                    processHTML: data.processHTML,
                    processMarkdown: data.processMarkdown,
                    priceHTML: data.priceHTML,
                    priceMarkdown: data.priceMarkdown,
                    imageLogo: data.imageLogo,
                    imageBackground: data.imageBackground,
                });
                resolve({
                    errCode: 0,
                    errMessage: 'OK',
                });
            }
        } catch (error) {
            reject(error);
        }
    });
}

const getAllClinics = async () => {
    return new Promise(async (resolve, reject) => {
        try {
            let data = await db.Clinic.findAll();
            resolve({
                errCode: 0,
                data: data,
            });
        } catch (error) {
            reject(error);
        }
    });
}

const getDetailClinic = async (clinicId) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!clinicId) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameters',
                });
            } else {
                let data = await db.Clinic.findOne({
                    where: { id: clinicId },
                });
                if (data) {
                    resolve({
                        errCode: 0,
                        data: data,
                    });
                } else {
                    resolve({
                        errCode: 2,
                        errMessage: 'Cannot find clinic',
                    });
                }
            }
        } catch (error) {
            reject(error);
        }
    });

}

module.exports = {
    createNewClinic,
    getAllClinics,
    getDetailClinic
};