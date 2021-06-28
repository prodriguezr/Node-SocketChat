const path = require('path');
const fs = require('fs');

// Cloudinary
const cloudinary = require('cloudinary').v2;
cloudinary.config(process.env.CLOUDINARY_URL);

const { response } = require("express");
const { uploadFile } = require('../../helpers');
const { User, Product } = require('../../models');

const loadFile = async(req = request, res = response) => {
    try {
        const filename = await uploadFile(req.files, [ 'txt', 'gif', 'jpeg', 'png' ], 'users');
    
        return res.status(200).json({
            status: 200,
            filename,
        });
    } catch (error) {
        return res.status(400).json({
            status: 400,
            error,
        });
    }
}

const associateFileToCollection = async(req = request, res = response) => {
    const { collection, id } = req.params;

    let model;

    switch (collection) {
        case 'products':
            model = await Product.findById(id);

            if (!model) {
                return res.status(400).json({
                    status: 400,
                    msg: `There is no product with id ${id}`
                });
            }

            break;
        case 'users':
            model = await User.findById(id);

            if (!model) {
                return res.status(400).json({
                    status: 400,
                    msg: `There is no user with id ${id}`
                });
            }

            break;
    
        default:
            return  res.status(500).json({
                status: 500,
                msg: 'Can not change image for this collection and id'
            });
    }

    if (model.img) {
        const publicId = model.img.split('/').pop().split('.').shift();

        await cloudinary.uploader.destroy(publicId);
    }

    try {
        const { tempFilePath } = req.files.file;
        const { secure_url } = await cloudinary.uploader.upload(tempFilePath);
            
        model.img = secure_url;

        await model.save();

        return res.status(200).json({
            status: 200,
            model,
        });
    } catch (error) {
        return res.status(400).json({
            status: 400,
            error,
        });
    }
}

const showImage = async(req = request, res = response) => {
    const { collection, id } = req.params;

    let model;
    let placeholder;

    switch (collection) {
        case 'products':
            model = await Product.findById(id);
            placeholder = 'no-image.jpeg';

            if (!model) {
                return res.status(400).json({
                    status: 400,
                    msg: `There is no product with id ${id}`
                });
            }

            break;
        case 'users':
            model = await User.findById(id);
            placeholder = 'no-user.jpeg';

            if (!model) {
                return res.status(400).json({
                    status: 400,
                    msg: `There is no user with id ${id}`
                });
            }

            break;
    
        default:
            return  res.status(500).json({
                status: 500,
                msg: 'Can not change image for this collection and id'
            });
    }

    if (model.img) {
        const imgPath = path.join(__dirname, '../../../uploads/', collection, model.img);

        if (fs.existsSync(imgPath)) {
            return res.sendFile(imgPath);
        }
    }

    const imgPath = path.join(__dirname, '../../../assets/', placeholder);

    if (fs.existsSync(imgPath)) {
        return res.sendFile(imgPath);
    }
}

module.exports = {
    associateFileToCollection,
    loadFile,
    showImage,
}