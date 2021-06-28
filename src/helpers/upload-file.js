const path = require('path');
const { v4: uuidV4 } = require('uuid');

const uploadFile = (files, allowedExtensions = [], folder = '') => {
    return new Promise((resolve, reject) => {
        const { file } = files;
        const name = file.name.split('.');
        const extension = name[name.length - 1];

        if (!allowedExtensions.includes(extension)) {
            return reject('This file is not allowed');
        }
        
        const filename = (uuidV4()).toUpperCase() + '.' + extension;

        const uploadPath = path.join(__dirname, '../../uploads/', folder, filename);
    
        console.log({ uploadPath });

        file.mv(uploadPath, (err) => {
            if (err) {
                return reject(err);
            }
    
            return resolve(filename);
        });  
    });
}

module.exports = {
    uploadFile,
}