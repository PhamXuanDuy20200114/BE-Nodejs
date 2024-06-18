import db from '../models/index';

const createNewSpecialty = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data || !data.name || !data.descriptionHTML || !data.descriptionMarkdown || !data.image) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameters'
                });
            }
            await db.Specialty.create({
                name: data.name,
                descriptionHTML: data.descriptionHTML,
                descriptionMarkdown: data.descriptionMarkdown,
                image: data.image
            });
            resolve({
                errCode: 0,
                message: 'Save specialty success'
            });
        } catch (e) {
            console.log('error: ', e);
            return res.status(500).json({
                errCode: -1,
                message: 'Error from server'
            });
        }
    });
}

module.exports = {
    createNewSpecialty: createNewSpecialty
}