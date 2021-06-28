const { Router } = require('express');
const { check } = require('express-validator');
const { isAllowedCollection } = require('../../helpers');

const { validateFields, validateFile } = require('../../middlewares');
const { UploadCtrl } = require('../controllers');

const router = Router();

router.post('/', validateFile, UploadCtrl.loadFile);

router.get('/:collection/:id', [
    check('id', 'Invalid MongoId').isMongoId(),
    check('collection').custom(c => isAllowedCollection(c, ['users', 'products'])),
    validateFields,
], UploadCtrl.showImage);

router.put('/:collection/:id', [
    validateFile,
    check('id', 'Invalid MongoId').isMongoId(),
    check('collection').custom(c => isAllowedCollection(c, ['users', 'products'])),
    validateFields,
], UploadCtrl.associateFileToCollection);

module.exports = router;